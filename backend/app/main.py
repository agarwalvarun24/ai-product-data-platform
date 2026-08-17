from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.ingestion import router as ingestion_router
from app.api.products import router as products_router
from app.core.config import settings
from app.database.connection import init_db


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "AI-powered industrial product data enrichment "
        "and quality platform."
    ),
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


app.include_router(health_router)
app.include_router(ingestion_router)
app.include_router(products_router)


@app.get("/")
async def root():
    return {
        "message": "ProductIQ API",
        "status": "running",
        "docs": "/docs",
    }