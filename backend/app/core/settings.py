from __future__ import annotations
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str
    UPLOAD_PATH: str = "./app/uploads"
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    SERVER_PORT: int = 8000
    DEBUG_MODE: bool = True

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    model_config = {"env_file": ".env"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
