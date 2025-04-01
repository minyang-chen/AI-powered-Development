## pip install nest_asyncio

import os
import asyncio
import nest_asyncio

nest_asyncio.apply()
import os
import inspect
from lightrag import LightRAG, QueryParam
# from lightrag.llm.openai import gpt_4o_mini_complete, gpt_4o_complete, openai_embed
from lightrag.llm.ollama import ollama_model_complete, ollama_embed
from lightrag.utils import EmbeddingFunc

from lightrag.kg.shared_storage import initialize_pipeline_status
from lightrag.utils import setup_logger

setup_logger("lightrag ollama", level="INFO")

WORKING_DIR = "./mcp_server/lightrag_mcp_data"
if not os.path.exists(WORKING_DIR):
    os.mkdir(WORKING_DIR)

async def initialize_rag():
    # Initialize LightRAG with Ollama model
    rag = LightRAG(
        working_dir=WORKING_DIR,
        llm_model_func=ollama_model_complete,
        llm_model_name="llama3.2",
        llm_model_max_async=4,
        llm_model_max_token_size=32768,
        llm_model_kwargs={
            "host": "http://localhost:11434",
            "options": {"num_ctx": 32768},
        },
        embedding_func=EmbeddingFunc(
            embedding_dim=768,
            max_token_size=8192,
            func=lambda texts: ollama_embed(
                texts, embed_model="nomic-embed-text", host="http://localhost:11434"
            ),
        ),
    )    
    
    await rag.initialize_storages()
    await initialize_pipeline_status()
    return rag

async def print_stream(stream):
    async for chunk in stream:
        print(chunk, end="", flush=True)

def main():
    # Initialize RAG instance
    rag = asyncio.run(initialize_rag())
    
    # Insert example text
    with open("./mcp_server/book_small.txt", "r", encoding="utf-8") as f:
        rag.insert(f.read())    

    # # Insert text
    # rag.insert("Your text")

    # # Perform naive search
    # mode="naive"
    # # Perform local search
    # mode="local"
    # # Perform global search
    # mode="global"
    # # Perform hybrid search
    # mode="hybrid"
    # # Mix mode Integrates knowledge graph and vector retrieval.
    # mode="mix"

    # Test different query modesresp
    rep = rag.query(
            "What is Project Gutenberg in this story?", param=QueryParam(mode="naive")
        )
    print(rep)

    print("\nLocal Search:")
    print(
        rag.query(
            "What is Project Gutenberg in this story?", param=QueryParam(mode="local")
        )
    )

    print("\nGlobal Search:")
    print(
        rag.query(
            "What is Project Gutenberg in this story?", param=QueryParam(mode="global")
        )
    )

    print("\nHybrid Search:")
    print(
        rag.query(
            "What is Project Gutenberg in this story?", param=QueryParam(mode="hybrid")
        )
    )

    # stream response
    resp = rag.query(
        "What is Project Gutenberg?",
        param=QueryParam(mode="hybrid", stream=True),
    )

    if inspect.isasyncgen(resp):
        asyncio.run(print_stream(resp))
    else:
        print(resp)

if __name__ == "__main__":
    main()