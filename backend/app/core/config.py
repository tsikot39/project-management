from pydantic_settings import BaseSettings
from typing import List
import secrets


class Settings(BaseSettings):
    # Project info
    PROJECT_NAME: str = "Project Management Platform"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "A comprehensive project management platform"

    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]

    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"  # Default fallback, use .env for production
    DATABASE_NAME: str = "project_management"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Email (for future implementation)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = ""

    # File uploads
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx"]

    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
