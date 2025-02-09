from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_community.llms import Ollama

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific domains for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load vectorstore
embeddings = HuggingFaceEmbeddings()
vectorstore = FAISS.load_local("vectorstore", embeddings, allow_dangerous_deserialization=True)
retriever = vectorstore.as_retriever()

# Define custom prompt template
custom_prompt_template = PromptTemplate(
    input_variables=["context", "question", "chat_history"],
    template=(
        "You are an empathetic AI assistant trained to provide supportive mental health guidance. "
        "Use the provided context and chat history to answer thoughtfully and kindly. "
        "If someone is in distress, encourage professional help while offering comforting words.\n\n"
        "### Previous Conversation:\n{chat_history}\n\n"
        "### Context:\n{context}\n\n"
        "### User Query:\n{question}\n\n"
        "### Empathetic Response:"
    ),
)

# Initialize LLM
llm = Ollama(model="llama3.2:1b")

# Add conversational memory
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Create Retrieval Chain with Memory
qa_chain = ConversationalRetrievalChain.from_llm(
    llm,
    retriever=retriever,
    memory=memory,
    combine_docs_chain_kwargs={"prompt": custom_prompt_template},
)

# Request model
class QueryRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(request: QueryRequest):
    try:
        response_dict = qa_chain.invoke({"question": request.question})
        return {"response": response_dict["answer"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "Chatbot API is running"}
