from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.ai.enrichment import enrich_product
from app.database.connection import get_db
from app.models.product import Product
from app.schemas.enrichment import EnrichmentResponse


router = APIRouter(
    prefix="/api/enrichment",
    tags=["AI Enrichment"],
)


@router.post(
    "/{product_id}",
    response_model=EnrichmentResponse,
)
def enrich_single_product(
    product_id: str,
    db: Session = Depends(get_db),
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found.",
        )

    source = {
        "sku": product.sku,
        "manufacturer": product.manufacturer,
        "raw_title": product.raw_title,
        "raw_description": product.raw_description,
        "category": product.category,
        "attributes": product.attributes,
    }

    try:
        result = enrich_product(source)

        product.title = result["title"]
        product.description = result[
            "description"
        ]
        product.category = result["category"]
        product.attributes = result[
            "attributes"
        ]
        product.confidence_score = result[
            "confidence_score"
        ]

        if result["confidence_score"] >= 90:
            product.enrichment_status = "completed"
            product.review_status = "not_required"

        else:
            product.enrichment_status = "completed"
            product.review_status = "review"

        db.commit()
        db.refresh(product)

        return EnrichmentResponse(
            success=True,
            product_id=product.id,
            title=product.title,
            description=product.description,
            category=product.category,
            attributes=product.attributes,
            confidence_score=product.confidence_score,
            validation_errors=result[
                "validation_errors"
            ],
            message="Product enriched successfully.",
        )

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc