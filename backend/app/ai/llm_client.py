from google import genai

from app.core.config import settings


class GeminiClient:
    def __init__(self):
        if not settings.ai_api_key:
            raise RuntimeError(
                "AI_API_KEY is not configured."
            )

        self.client = genai.Client(
            api_key=settings.ai_api_key
        )

    def generate_json(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> str:
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_prompt,
            config={
                "system_instruction": system_prompt,
                "response_mime_type": "application/json",
            },
        )

        return response.text