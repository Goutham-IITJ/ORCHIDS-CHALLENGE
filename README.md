# 🧠 LLM-Powered Website Clone Generator

This project is a **full-stack web application** that clones the layout and design of any public website using a powerful **LLM (Large Language Model)** backend. It takes a website URL as input, scrapes its design and structure, and generates a clean, minimal HTML clone using modern frontend technologies and LLM intelligence.

---

## 🚀 Features

- 🌐 **Input a Website URL**: User submits any public website.
- 🕷️ **Scraper Module**: Fetches structural and visual information from the given site.
- 🤖 **LLM-Powered Generation**: Uses an LLM to interpret the design context and regenerate the layout in clean HTML.
- ⚡ **FastAPI Backend**: Efficient REST API to handle scraping and LLM inference.
- 💡 **Next.js + TypeScript Frontend**: Responsive, sleek, and intuitive user interface.
- 🧪 **Minimal HTML Output**: Designed for readability, reusability, and future enhancements.

---

## 🛠️ Tech Stack

### Frontend:
- `Next.js` + `TypeScript`
- `Tailwind CSS` for styling

### Backend:
- `FastAPI` (Python)
- `BeautifulSoup` / `Playwright` for web scraping
- `OpenAI GPT Model` for layout understanding and HTML generation

---

## 🧰 How It Works

1. **User Input**: The user enters a website URL.
2. **Scraping**: The backend fetches HTML, CSS, and layout structure from the site.
3. **Context Extraction**: Structure and styling cues are summarized into a prompt.
4. **LLM Prompting**: The prompt is sent to the LLM to generate equivalent minimal HTML.
5. **Rendering**: The frontend displays the generated HTML preview.

---

## 📦 Setup Instructions

### 🔧 Prerequisites

- Node.js ≥ 16
- Python ≥ 3.8
- OpenAI API Key (or any LLM API key)
- `pipenv` or `virtualenv` for Python environments

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/llm-site-clone
cd llm-site-clone
llm-site-clone/
│
├── backend/
│   ├── main.py
│   ├── scraper.py
│   ├── llm_handler.py
│   └── utils/
│
├── frontend/
│   ├── pages/
│   ├── components/
│   └── styles/
│
└── README.md


## Backend

The backend uses `uv` for package management.

### Installation

To install the backend dependencies, run the following command in the backend project directory:

```bash
uv sync
```

### Running the Backend

To run the backend development server, use the following command:

```bash
uv run fastapi dev
```

## Frontend

The frontend is built with Next.js and TypeScript.

### Installation

To install the frontend dependencies, navigate to the frontend project directory and run:

```bash
npm install
```

### Running the Frontend

To start the frontend development server, run:

```bash
npm run dev
```
