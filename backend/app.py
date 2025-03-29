import os
import pprint
import requests
from typing import Annotated, Literal, Sequence, TypedDict

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="static")

from langchain import hub
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain_chroma import Chroma  # Instead of langchain_community.vectorstores
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.tools.retriever import create_retriever_tool as langchain_create_retriever_tool
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_together import ChatTogether
import hashlib
import pickle

# API Keys and Environment Setup
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
TOGETHER_AI_API_KEY = os.getenv("TOGETHER_AI_API_KEY")

CACHE_FILE = "query_cache.pkl"  # Persistent storage for caching responses

# Load cache from file
def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "rb") as f:
            return pickle.load(f)
    return {}

# Save cache to file
def save_cache(cache):
    with open(CACHE_FILE, "wb") as f:
        pickle.dump(cache, f)

# Generate hash for user input
def hash_query(query):
    return hashlib.md5(query.encode()).hexdigest()

# Initialize cache
CACHE = load_cache()


# Flask App Initialization
app = Flask(__name__)
CORS(app)

# Global Variable for Retriever
RETRIEVER = None
CHROMA_DB_PATH = "./chroma_db"
# Utility Functions
def load_pdf_documents():
    pdf_folder = "./mypdfs"
    pdf_files = [os.path.join(pdf_folder, f) for f in os.listdir(pdf_folder) if f.endswith(".pdf")]
    pdf_docs = [PyPDFLoader(pdf).load()[:1] for pdf in pdf_files]
    return [item for sublist in pdf_docs for item in sublist]

def setup_retriever():
    global RETRIEVER
    persist_directory = "./chroma_db"  
    collection_name = "rag_chroma_fixed" 

    if RETRIEVER is not None:
        return RETRIEVER

    if os.path.exists(persist_directory) and os.listdir(persist_directory):
        try:
            vectorstore = Chroma(
                persist_directory=persist_directory,
                collection_name=collection_name, 
                embedding_function=GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
            )
            stored_ids = vectorstore.get()["ids"]

            if stored_ids:
                print(f"🔍 Found {len(stored_ids)} stored embeddings in {collection_name}. ✅ Using existing DB.")
                RETRIEVER = vectorstore.as_retriever(search_kwargs={"k": 5})
                return RETRIEVER

            print("⚠️ Chroma DB found but empty. Rebuilding DB...")

        except Exception as e:
            print(f"🚨 Error loading Chroma DB: {str(e)}. Rebuilding DB...")

    print("🚨 No existing Chroma DB found or empty. Creating a new one...")
    return rebuild_chroma_db(persist_directory, collection_name)



def rebuild_chroma_db(persist_directory, collection_name):
    """Rebuilds Chroma DB in a fixed folder, avoiding multiple subfolders."""
    print("♻️ Rebuilding Chroma DB...")

    docs_list = load_pdf_documents()
    if not docs_list:
        print("🚨 ERROR: No PDFs found to process. Chroma DB cannot be built.")
        return None

    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=1000, chunk_overlap=50
    )
    doc_splits = text_splitter.split_documents(docs_list)

    embedding = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
    
    vectorstore = Chroma.from_documents(
        documents=doc_splits,
        collection_name=collection_name,
        embedding=embedding,
        persist_directory=persist_directory,  
    )

    stored_ids = vectorstore.get()["ids"]
    print(f"✅ Chroma DB rebuilt with {len(stored_ids)} embeddings.")

    # 🔴 Force Chroma to save everything in the correct folder
    del vectorstore  

    vectorstore = Chroma(
        persist_directory=persist_directory,
        collection_name=collection_name,
        embedding_function=embedding
    )
    print(f"🔍 Confirmed: {len(vectorstore.get()['ids'])} embeddings stored in Chroma DB.")

    return vectorstore.as_retriever(search_kwargs={"k": 5})





# LLM and Tool Setup
def prepare_retriever_tool():
    retriever = setup_retriever()  

    return langchain_create_retriever_tool(
        retriever,
        "retrieve_blog_posts",
        "First always reply to greetings. For experience, discuss internships and projects. For certifications, mention achievements. "
        "You have access to all the info of Divyanshu. Search and return details about Divyanshu Prakash's resume, skills, life, and hobbies. "
        "Include only information from the PDFs and never provide anything outside them. "
        "If the answer isn't available, search thoroughly, and if still unknown, simply say, 'Sorry, I don't know the answer to this question.' "
        "Do not reveal the use of PDFs for answering queries.",
    )

# State Definition
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

# Workflow Definition
def create_workflow():
    retriever_tool = prepare_retriever_tool()
    tools = [retriever_tool]

    def grade_documents(state) -> Literal["generate", "rewrite"]:
        print("---CHECK RELEVANCE---")

        class grade(BaseModel):
            binary_score: str = Field(description="Relevance score 'yes' or 'no'")

        model = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )

        llm_with_tool = model.with_structured_output(grade)

        prompt = PromptTemplate(
            template="""You are a grader assessing relevance of a retrieved document to a user question. \n 
            Here is the retrieved document: \n\n {context} \n\n
            Here is the user question: {question} \n
            If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n
            Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question.""",
            input_variables=["context", "question"],
        )

        chain = prompt | llm_with_tool

        messages = state["messages"]
        last_message = messages[-1]

        question = messages[0].content
        docs = last_message.content

        scored_result = chain.invoke({"question": question, "context": docs})
        score = scored_result.binary_score

        if "yes" in score.lower():
            print("---DECISION: DOCS RELEVANT---")
            return "generate"
        else:
            print("---DECISION: TRYING TO IMPROVE QUERY---")
            return "rewrite"


    def agent(state):
        print("---CALL AGENT---")
        messages = state["messages"]
        model = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )

        model = model.bind_tools(tools)
        response = model.invoke(messages)
        return {"messages": [response]}

    def rewrite(state):
        print("---TRANSFORM QUERY---")
        messages = state["messages"]
        question = messages[0].content

        msg = [
            HumanMessage(
                content=f""" \n 
        Look at the input and try to reason about the underlying semantic intent / meaning. \n 
        Here is the initial question:
        \n ------- \n
        {question} 
        \n ------- \n
        Formulate an improved question: """,
            )
        ]

        model = ChatTogether(
            together_api_key="tgp_v1_onQLidpEUHatHkJsBsQQL9ZvdcEnk-X-qqLY17WAseg",
            model="meta-llama/Llama-3-70b-chat-hf",
        )

        response = model.invoke(msg)
        return {"messages": [response]}

    def generate(state):
        print("---GENERATE---")
        messages = state["messages"]
        question = messages[0].content
        last_message = messages[-1]

        docs = last_message.content

        prompt = hub.pull("rlm/rag-prompt")

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )

        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)

        rag_chain = prompt | llm | StrOutputParser()
        response = rag_chain.invoke({"context": docs, "question": question})
        return {"messages": [response]}

    # Graph Workflow Setup
    workflow = StateGraph(AgentState)
    workflow.add_node("agent", agent)
    retrieve = ToolNode([retriever_tool])
    workflow.add_node("retrieve", retrieve)
    workflow.add_node("rewrite", rewrite)
    workflow.add_node("generate", generate)

    workflow.add_edge(START, "agent")

    workflow.add_conditional_edges(
        "agent",
        tools_condition,
        {
            "tools": "retrieve",
            END: END,
        },
    )

    workflow.add_conditional_edges(
        "retrieve",
        grade_documents,
    )
    workflow.add_edge("generate", END)
    workflow.add_edge("rewrite", "agent")

    return workflow.compile()


def query_llm(user_input):
    query_hash = hash_query(user_input)

    if query_hash in CACHE:
        print("✅ Using Cached Response")
        return CACHE[query_hash] 

    print("🌐 Fetching from API")
    graph = create_workflow()
    inputs = {"messages": [("user", user_input)]}

    final_answer = "nothing"
    for output in graph.stream(inputs):
        for key, value in output.items():
            if key in ["generate", "agent"]:
                if value.get("messages"):
                    last_message = value["messages"][-1]
                    final_answer = last_message.content if isinstance(last_message, AIMessage) else str(last_message)

    if not final_answer.strip():
        final_answer = "Sorry, I can only answer questions related to Divyanshu Prakash and his details."

    CACHE[query_hash] = final_answer 
    save_cache(CACHE)  

    return final_answer

# Flask Routes
@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"reply": "I didn't get any message."})

    bot_reply = query_llm(user_message)
    return jsonify({"reply": bot_reply})

@app.route("/backend/static/<path:filename>")
def serve_static(filename):
    return send_from_directory("static", filename)

if __name__ == "__main__":
    app.run(debug=True)