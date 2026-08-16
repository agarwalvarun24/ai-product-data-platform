import json

from app.ai.confidence import calculate_confidence
from app.ai.prompts.enrichment import (
    ENRICHMENT_PROMPT,
)
from app.ai.prompts.system import SYSTEM_PROMPT
from app.ai.provider import get_llm_client
from app.ai.schemas.product_output import (
    EnrichedProductOutput,
)
from app.ai.validator import validate_enrichment


def enrich_product(product: dict) -> dict:
    prompt = ENRICHMENT_PROMPT.format(
        sku=product.get("sku") or "",
        manufacturer=(
            product.get("manufacturer") or ""
        ),
        raw_title=(
            product.get("raw_title") or ""
        ),
        raw_description=(
            product.get("raw_description") or ""
        ),
        category=(
            product.get("category") or ""
        ),
        attributes=json.dumps(
            product.get("attributes") or {}
        ),
    )

    client = get_llm_client()

    raw_response = client.generate_json(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=prompt,
    )

    data = json.loads(raw_response)

    result = EnrichedProductOutput.model_validate(
        data
    )

    valid, errors = validate_enrichment(result)

    result_dict = result.model_dump()

    confidence = calculate_confidence(
        source=product,
        enriched=result_dict,
        validation_errors=errors,
    )

    return {
        **result_dict,
        "valid": valid,
        "validation_errors": errors,
        "confidence_score": confidence,
    }