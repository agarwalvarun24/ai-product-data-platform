from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.product import Product
from app.schemas.product import (
    ProductListResponse,
    ProductResponse,
)


router = APIRouter(
    prefix="/api/products",
    tags=["Products"],
)


@router.get(
    "",
    response_model=ProductListResponse,
)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    if search:
        pattern = f"%{search}%"

        query = query.filter(
            or_(
                Product.sku.ilike(pattern),
                Product.manufacturer.ilike(pattern),
                Product.raw_title.ilike(pattern),
                Product.title.ilike(pattern),
            )
        )

    total = query.with_entities(
        func.count(Product.id)
    ).scalar() or 0

    products = (
        query.order_by(
            Product.created_at.desc()
        )
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return ProductListResponse(
        products=products,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
)
def get_product(
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

    return product