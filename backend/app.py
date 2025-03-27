import os
import pprint
import requests
from typing import Annotated, Literal, Sequence, TypedDict

from flask import Flask, request, jsonify
from flask_cors import CORS

from langchain import hub
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.tools.retriever import create_retriever_tool as langchain_create_retriever_tool
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_together import ChatTogether

# API Keys and Environment Setup
os.environ["GOOGLE_API_KEY"] = "AIzaSyDNQ3uLiUTQVljD8Cj5vAAB1HLnk2FQnU4"
TOGETHER_AI_API_KEY = "tgp_v1_onQLidpEUHatHkJsBsQQL9ZvdcEnk-X-qqLY17WAseg"

# Flask App Initialization
app = Flask(__name__)
CORS(app)

# Global Variable for Retriever
RETRIEVER = None

# Utility Functions
def load_pdf_documents():
    pdf_folder = "./mypdfs"
    pdf_files = [os.path.join(pdf_folder, f) for f in os.listdir(pdf_folder) if f.endswith(".pdf")]
    pdf_docs = [PyPDFLoader(pdf).load()[:1] for pdf in pdf_files]
    return [item for sublist in pdf_docs for item in sublist]

def setup_retriever():
    global RETRIEVER
    if RETRIEVER is None:
        docs_list = load_pdf_documents()
        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=1000, chunk_overlap=50
        )
        doc_splits = text_splitter.split_documents(docs_list)
        embedding = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
        persist_directory = "./chroma_db"
        vectorstore = Chroma.from_documents(
            documents=doc_splits,
            collection_name="rag-chroma",
            embedding=embedding,
            persist_directory=persist_directory,
        )
        RETRIEVER = vectorstore.as_retriever()
    return RETRIEVER

# LLM and Tool Setup
def prepare_retriever_tool():
    retriever = setup_retriever()
    return langchain_create_retriever_tool(
        retriever,
        "retrieve_blog_posts",
        "if someone asks about experience tell about internships and projects, for certifications you can tell about achivements, you have access to all the info of divyanshu Search and return information about Divyanshu Prakash Resume, His skills, and his life and hobby. Also you can include all the information from the pdfs but don't say anything outside that.",
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

        if score == "yes":
            print("---DECISION: DOCS RELEVANT---")
            return "generate"
        else:
            print("---DECISION: DOCS NOT RELEVANT---")
            print(score)
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
    graph = create_workflow()
    inputs = {
        "messages": [
            ("user", user_input),
        ]
    }
    final_answer = "nothing"
    for output in graph.stream(inputs):
        for key, value in output.items():
            if key == "generate" or key == "agent":
                if value.get("messages"):
                    last_message = value["messages"][-1]
                    final_answer = last_message.content if isinstance(last_message, AIMessage) else str(last_message)

    return final_answer

# Flask Routes
@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"reply": "I didn't get any message."})

    bot_reply = query_llm(user_message)
    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(debug=True)