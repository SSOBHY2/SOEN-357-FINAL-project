import PyPDF2
from io import BytesIO
from fastapi import HTTPException, UploadFile

class PDFService:

    @staticmethod
    def validate_pdf_file(file: UploadFile) -> None:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="The file must be a PDF")
    
    @staticmethod
    async def extract_text(file: UploadFile) -> tuple[str, int]:
        PDFService.validate_pdf_file(file)
        
        try:
            contents = await file.read()
            pdf_file = BytesIO(contents)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n\n"
            
            if not text.strip():
                raise HTTPException(
                    status_code=400,
                    detail="No text could be extracted from the PDF"
                )
            
            return text.strip(), len(pdf_reader.pages)
            
        except PyPDF2.errors.PdfReadError:
            raise HTTPException(status_code=400, detail="Corrupted or invalid PDF file")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during extraction: {str(e)}")


pdf_service = PDFService()
class PDFService:
    @staticmethod
    def validate_pdf_file(file: UploadFile) -> None:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="The file must be a PDF")

    @staticmethod
    async def extract_text(file: UploadFile) -> tuple[str, int]:
        PDFService.validate_pdf_file(file)
        
        try:
            contents = await file.read()
            pdf_file = BytesIO(contents)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n\n"
            
            if not text.strip():
                raise HTTPException(
                    status_code=400,
                    detail="No text could be extracted from the PDF"
                )
            
            return text.strip(), len(pdf_reader.pages)
            
        except PyPDF2.errors.PdfReadError:
            raise HTTPException(status_code=400, detail="Corrupted or invalid PDF file")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during extraction: {str(e)}")

pdf_service = PDFService()