import chromadb
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

# Persistent storage — survives server restarts
client = chromadb.PersistentClient(path="./chroma_db")


def get_collection(user_id: int):
    return client.get_or_create_collection(name=f"user_{user_id}")


def store_chunks(user_id: int, chunks: list, filename: str = ""):
    collection = get_collection(user_id)
    embeddings = model.encode(chunks).tolist()

    # Bug fixed: IDs were 0-based integers, so uploading a second file
    # would silently overwrite the first file's chunks.
    # Fix: prefix with filename hash so IDs are always unique per upload.
    import hashlib, time
    upload_id = hashlib.md5(f"{filename}{time.time()}".encode()).hexdigest()[:8]
    ids = [f"{user_id}_{upload_id}_{i}" for i in range(len(chunks))]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids
    )


def query_chunks(user_id: int, query: str, n_results: int = 3) -> list:
    collection = get_collection(user_id)

    # Guard: querying an empty collection raises an exception
    if collection.count() == 0:
        return []

    query_embedding = model.encode([query]).tolist()
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=min(n_results, collection.count())
    )

    return results["documents"][0] if results["documents"] else []