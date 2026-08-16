from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(prefix="/health", tags=["System"])


@router.get("")
async def health_check():
    return {
        "status": "ok",
        "application": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }