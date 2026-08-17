from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    sku: str | None = None
    manufacturer: str | None = None

    raw_title: str | None = None
    raw_description: str | None = None

    title: str | None = None
    description: str | None = None

    category: str | None = None

    attributes: dict[str, Any] = {}

    quality_score: float = 0
    confidence_score: float | None = None

    enrichment_status: str = "pending"
    review_status: str = "not_required"

    source: str | None = None


class ProductResponse(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class ProductListResponse(BaseModel):
    products: list[ProductResponse]
    total: int
    page: int
    page_size: int