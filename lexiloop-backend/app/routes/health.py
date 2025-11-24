from fastapi import APIRouter
from app.models import HealthResponse
from app.config import settings

router = APIRouter(tags=["Health"])


@router.get("/", response_model=dict)
async def root():
    return {
        "message": "Lexiloop API",
        "version": settings.APP_VERSION,
        "endpoints": {
            "simplify": "/simplify",
            "pdf_extract": "/pdf/extract",
            "pdf_simplify": "/pdf/simplify"
        }
    }


@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        api_key_configured=bool(settings.DEEPSEEK_API_KEY)
    )