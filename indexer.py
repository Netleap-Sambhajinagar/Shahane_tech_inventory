import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import chromadb
from chromadb.utils import embedding_functions

import logging
import warnings

# Suppress noisy HuggingFace / SentenceTransformer logs
warnings.filterwarnings("ignore")
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
logging.getLogger("transformers").setLevel(logging.ERROR)

CHROMA_DATA_PATH = "./chroma_data"
COLLECTION_NAME = "Portfolio_website"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# Mimic a real browser so sites don't block us
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/123.0.0.0 Safari/537.36"
    )
}


def crawl_website(url: str) -> str:
    """
    Fetches a single URL and returns clean, readable text.
    Uses a proper separator so words are not mashed together.
    """
    print(f"  Crawling: {url}")
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
    except Exception as e:
        print(f"  [WARN] Failed to fetch {url}: {e}")
        return ""

    soup = BeautifulSoup(response.text, "lxml")

    # Remove non-content tags
    for tag in soup(["script", "style", "noscript", "header", "footer", "nav"]):
        tag.decompose()

    # Use a SPACE separator so words stay separated after get_text()
    text = soup.get_text(separator=" ")

    # Collapse whitespace while keeping newline structure
    lines = [line.strip() for line in text.splitlines()]
    cleaned = "\n".join(line for line in lines if line)

    return cleaned


def collect_internal_links(base_url: str, html: str) -> list[str]:
    """Returns a list of internal links found in the page HTML."""
    soup = BeautifulSoup(html, "lxml")
    base_domain = urlparse(base_url).netloc
    links = set()
    for a_tag in soup.find_all("a", href=True):
        href = urljoin(base_url, a_tag["href"])
        parsed = urlparse(href)
        # Only keep same-domain http(s) links, strip fragments
        if parsed.netloc == base_domain and parsed.scheme in ("http", "https"):
            clean = href.split("#")[0].rstrip("/")
            links.add(clean)
    return list(links)


def scrape_site(start_url: str, max_pages: int = 10) -> str:
    """
    Crawls the start URL and follows internal links up to max_pages.
    Returns all scraped text concatenated.
    """
    visited = set()
    to_visit = [start_url.rstrip("/")]
    all_text = []

    while to_visit and len(visited) < max_pages:
        url = to_visit.pop(0)
        if url in visited:
            continue
        visited.add(url)

        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            response.raise_for_status()
        except Exception as e:
            print(f"  [WARN] Skipping {url}: {e}")
            continue

        # Collect internal links before cleaning the HTML
        new_links = collect_internal_links(start_url, response.text)
        for link in new_links:
            if link not in visited and link not in to_visit:
                to_visit.append(link)

        page_text = crawl_website(url)
        if page_text:
            all_text.append(f"--- Page: {url} ---\n{page_text}")

    print(f"  Scraped {len(visited)} page(s) total.")
    return "\n\n".join(all_text)


def split_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Splits text into overlapping word-level chunks.
    Preserves sentence structure by operating on whole words.
    """
    print("Splitting text into chunks...")
    words = text.split()
    if not words:
        return []

    chunks = []
    step = chunk_size - overlap  # step forward per chunk

    for i in range(0, len(words), step):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)

    print(f"  Created {len(chunks)} chunks from {len(words)} words.")
    return chunks


def index_data(url: str):
    """Main entry point: scrape → chunk → store in ChromaDB."""
    client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=sentence_transformer_ef,
    )

    print(f"Starting scrape of: {url}")
    extracted_text = scrape_site(url, max_pages=10)

    if not extracted_text.strip():
        print("[ERROR] No text was extracted. Aborting indexing.")
        return

    chunks = split_text(extracted_text)
    if not chunks:
        print("[ERROR] No chunks produced. Aborting indexing.")
        return

    print(f"Saving {len(chunks)} chunks to vector database at: {CHROMA_DATA_PATH}")
    ids = [f"{url}-chunk-{i}" for i in range(len(chunks))]
    metadatas = [{"source": url, "chunk_index": i} for i in range(len(chunks))]

    collection.upsert(
        documents=chunks,
        metadatas=metadatas,
        ids=ids,
    )
    print("\n✅ Indexing complete! You can now start the API server.")


if __name__ == "__main__":
    target_url = "https://govindraj-kotalwar.vercel.app/"
    index_data(target_url)