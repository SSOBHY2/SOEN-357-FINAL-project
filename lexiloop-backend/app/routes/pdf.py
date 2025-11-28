from fastapi import APIRouter, UploadFile, File
from app.models import PDFExtractionResponse, PDFSimplifyResponse
from app.services.pdf_service import pdf_service
from app.services.deepseek_service import deepseek_service

router = APIRouter(prefix="/pdf", tags=["PDF"])


@router.post("/extract", response_model=PDFExtractionResponse)
async def extract_pdf_text(file: UploadFile = File(...)):
    text, pages = await pdf_service.extract_text(file)
    
    return PDFExtractionResponse(
        text=text,
        pages=pages,
        filename=file.filename
    )


@router.post("/simplify", response_model=PDFSimplifyResponse)
async def extract_and_simplify_pdf(file: UploadFile = File(...)):
    text, pages = await pdf_service.extract_text(file)
    simplified_text = await deepseek_service.simplify_text(text)
    
    return PDFSimplifyResponse(
        original_text=text,
        simplified_text=simplified_text,
        pages=pages,
        filename=file.filename
    )