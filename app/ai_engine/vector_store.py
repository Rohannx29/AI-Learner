from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from rank_bm25 import BM25Okapi

model = SentenceTransformer("all-MiniLM-L6-v2")

# 🔥 Store per-user data
user_stores = {}


def build_index(user_id, text_chunks):

    tokenized_docs = [doc.split(" ") for doc in text_chunks]
    bm25 = BM25Okapi(tokenized_docs)

    embeddings = model.encode(text_chunks)
    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings))

    user_stores[user_id] = {
        "documents": text_chunks,
        "bm25": bm25,
        "index": index
    }


def hybrid_search(user_id, query, top_k=5):

    if user_id not in user_stores:
        return []

    store = user_stores[user_id]

    documents = store["documents"]
    bm25 = store["bm25"]
    index = store["index"]

    # Vector search
    query_embedding = model.encode([query])
    distances, indices = index.search(np.array(query_embedding), top_k)

    vector_results = [documents[i] for i in indices[0]]

    # Keyword search
    tokenized_query = query.split(" ")
    bm25_scores = bm25.get_scores(tokenized_query)

    bm25_indices = np.argsort(bm25_scores)[::-1][:top_k]
    keyword_results = [documents[i] for i in bm25_indices]

    combined = list(set(vector_results + keyword_results))

    return combined