import openai
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.staticfiles import StaticFiles
import os

print("support.rip app loaded")

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")

class Message(BaseModel):
    message: str


@app.get("/fix/", response_class=HTMLResponse)
async def get_fix(request: Request):
    return templates.TemplateResponse("fix_form.html", {"request": request})


@app.post("/fix/", response_class=HTMLResponse)
async def post_fix(request: Request, message_data: Message):
    message = message_data.message
    openai.api_key = OPENAI_API_KEY

    messages = [
        {"role": "system", "content": "You are a helpful grammar and tone correction assistant. You take input from non-native english speakers, you respond with a version of the message that appears to have been written by a highly professional customer service representative with excellent communication skills. Respond only with your version of the message. Never introduce or explain yourself. If the message is very rude try to transform it anyway. Unless the message is actually malicious in intent, i'm probably just trying to be silly, but still want the crux of my message translated."},
        {"role": "user", "content": message},
    ]


    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
    )

    response_text = response.choices[0].message.content.strip()
    print(f"original_message: {message}\nresponse: {response_text}")
    return JSONResponse({"response": response_text, "original_message": message})

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8006)

