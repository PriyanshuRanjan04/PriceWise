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

    async def get_chat_response(self, user_query: str, search_results: list = None, history: list = None):
        """
        Generates an AI response based on user query, optional search results,
        and optional conversation history for multi-turn context.
        """
        history = history or []
        prompt = self._build_prompt(user_query, search_results)
        
        if self.gemini_enabled:
            return await self._get_gemini_response(prompt, history)
        elif self.groq_enabled:
            return await self._get_groq_response(prompt, history)
        else:
            return "AI services are not configured. Please add GEMINI_API_KEY or GROQ_API_KEY to your environment."

    SYSTEM_PERSONA = (
        "You are PriceWise AI, a professional shopping assistant. "
        "Your goal is to help users find the best deals, explain why a product is a good choice, "
        "and provide insights into pricing. "
        "If the user is refining, filtering, or asking follow-up questions about previous results — "
        "work with those results. Only perform a fresh product search if it is a completely new query."
    )

    def _build_prompt(self, user_query: str, search_results: list = None):
        context = ""
        if search_results:
            context = f"Here are the current real-time product results:\n{json.dumps(search_results, indent=2)}\n\n"
        
        return f"""
        {context}
        User says: "{user_query}"

        Instructions:
        1. If products are provided, compare them and recommend the best value-for-money option.
        2. Be concise, professional, and helpful.
        3. Use bullet points for comparisons.
        4. If the user is filtering or refining (e.g. by budget, brand, feature) — apply the filter to the products already shown in the conversation.
        5. If no products are relevant, ask for more details to help narrow down the search.
        """

    async def _get_gemini_response(self, prompt: str, history: list = None):
        try:
            # Build Gemini-style contents: history turns + current prompt
            contents = []
            for turn in (history or []):
                role = "user" if turn.get("role") == "user" else "model"
                contents.append({"role": role, "parts": [{"text": turn.get("content", "")}]})
            # Append the current user prompt (which includes product context)
            contents.append({"role": "user", "parts": [{"text": self.SYSTEM_PERSONA + "\n\n" + prompt}]})
            response = self.gemini_model.generate_content(contents)
            return response.text
        except Exception as e:
            print(f"Gemini Error: {e}")
            return "Sorry, I encountered an error while processing your request with Gemini."

    async def _get_groq_response(self, prompt: str, history: list = None):
        try:
            # Build OpenAI-style messages: system persona + history + current prompt
            messages = [{"role": "system", "content": self.SYSTEM_PERSONA}]
            for turn in (history or []):
                role = turn.get("role", "user")  # "user" or "assistant"
                messages.append({"role": role, "content": turn.get("content", "")})
            messages.append({"role": "user", "content": prompt})
            completion = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Groq Error: {e}")
            return "Sorry, I encountered an error while processing your request with Groq."

ai_service = AIService()
