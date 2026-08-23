from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.product import Product
from app.schemas.review import (
    ReviewCreate,
    ReviewResponse,
)
from app.services.review_service import create_review


router = APIRouter(
    prefix="/api/review",
    tags=["Review"],
)


@router.get("/pending")
def get_pending_reviews(
    db: Session = Depends(get_db),
):
    products = (
        db.query(Product)
        .filter(Product.review_status == "review")
        .order_by(Product.updated_at.desc())
        .all()
    )

    return {
        "total": len(products),
        "products": products,
    }


@router.post(
    "",
    response_model=ReviewResponse,
)
def submit_review(
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
):
    review = create_review(
        db=db,
        product_id=review_data.product_id,
        action=review_data.action,
        comment=review_data.comment,
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Product not found.",
        )

    return review


@router.post("/{product_id}/approve")
def approve_product(
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

    review = create_review(
        db=db,
        product_id=product_id,
        action="approve",
        comment="Approved by human reviewer.",
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Product not found.",
        )

    return {
        "success": True,
        "message": "Product approved successfully.",
        "product_id": str(product.id),
    }


@router.post("/{product_id}/reject")
def reject_product(
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

    review = create_review(
        db=db,
        product_id=product_id,
        action="reject",
        comment="Rejected by human reviewer.",
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Product not found.",
        )

    return {
        "success": True,
        "message": "Product rejected successfully.",
        "product_id": str(product.id),
    }