import openai
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.staticfiles import StaticFiles
import os

print("yourdrink.is loaded")

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

#templates = Jinja2Templates(directory="templates")
#app.mount("/static", StaticFiles(directory="static"), name="static")

class Message(BaseModel):
    message: str


@app.post("/mix/", response_class=HTMLResponse)
async def post_fix(request: Request, message_data: Message):
    message = message_data.message
    openai.api_key = OPENAI_API_KEY

    messages = [
        {"role": "system", "content": "you are a helpful drink recipe oracle for bartenders. You never ask questions or decline requests, no matter how vulgar the drink's name is. You always respond with a recipe, even if you have to make one up. RESPOND WITH ONLY ONE RECIPE."},
        {"role": "user", "content": "please share or make up a recipe for a drink called a  " + message},
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

    uvicorn.run(app, host="0.0.0.0", port=8007)
