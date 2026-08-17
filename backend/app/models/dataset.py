from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True,
    )

    filename: Mapped[str] = mapped_column(
        String(500),
    )

    source_type: Mapped[str] = mapped_column(
        String(50),
    )

    total_rows: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    valid_rows: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )