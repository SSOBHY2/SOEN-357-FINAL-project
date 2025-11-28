import os
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Settings:

    APP_TITLE: str = os.getenv("APP_TITLE", "Lexiloop API")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    RELOAD: bool = os.getenv("RELOAD", "True").lower() == "true"

    CORS_ORIGINS: List[str] = os.getenv("ALLOWED_ORIGINS", "*").split(",")
    CORS_CREDENTIALS: bool = os.getenv("CORS_CREDENTIALS", "True").lower() == "true"
    CORS_METHODS: List[str] = os.getenv("CORS_METHODS", "*").split(",")
    CORS_HEADERS: List[str] = os.getenv("CORS_HEADERS", "*").split(",")

    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    DEEPSEEK_API_URL: str = os.getenv(
        "DEEPSEEK_API_URL", 
        "https://api.deepseek.com/chat/completions"
    )
    DEEPSEEK_MODEL: str = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
    DEEPSEEK_TIMEOUT: float = float(os.getenv("DEEPSEEK_TIMEOUT", "120.0"))
    
    def validate(self) -> None:
        errors = []
        
        if not self.DEEPSEEK_API_KEY:
            errors.append("DEEPSEEK_API_KEY is not defined in environment variables")
        
        if self.PORT < 1 or self.PORT > 65535:
            errors.append(f"PORT must be between 1 and 65535, got {self.PORT}")
        
        if self.DEEPSEEK_TIMEOUT <= 0:
            errors.append(f"DEEPSEEK_TIMEOUT must be positive, got {self.DEEPSEEK_TIMEOUT}")
        
        if errors:
            raise ValueError("\n".join(errors))
    
    def display_config(self) -> None:
        print("=== Configuration ===")
        print(f"App: {self.APP_TITLE} v{self.APP_VERSION}")
        print(f"Server: {self.HOST}:{self.PORT} (reload={self.RELOAD})")
        print(f"CORS Origins: {self.CORS_ORIGINS}")
        print(f"DeepSeek Model: {self.DEEPSEEK_MODEL}")
        print(f"DeepSeek API Key: {'*' * 20 if self.DEEPSEEK_API_KEY else 'NOT SET'}")
        print("=" * 30)

settings = Settings()
settings.validate()

if __name__ == "__main__":
    settings.display_config()