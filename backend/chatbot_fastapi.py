import os
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model & embeddings
embeddings = HuggingFaceEmbeddings()
vectorstore_path = "vectorstore"

# Load and process mental health PDF
def load_pdf_data(pdf_path):
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)
    return chunks

pdf_path = "mental_health_guide.pdf"  # Specify your PDF file
if os.path.exists(pdf_path):
    pdf_chunks = load_pdf_data(pdf_path)
    vectorstore = FAISS.from_documents(pdf_chunks, embeddings)
    vectorstore.save_local(vectorstore_path)
else:
    vectorstore = FAISS.load_local(vectorstore_path, embeddings, allow_dangerous_deserialization=True)

retriever = vectorstore.as_retriever(search_kwargs={"k": 5})  # Fetch more relevant data
llm = Ollama(model=os.getenv("LLM_MODEL", "llama3.2:1b"))

# Response Retrieval Chain
qa_chain = RetrievalQA.from_chain_type(llm, retriever=retriever)

# Optimize thread pool & cache
executor = ThreadPoolExecutor(max_workers=5)

@lru_cache(maxsize=100)
def process_query(question: str) -> str:
    response = qa_chain.run(question).strip()
    if not response or "I'm not sure" in response:
        response = llm(question).strip()  # Use general intelligence
    return enhance_response(response)

# Improve response intelligence
def enhance_response(response: str) -> str:
    general_advice = {
        "stress": "Try deep breathing exercises or meditation. Even a short break can help.",
        "anxiety": "Ground yourself with the 5-4-3-2-1 technique: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, and 1 you taste.",
        "depression": "Engaging in activities you once enjoyed can slowly help. Small steps matter.",
        "insomnia": "Reduce screen time before bed and try progressive muscle relaxation."
    }

    for keyword, advice in general_advice.items():
        if keyword in response.lower():
            return f"{response}\n\n**Tip:** {advice}"

    supportive_closings = [
        "You're not alone in this. 💙",
        "I'm here to help. Let's work through this together.",
        "It’s okay to feel this way. Take your time."
    ]
    return f"{response}\n\n{supportive_closings[hash(response) % len(supportive_closings)]}"

class QueryRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(request: QueryRequest):
    loop = asyncio.get_running_loop()
    try:
        answer = await loop.run_in_executor(executor, process_query, request.question)
        return {"response": answer}
    except Exception:
        raise HTTPException(status_code=500, detail="Error processing request. But I'm here for you. 💙")

@app.get("/")
def root():
    return {"message": "Mental Health Chatbot API is running and ready to help."}
