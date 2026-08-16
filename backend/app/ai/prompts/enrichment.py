ENRICHMENT_PROMPT = """
Enrich the following industrial product.

SOURCE PRODUCT:

SKU:
{sku}

Manufacturer:
{manufacturer}

Raw title:
{raw_title}

Raw description:
{raw_description}

Existing category:
{category}

Existing attributes:
{attributes}

Return JSON with:

{
  "title": "...",
  "description": "...",
  "category": "...",
  "attributes": {},
  "reasoning": "..."
}

Only use information supported by the source.
"""