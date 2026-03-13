from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from rank_bm25 import BM25Okapi

model = SentenceTransformer("all-MiniLM-L6-v2")

documents = []
tokenized_docs = []
bm25 = None
index = None


# -----------------------------------
# Build Index
# -----------------------------------

def build_index(text_chunks):

    global documents
    global tokenized_docs
    global bm25
    global index

    documents = text_chunks

    tokenized_docs = [doc.split(" ") for doc in text_chunks]

    bm25 = BM25Okapi(tokenized_docs)

    embeddings = model.encode(text_chunks)

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(np.array(embeddings))


# -----------------------------------
# Hybrid Search
# -----------------------------------

def hybrid_search(query, top_k=5):

    global documents
    global index
    global bm25

    # Vector search
    query_embedding = model.encode([query])

    distances, indices = index.search(
        np.array(query_embedding),
        top_k
    )

    vector_results = [documents[i] for i in indices[0]]

    # Keyword search (BM25)

    tokenized_query = query.split(" ")

    bm25_scores = bm25.get_scores(tokenized_query)

    bm25_indices = np.argsort(bm25_scores)[::-1][:top_k]

    keyword_results = [documents[i] for i in bm25_indices]

    # Combine results

    combined = list(set(vector_results + keyword_results))

    return combined