import chromadb
from sentence_transformers import SentenceTransformer

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Initialize ChromaDB
client = chromadb.Client()

def get_collection(user_id: int):
    return client.get_or_create_collection(name=f"user_{user_id}")


def store_chunks(user_id: int, chunks: list):

    collection = get_collection(user_id)

    embeddings = model.encode(chunks).tolist()

    ids = [f"{user_id}_{i}" for i in range(len(chunks))]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids
    )


def query_chunks(user_id: int, query: str, n_results=3):

    collection = get_collection(user_id)

    query_embedding = model.encode([query]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=n_results
    )

    return results["documents"][0] if results["documents"] else []