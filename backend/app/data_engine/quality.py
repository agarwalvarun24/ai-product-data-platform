def calculate_quality_score(product: dict) -> float:
    fields = [
        product.get("sku"),
        product.get("manufacturer"),
        product.get("raw_title"),
        product.get("raw_description"),
        product.get("category"),
    ]

    filled = sum(
        1
        for value in fields
        if value not in (None, "")
    )

    score = (filled / len(fields)) * 100

    if product.get("attributes"):
        score += 10

    return round(min(score, 100), 2)