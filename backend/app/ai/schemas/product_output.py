from typing import Any

from pydantic import BaseModel, Field


class EnrichedProductOutput(BaseModel):
    title: str = Field(
        description="Clean professional product title."
    )

    description: str = Field(
        description="Professional product description."
    )

    category: str = Field(
        description="Normalized product category."
    )

    attributes: dict[str, Any] = Field(
        default_factory=dict
    )

    reasoning: str = Field(
        default="",
        description=(
            "Short explanation of how the enrichment "
            "was determined."
        ),
    )