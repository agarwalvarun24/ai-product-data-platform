import re


COLUMN_ALIASES = {
    # SKU / part number
    "sku": "sku",
    "part_number": "sku",
    "part_no": "sku",
    "partnumber": "sku",
    "part_num": "sku",
    "item_number": "sku",
    "item_no": "sku",
    "product_code": "sku",
    "productcode": "sku",
    "mfg_part_num": "sku",
    "manufacturer_part_number": "sku",

    # Manufacturer
    "manufacturer": "manufacturer",
    "manufacturer_name": "manufacturer",
    "part_manuf": "manufacturer",
    "part_manufacturer": "manufacturer",
    "mfg": "manufacturer",
    "mfr": "manufacturer",
    "brand": "manufacturer",

    # Product title
    "title": "raw_title",
    "product_title": "raw_title",
    "product_name": "raw_title",
    "name": "raw_title",
    "part_desc": "raw_title",
    "part_description": "raw_title",

    # Description
    "description": "raw_description",
    "product_description": "raw_description",
    "raw_description": "raw_description",

    # Category
    "category": "category",
    "category_name": "category",
    "product_category": "category",
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

    return COLUMN_ALIASES.get(name, name)


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