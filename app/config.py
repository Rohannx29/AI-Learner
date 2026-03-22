from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str = "sqlite:///./ai_learner.db"
    OLLAMA_HOST: str = "http://localhost:11434"
    CORS_ORIGINS: str = "http://localhost:3000"
    ALGORITHM: str = "HS256"
    TOKEN_EXPIRE_HOURS: int = 24

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()