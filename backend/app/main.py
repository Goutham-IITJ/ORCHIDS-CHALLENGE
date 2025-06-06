from fastapi import FastAPI, Request
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
print("🔑 Loaded API key:", os.getenv("GEMINI_API_KEY"))

# Optional: Set to False to avoid hitting rate limits during testing
USE_GEMINI = True

if USE_GEMINI:
    # Initialize Gemini model
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content("Say hello from Gemini!")
    print(response.text)
else:
    # Mock response for testing (doesn't use your quota)
    print("This is a simulated Gemini response.")

app = FastAPI()
templates = Jinja2Templates(directory="app/templates")

# Optional: serve static assets if needed
app.mount("/static", StaticFiles(directory="app/static"), name="static")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root route
@app.get("/")
def read_root():
    return {"message": "Hello World"}

# ✅ Request model for /clone-site
class CloneRequest(BaseModel):
    url: str

# ✅ /clone-site POST endpoint
@app.post("/clone-site")
def clone_site(data: CloneRequest, request: Request):
    try:
        response = requests.get(data.url, timeout=5)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")

        base_url = data.url.rstrip("/")

        def download_and_replace(tag, attr, folder):
            for element in soup.find_all(tag):
                src = element.get(attr)
                if src and not src.startswith("data:"):
                    src_url = src if src.startswith("http") else requests.compat.urljoin(base_url, src)
                    filename = os.path.basename(src_url.split("?")[0])
                    local_path = os.path.join("app/static", folder, filename)
                    os.makedirs(os.path.dirname(local_path), exist_ok=True)

                    try:
                        file_data = requests.get(src_url, timeout=5).content
                        with open(local_path, "wb") as f:
                            f.write(file_data)
                        element[attr] = f"/static/{folder}/{filename}"
                    except Exception as e:
                        print(f"Fetching: {src_url}")

                        print(f"Failed to download {src_url}: {e}")

        # Download and rewrite assets
        download_and_replace("link", "href", "css")
        download_and_replace("script", "src", "js")
        download_and_replace("img", "src", "images")

        # Save modified HTML
        html = soup.prettify()
        file_path = os.path.join(os.path.dirname(__file__), "templates", "cloned.html")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html)

        return {
            "original_url": data.url,
            "message": f"Site cloned with assets. Visit {request.base_url}cloned to view."
        }


    except Exception as e:
        return {"error": str(e)}

@app.post("/llm-clone")
def llm_clone(request: CloneRequest):
    try:
        # Step 1: Extract the raw HTML from the target site
        response = requests.get(request.url)
        response.raise_for_status()
        html = response.text

        # Step 2: Call Gemini API
        model = genai.GenerativeModel("gemini-pro")
        prompt = f"""You're a helpful assistant skilled in HTML. Clone the following website content into simplified but accurate HTML code.

HTML Input:
{html}

Only return the generated HTML code."""

        chat = model.start_chat()
        gemini_response = chat.send_message(prompt)
        cloned_html = gemini_response.text

        # Step 3: Save and return it
        file_path = os.path.join(os.path.dirname(__file__), "templates", "llm_cloned.html")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(cloned_html)

        return {
            "message": "HTML cloned using Gemini LLM.",
            "preview_url": "/llm-cloned"
        }

    except Exception as e:
        return {"error": str(e)}

# ✅ Route to display the cloned HTML using a template
@app.get("/cloned", response_class=HTMLResponse)
def serve_cloned_direct():
    file_path = os.path.join(os.path.dirname(__file__), "templates", "cloned.html")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            html = f.read()
        return HTMLResponse(content=html, status_code=200)
    except FileNotFoundError:
        return HTMLResponse(content="<h1>Cloned file not found.</h1>", status_code=404)
    

@app.get("/llm-cloned", response_class=HTMLResponse)
def serve_llm_clone():
    file_path = os.path.join(os.path.dirname(__file__), "templates", "llm_cloned.html")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            html = f.read()
        return HTMLResponse(content=html, status_code=200)
    except FileNotFoundError:
        return HTMLResponse(content="<h1>LLM Cloned HTML not found.</h1>", status_code=404)
    