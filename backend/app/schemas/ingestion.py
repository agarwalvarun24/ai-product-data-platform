from pydantic import BaseModel


class UploadResponse(BaseModel):
    success: bool
    dataset_id: str
    filename: str
    source_type: str
    total_rows: int
    valid_rows: int
    products_created: int
    message: str


class IngestionPreview(BaseModel):
    columns: list[str]
    rows: list[dict]
    total_rows: int