import json
import uuid

import requests
from bs4 import BeautifulSoup

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.ingestion import UploadResponse
from app.services.ingestion_service import process_file
from app.data_engine.attribute_parser import extract_attributes
from app.data_engine.quality import calculate_quality_score
from app.models.dataset import Dataset
from app.models.product import Product


router = APIRouter(
    prefix="/api/ingestion",
    tags=["Ingestion"],
)


@router.post(
    "/upload",
    response_model=UploadResponse,
)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is required.",
        )

    extension = file.filename.lower().split(".")[-1]

    if extension not in {
        "csv",
        "xlsx",
        "xls",
    }:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Use CSV or Excel."
            ),
        )

    content = await file.read()

    try:
        result = process_file(
            db=db,
            filename=file.filename,
            content=content,
        )

        return result

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@router.post("/website")
async def ingest_website(
    payload: dict,
    db: Session = Depends(get_db),
):
    url = payload.get("url")

    if not url:
        raise HTTPException(
            status_code=400,
            detail="Website URL is required.",
        )

    url = url.strip()

    if not url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=400,
            detail="URL must start with http:// or https://",
        )

    try:
        response = requests.get(
            url,
            timeout=15,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 "
                    "(Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 "
                    "(KHTML, like Gecko) "
                    "Chrome/120.0 Safari/537.36"
                )
            },
        )

        response.raise_for_status()

        soup = BeautifulSoup(
            response.text,
            "html.parser",
        )

        # -------------------------------------------------
        # BASIC PAGE INFORMATION
        # -------------------------------------------------

        page_title = ""

        if soup.title:
            page_title = soup.title.get_text(
                " ",
                strip=True,
            )

        h1 = soup.find("h1")

        product_title = (
            h1.get_text(" ", strip=True)
            if h1
            else page_title
        )

        # -------------------------------------------------
        # META DESCRIPTION
        # -------------------------------------------------

        description = ""

        description_tag = soup.find(
            "meta",
            attrs={"name": "description"},
        )

        if description_tag:
            description = (
                description_tag.get(
                    "content",
                    "",
                )
                or ""
            ).strip()

        # OpenGraph description fallback
        if not description:
            og_description = soup.find(
                "meta",
                attrs={"property": "og:description"},
            )

            if og_description:
                description = (
                    og_description.get(
                        "content",
                        "",
                    )
                    or ""
                ).strip()

        # -------------------------------------------------
        # TRY TO FIND PRODUCT STRUCTURED DATA
        # -------------------------------------------------

        manufacturer = None
        category = None
        sku = None

        json_ld_blocks = soup.find_all(
            "script",
            attrs={"type": "application/ld+json"},
        )

        for block in json_ld_blocks:
            try:
                raw_json = block.string

                if not raw_json:
                    continue

                structured = json.loads(raw_json)

                objects = (
                    structured
                    if isinstance(structured, list)
                    else [structured]
                )

                for item in objects:
                    if not isinstance(item, dict):
                        continue

                    item_type = item.get("@type")

                    # Handle Product structured data
                    if (
                        item_type == "Product"
                        or (
                            isinstance(item_type, list)
                            and "Product" in item_type
                        )
                    ):
                        if not product_title:
                            product_title = (
                                item.get("name")
                                or ""
                            )

                        sku = (
                            item.get("sku")
                            or item.get("mpn")
                            or sku
                        )

                        brand = item.get("brand")

                        if isinstance(
                            brand,
                            dict,
                        ):
                            manufacturer = (
                                brand.get("name")
                                or manufacturer
                            )

                        elif isinstance(
                            brand,
                            str,
                        ):
                            manufacturer = brand

                        category = (
                            item.get("category")
                            or category
                        )

                    # Some websites use brand/manufacturer
                    if not manufacturer:
                        manufacturer = (
                            item.get("manufacturer")
                            or manufacturer
                        )

                    if not category:
                        category = (
                            item.get("category")
                            or category
                        )

            except (
                json.JSONDecodeError,
                TypeError,
                AttributeError,
            ):
                continue

        # -------------------------------------------------
        # FALLBACK BRAND/MANUFACTURER
        # -------------------------------------------------

        if not manufacturer:
            brand_meta = soup.find(
                "meta",
                attrs={
                    "property": "product:brand"
                },
            )

            if brand_meta:
                manufacturer = (
                    brand_meta.get(
                        "content",
                        "",
                    )
                    or ""
                ).strip() or None

        # -------------------------------------------------
        # EXTRACT TEXT FOR ATTRIBUTES
        # -------------------------------------------------

        page_text = soup.get_text(
            " ",
            strip=True,
        )

        attribute_text = " ".join(
            value
            for value in [
                product_title,
                description,
                page_text[:5000],
            ]
            if value
        )

        attributes = extract_attributes(
            attribute_text
        )

        # -------------------------------------------------
        # BUILD PRODUCT DATA
        # -------------------------------------------------

        product_data = {
            "sku": sku,
            "manufacturer": manufacturer,
            "raw_title": product_title or None,
            "raw_description": description or None,
            "category": category,
            "attributes": attributes,
        }

        quality_score = calculate_quality_score(
            product_data
        )

        # -------------------------------------------------
        # CREATE DATASET RECORD
        # -------------------------------------------------

        dataset_id = str(uuid.uuid4())

        dataset = Dataset(
            id=dataset_id,
            filename=url,
            source_type="website",
            total_rows=1,
            valid_rows=1,
        )

        db.add(dataset)

        # -------------------------------------------------
        # CREATE PRODUCT
        # -------------------------------------------------

        product_id = str(uuid.uuid4())

        product = Product(
            id=product_id,
            sku=sku,
            manufacturer=manufacturer,
            raw_title=product_title or None,
            raw_description=description or None,
            category=category,
            attributes=attributes,
            quality_score=quality_score,
            confidence_score=None,
            enrichment_status="pending",
            review_status="not_required",
            source="website",
        )

        db.add(product)

        db.commit()

        return {
            "success": True,
            "dataset_id": dataset_id,
            "product_id": product_id,
            "url": url,
            "title": product_title,
            "description": description,
            "manufacturer": manufacturer,
            "category": category,
            "sku": sku,
            "attributes": attributes,
            "quality_score": quality_score,
            "message": (
                "Website product extracted and "
                "added to the product database."
            ),
        }

    except requests.RequestException as exc:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to access website: "
                f"{str(exc)}"
            ),
        ) from exc

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=(
                "Website extraction failed: "
                f"{str(exc)}"
            ),
        ) from exc
