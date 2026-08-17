from datetime import datetime

from sqlalchemy import DateTime, Float, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True,
    )

    sku: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )

    manufacturer: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )

    raw_title: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    raw_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    title: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    category: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    attributes: Mapped[dict] = mapped_column(
        JSON,
        default=dict,
    )

    quality_score: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    confidence_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    enrichment_status: Mapped[str] = mapped_column(
        String(50),
        default="pending",
    )

    review_status: Mapped[str] = mapped_column(
        String(50),
        default="not_required",
    )

    source: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )