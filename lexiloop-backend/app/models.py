from pydantic import BaseModel, Field


class SimplifyRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to be simplified")


class SimplifyResponse(BaseModel):
    simplified_text: str


class PDFExtractionResponse(BaseModel):
    text: str
    pages: int
    filename: str


class PDFSimplifyResponse(BaseModel):
    original_text: str
    simplified_text: str
    pages: int
    filename: str


class HealthResponse(BaseModel):
    status: str
    api_key_configured: bool