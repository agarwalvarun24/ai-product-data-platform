import uuid

from sqlalchemy.orm import Session

from app.data_engine.attribute_parser import (
    extract_attributes,
)
from app.data_engine.cleaner import (
    clean_product_row,
)
from app.data_engine.normalizer import (
    normalize_product_row,
)
from app.data_engine.quality import (
    calculate_quality_score,
)
from app.ingestion.csv_loader import load_csv
from app.ingestion.excel_loader import load_excel
from app.models.dataset import Dataset
from app.models.product import Product


def process_file(
    db: Session,
    filename: str,
    content: bytes,
) -> dict:
    extension = filename.lower().split(".")[-1]

    if extension == "csv":
        rows = load_csv(content)
        source_type = "csv"

    elif extension in {"xlsx", "xls"}:
        rows = load_excel(content)
        source_type = "excel"

    else:
        raise ValueError(
            "Only CSV, XLSX and XLS files are supported."
        )

    dataset_id = str(uuid.uuid4())

    dataset = Dataset(
        id=dataset_id,
        filename=filename,
        source_type=source_type,
        total_rows=len(rows),
        valid_rows=0,
    )

    db.add(dataset)

    created = 0

    for raw_row in rows:
        cleaned = clean_product_row(raw_row)
        normalized = normalize_product_row(cleaned)

        if not any(normalized.values()):
            continue

        title = normalized.get("raw_title")

        attributes = extract_attributes(
            " ".join(
                str(value)
                for value in normalized.values()
                if value
            )
        )

        product_data = {
            **normalized,
            "attributes": attributes,
            "source": source_type,
        }

        product_data["quality_score"] = (
            calculate_quality_score(product_data)
        )

        product = Product(
            id=str(uuid.uuid4()),
            sku=product_data.get("sku"),
            manufacturer=product_data.get(
                "manufacturer"
            ),
            raw_title=title,
            raw_description=product_data.get(
                "raw_description"
            ),
            category=product_data.get("category"),
            attributes=attributes,
            quality_score=product_data[
                "quality_score"
            ],
            source=source_type,
        )

        db.add(product)
        created += 1

    dataset.valid_rows = created

    db.commit()

    return {
        "success": True,
        "dataset_id": dataset_id,
        "filename": filename,
        "source_type": source_type,
        "total_rows": len(rows),
        "valid_rows": created,
        "products_created": created,
        "message": (
            f"Successfully imported {created} products."
        ),
    }