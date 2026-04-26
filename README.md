# 🧠 AI-Learner  
### AI-Based Learning Assistant with OCR, RAG & Intelligent Tutoring

AI-Learner is an intelligent learning assistant that combines **OCR, Retrieval-Augmented Generation (RAG), and conversational AI** to provide **personalized, context-aware learning support**.

It allows users to upload study materials, extract content, and interact with an AI tutor that responds based on their own data—not just general knowledge.

---

## 🚀 Features

- 📄 **Document Upload & Processing**
  - Supports PDF, DOCX, TXT, and images

- 🔍 **OCR Integration**
  - Extracts text from images and scanned documents using Tesseract

- 🧠 **RAG-Based AI System**
  - Retrieves relevant information from user-uploaded content
  - Generates accurate, context-aware responses

- 💬 **AI Tutor Chat Interface**
  - Interactive chatbot for real-time doubt solving

- 🗂️ **Vector Database (ChromaDB)**
  - Stores embeddings for efficient retrieval

- 🛣️ **Learning Roadmap Generation**
  - Helps users plan structured learning paths

---

## 🏗️ System Architecture
User Input → Frontend (Next.js)
→ Backend (FastAPI)
→ OCR (Tesseract)
→ Text Processing
→ Embedding Generation
→ Vector DB (ChromaDB)
→ AI Model (Ollama / LLM)
→ Response to User

---

## 🛠️ Tech Stack

**Frontend**
- Next.js
- Tailwind CSS

**Backend**
- FastAPI (Python)

**AI & ML**
- Retrieval-Augmented Generation (RAG)
- LLM (via Ollama)
- NLP techniques

**Data Processing**
- Tesseract OCR
- Document parsing

**Database**
- ChromaDB (Vector Database)

---

## ⚙️ How It Works

1. User uploads study material (PDF/image/text)
2. OCR extracts text (if needed)
3. Text is chunked and converted into embeddings
4. Stored in vector database (ChromaDB)
5. User asks a question
6. Relevant content is retrieved
7. AI generates a context-aware response

---

## 🎯 Problem It Solves

Traditional AI tools:
- ❌ Use generic knowledge  
- ❌ Don’t understand your notes  

AI-Learner:
- ✅ Uses **your own study material**
- ✅ Gives **personalized answers**
- ✅ Acts like a **smart tutor**

---

## 📌 Future Improvements

- Multi-user support  
- Performance analytics dashboard  
- Cloud deployment (scalable architecture)  
- Voice-based interaction  

---

## 🧑‍💻 Author

**Rohan Nimkar**  
- GitHub: https://github.com/Rohannx29  

---

## 🌟 Why This Project Matters

This project demonstrates:
- Real-world use of **AI in education**
- Integration of **multiple systems (OCR + RAG + API)**
- Strong **backend + AI system design**

---

## ⭐ If you like this project, consider giving it a star!
