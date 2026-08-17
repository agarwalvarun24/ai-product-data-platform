import re


def clean_text(value: object) -> str | None:
    if value is None:
        return None

    text = str(value).strip()

    if not text:
        return None

    text = re.sub(r"\s+", " ", text)

    return text


def clean_product_row(row: dict) -> dict:
    cleaned = {}

    for key, value in row.items():
        normalized_key = str(key).strip().lower()

        cleaned[normalized_key] = clean_text(value)

    return cleaned