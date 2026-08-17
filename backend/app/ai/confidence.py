def calculate_confidence(
    source: dict,
    enriched: dict,
    validation_errors: list[str],
) -> float:
    """
    Calculate confidence score for an enriched product.
    Score range: 0-100.
    """

    if validation_errors:
        return 40.0

    score = 60.0

    if source.get("raw_title"):
        score += 10

    if source.get("raw_description"):
        score += 10

    if enriched.get("attributes"):
        score += 10

    if enriched.get("category"):
        score += 10

    return min(score, 100.0)


def confidence_status(score: float) -> str:
    if score >= 90:
        return "high"

    if score >= 70:
        return "medium"

    return "low"