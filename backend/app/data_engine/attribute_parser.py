import re


def extract_attributes(text: str | None) -> dict:
    if not text:
        return {}

    attributes = {}

    size_match = re.search(
        r"\b(\d+(?:/\d+)?(?:\.\d+)?)\s*(?:in|inch|inches)?\b",
        text,
        re.IGNORECASE,
    )

    if size_match:
        attributes["size"] = f"{size_match.group(1)} inch"

    lowered = text.lower()

    if "brass" in lowered or "brs" in lowered:
        attributes["material"] = "Brass"

    elif "stainless steel" in lowered or " ss " in f" {lowered} ":
        attributes["material"] = "Stainless Steel"

    elif "aluminum" in lowered or "alum" in lowered:
        attributes["material"] = "Aluminum"

    pressure_match = re.search(
        r"\b(\d+)\s*(?:psi|#)\b",
        text,
        re.IGNORECASE,
    )

    if pressure_match:
        attributes["pressure_rating"] = (
            f"{pressure_match.group(1)} PSI"
        )

    return attributes