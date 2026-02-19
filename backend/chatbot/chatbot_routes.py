from fastapi import APIRouter
from chatbot.chatbot_engine import chat_response

router = APIRouter()

@router.post("/chat")
def chat(message: str):
    return chat_response(message)
