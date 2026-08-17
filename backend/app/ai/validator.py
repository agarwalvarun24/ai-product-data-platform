from app.ai.schemas.product_output import (
    EnrichedProductOutput,
)


def validate_enrichment(
    result: EnrichedProductOutput,
) -> tuple[bool, list[str]]:
    errors: list[str] = []

    if not result.title or not result.title.strip():
        errors.append(
            "Generated title is empty."
        )

    if not result.category or not result.category.strip():
        errors.append(
            "Generated category is empty."
        )

    if not result.description or not result.description.strip():
        errors.append(
            "Generated description is empty."
        )

    return len(errors) == 0, errors