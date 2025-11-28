import httpx
from fastapi import HTTPException
from app.config import settings


class DeepseekService:

    def __init__(self):
        self.api_url = settings.DEEPSEEK_API_URL
        self.api_key = settings.DEEPSEEK_API_KEY
        self.model = settings.DEEPSEEK_MODEL
        self.timeout = settings.DEEPSEEK_TIMEOUT
    
    async def simplify_text(self, text: str) -> str:
        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.api_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You simplify complex English text. Keep meaning but make vocabulary and sentence structure easier. Reply ONLY with simplified text."
                            },
                            {
                                "role": "user",
                                "content": f"Simplify the following text: {text}"
                            }
                        ]
                    }
                )
                
                data = response.json()
                
                if not data.get("choices") or len(data["choices"]) == 0:
                    raise HTTPException(
                        status_code=500,
                        detail="No response from Deepseek API"
                    )
                
                simplified_text = data["choices"][0]["message"]["content"].strip()
                return simplified_text
                
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Timeout when calling the API")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


deepseek_service = DeepseekService()