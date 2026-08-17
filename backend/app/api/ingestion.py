from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.ingestion import UploadResponse
from app.services.ingestion_service import process_file


router = APIRouter(
    prefix="/api/ingestion",
    tags=["Ingestion"],
)


@router.post(
    "/upload",
    response_model=UploadResponse,
)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is required.",
        )

    extension = file.filename.lower().split(".")[-1]

    if extension not in {
        "csv",
        "xlsx",
        "xls",
    }:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Use CSV or Excel."
            ),
        )

    content = await file.read()

    try:
        result = process_file(
            db=db,
            filename=file.filename,
            content=content,
        )

        return result

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc