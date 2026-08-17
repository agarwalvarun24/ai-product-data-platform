import re


COLUMN_ALIASES = {
    "part number": "sku",
    "part_number": "sku",
    "part no": "sku",
    "part_no": "sku",
    "product code": "sku",
    "product_code": "sku",
    "manufacturer name": "manufacturer",
    "brand": "manufacturer",
    "product name": "raw_title",
    "name": "raw_title",
    "title": "raw_title",
    "product title": "raw_title",
    "description": "raw_description",
    "product description": "raw_description",
    "category name": "category",
}


ABBREVIATIONS = {
    "cplg": "coupling",
    "coup": "coupling",
    "brs": "brass",
    "ss": "stainless steel",
    "s.s.": "stainless steel",
    "al": "aluminum",
    "alum": "aluminum",
    "hex": "hexagonal",
    "qty": "quantity",
}


def normalize_column_name(name: str) -> str:
    name = str(name).strip().lower()

    name = re.sub(r"[^a-z0-9]+", "_", name)
    name = name.strip("_")

    return COLUMN_ALIASES.get(
        name,
        name,
    )


def normalize_product_row(row: dict) -> dict:
    normalized = {}

    for key, value in row.items():
        normalized_key = normalize_column_name(key)

        if isinstance(value, str):
            normalized_value = value.strip()

            words = normalized_value.split()

            normalized_value = " ".join(
                ABBREVIATIONS.get(
                    word.lower(),
                    word,
                )
                for word in words
            )

            normalized[normalized_key] = normalized_value
        else:
            normalized[normalized_key] = value

    return normalized