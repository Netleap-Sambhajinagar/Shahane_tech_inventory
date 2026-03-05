#  Shahane Tech RAG — Portfolio Chatbot

A **local RAG (Retrieval-Augmented Generation)** pipeline that:
1. **Scrapes** a portfolio website (with internal link crawling)
2. **Indexes** the content into a ChromaDB vector database
3. **Serves** a chat API (FastAPI) that lets you ask questions about the website

---

##  Quick Start

### 1. Create & activate virtual environment

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Index the website (run once)

```bash
python indexer.py
```

This will crawl `https://govindraj-kotalwar.vercel.app/` (up to 10 pages), chunk the text, and store it in `./chroma_data`.

### 4. Start the API server

```bash
uvicorn api:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/`      | API info    |
| `GET`  | `/health`| Health check |
| `POST` | `/chat`  | Ask a question |

### Example: Chat

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Who is Govindraj and what does he do?\"}"
```

**Response:**
```json
{
  "response": "Govindraj is a ...",
  "sources": [{"source": "https://...", "chunk_index": 0}]
}
```

---

##  Project Structure

```
Shahane tech rag/
├── indexer.py        # Web scraper + ChromaDB indexer
├── api.py            # FastAPI RAG chat server
├── requirements.txt  # Python dependencies
├── chroma_data/      # Vector DB (auto-created by indexer)
└── .venv/            # Virtual environment
```

---

## Configuration

Edit the top of `indexer.py` or `api.py` to change:

| Variable | Default | Description |
|----------|---------|-------------|
| `CHROMA_DATA_PATH` | `./chroma_data` | Vector DB storage path |
| `COLLECTION_NAME` | `Portfolio_website` | ChromaDB collection name |
| `EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | SentenceTransformer model |
| `LLM_MODEL` | `Qwen/Qwen2.5-0.5B-Instruct` | Text generation model |

In `indexer.py`, you can also change `max_pages` in `scrape_site()` to crawl more pages.

---

## Troubleshooting

- **"Collection not found"** → Run `python indexer.py` first before starting the API.
- **"No text extracted"** → The target website may be blocking bots or is JavaScript-only. Check the URL.
- **Slow first run** → The LLM and embedding model are downloaded from HuggingFace on first use (~500MB). Subsequent runs use the local cache.
