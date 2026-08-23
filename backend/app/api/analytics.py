from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import get_db
from app.models.product import Product

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
)


@router.get("/summary")
def get_analytics_summary(
    db: Session = Depends(get_db),
):
    total_products = db.query(Product).count()

    enriched_products = (
        db.query(Product)
        .filter(Product.enrichment_status == "completed")
        .count()
    )

    review_products = (
        db.query(Product)
        .filter(Product.review_status == "review")
        .count()
    )

    average_confidence = (
        db.query(func.avg(Product.confidence_score))
        .filter(Product.confidence_score.isnot(None))
        .scalar()
    )

    if average_confidence is None:
        average_confidence = 0

    coverage = 0

    if total_products > 0:
        coverage = (
            enriched_products / total_products
        ) * 100

    return {
        "total_products": total_products,
        "ai_enriched": enriched_products,
        "needs_review": review_products,
        "enrichment_coverage": round(coverage, 1),
        "average_ai_confidence": round(
            float(average_confidence), 1
        ),
        "pipeline": {
            "imported": total_products,
            "ai_enriched": enriched_products,
            "needs_review": review_products,
        },
    }