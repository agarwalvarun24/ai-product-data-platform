from datetime import datetime

from pydantic import BaseModel


class ReviewCreate(BaseModel):
    product_id: str
    action: str
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: int
    product_id: str
    action: str
    comment: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True