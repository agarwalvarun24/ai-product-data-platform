ENRICHMENT_PROMPT = """
Enrich the following industrial product using only the information provided.

PRODUCT INFORMATION

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

Return ONLY valid JSON in exactly this structure:

{{
    "title": "A clear professional product title",
    "description": "A concise professional product description",
    "category": "A normalized product category",
    "attributes": {{
        "key": "value"
    }},
    "reasoning": "Short explanation of how the enrichment was determined."
}}

Rules:
- Do not invent specifications that are not supported by the input.
- Preserve known measurements, sizes, materials, ratings, and other technical information.
- Improve unclear or abbreviated wording.
- Use an empty string when a field cannot be determined.
- Keep attributes as a JSON object.
- Return JSON only.
"""