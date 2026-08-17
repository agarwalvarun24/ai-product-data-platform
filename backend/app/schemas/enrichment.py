from typing import Any

from pydantic import BaseModel


class EnrichmentResponse(BaseModel):
    success: bool
    product_id: str
    title: str | None = None
    description: str | None = None
    category: str | None = None
    attributes: dict[str, Any] = {}
    confidence_score: float = 0
    validation_errors: list[str] = []
    message: str