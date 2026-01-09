import os
import google.generativeai as genai
from groq import Groq
from config import get_settings
import json

settings = get_settings()

class AIService:
    def __init__(self):
        self.gemini_enabled = bool(settings.GEMINI_API_KEY)
        self.groq_enabled = bool(settings.GROQ_API_KEY)
        
        if self.gemini_enabled:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
            
        if self.groq_enabled:
            self.groq_client = Groq(api_key=settings.GROQ_API_KEY)

    async def get_chat_response(self, user_query: str, search_results: list = None):
        """
        Generates an AI response based on user query and optional search results.
        """
        prompt = self._build_prompt(user_query, search_results)
        
        if self.gemini_enabled:
            return await self._get_gemini_response(prompt)
        elif self.groq_enabled:
            return await self._get_groq_response(prompt)
        else:
            return "AI services are not configured. Please add GEMINI_API_KEY or GROQ_API_KEY to your environment."

    def _build_prompt(self, user_query: str, search_results: list = None):
        context = ""
        if search_results:
            context = f"Here are some products I found:\n{json.dumps(search_results, indent=2)}\n\n"
        
        return f"""
        You are PriceWise AI, a professional shopping assistant. 
        Your goal is to help users find the best deals, explain why a product is a good choice, 
        and provide insights into pricing.

        {context}
        User says: "{user_query}"

        Instructions:
        1. If products are provided, compare them and recommend the best value-for-money option.
        2. Be concise, professional, and helpful.
        3. Use bullet points for comparisons.
        4. If no products are relevant, ask for more details to help narrow down the search.
        """

    async def _get_gemini_response(self, prompt: str):
        try:
            response = self.gemini_model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini Error: {e}")
            return "Sorry, I encountered an error while processing your request with Gemini."

    async def _get_groq_response(self, prompt: str):
        try:
            completion = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Groq Error: {e}")
            return "Sorry, I encountered an error while processing your request with Groq."

ai_service = AIService()
