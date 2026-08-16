from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ProductIQ"
    app_version: str = "0.1.0"
    environment: str = "development"

    frontend_url: str = "http://localhost:3000"

    # AI provider will be added later.
    # Keep the configuration here so we don't scatter
    # environment variables throughout the application.
    ai_provider: str = "gemini"
    ai_api_key: str = ""

    database_url: str = (
        "postgresql+psycopg://postgres:postgres@localhost:5432/productiq"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()