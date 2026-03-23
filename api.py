import contextlib
import os
import chromadb
from chromadb.utils import embedding_functions

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

import logging
import warnings

warnings.filterwarnings("ignore")
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
logging.getLogger("transformers").setLevel(logging.ERROR)

CHROMA_DATA_PATH = os.environ.get("CHROMA_DATA_PATH", "./chroma_data")
COLLECTION_NAME = os.environ.get("COLLECTION_NAME", "Portfolio_website")
EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
QA_MODEL = os.environ.get("QA_MODEL", "deepset/roberta-base-squad2")


state: dict = {}


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models once at startup, release at shutdown."""

    print("Loading Vector Database...")
    chroma_client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )
    try:
        collection = chroma_client.get_collection(
            name=COLLECTION_NAME,
            embedding_function=sentence_transformer_ef,
        )
    except Exception:
        raise RuntimeError(
            f"Collection '{COLLECTION_NAME}' not found. "
            "Please run indexer.py first!"
        )

    print(f"Loading QA model: {QA_MODEL} ...")
    
    qa_pipe = pipeline("question-answering", model=QA_MODEL, device=-1)
    print("✅ All models loaded. API is ready!\n")

    state["collection"] = collection
    state["qa_pipeline"] = qa_pipe

    yield  

    state.clear()


app = FastAPI(title="Website RAG Agent API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class ChatRequest(BaseModel):
    query: str
    context: str = None




@app.get("/")
def root():
    return {
        "api": "Website RAG Agent",
        "model": QA_MODEL,
        "description": "Lightweight extractive QA — runs fully on CPU, no GPU needed.",
        "endpoints": {
            "POST /chat": "Ask a question about the indexed website",
            "GET  /health": "Health check",
        },
    }


@app.get("/health")
def health():
    return {"status": "ok", "collection": COLLECTION_NAME, "qa_model": QA_MODEL}


@app.post("/chat")
def chat_with_website(request: ChatRequest):
    user_query = request.query.strip()
    if not user_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    print(f"\nUser asked: {user_query}")

    if request.context:
        context = request.context.strip()
        sources = [{"source": "current-page"}]
    else:
        collection = state["collection"]
        try:
            results = collection.query(query_texts=[user_query], n_results=5)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Retrieval error: {e}")

        retrieved_chunks = results["documents"][0]

        if not retrieved_chunks:
            return {
                "response": "I'm sorry, I couldn't find any relevant information in the database.",
                "sources": [],
            }

        context = " ".join(retrieved_chunks)
        sources = results["metadatas"][0]

    qa_pipe = state["qa_pipeline"]
    try:
        output = qa_pipe(question=user_query, context=context)
        answer = output["answer"].strip()
        confidence = round(output["score"], 4)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QA error: {e}")

    if not answer or confidence < 0.01:
        answer = "I'm sorry, I couldn't find a confident answer in the indexed content."

    print(f"Answer: {answer}  (confidence: {confidence})\n")

    return {
        "response": answer,
        "confidence": confidence,
        "sources": sources,
    }
