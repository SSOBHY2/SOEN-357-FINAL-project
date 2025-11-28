from fastapi import APIRouter
from app.models import SimplifyRequest, SimplifyResponse
from app.services.deepseek_service import deepseek_service

router = APIRouter(prefix="", tags=["Simplification"])


@router.post("/simplify", response_model=SimplifyResponse)
async def simplify_text(request: SimplifyRequest):
    simplified_text = await deepseek_service.simplify_text(request.text)
    return SimplifyResponse(simplified_text=simplified_text)