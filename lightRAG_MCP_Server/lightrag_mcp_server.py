#!/usr/bin/env python
import anyio
import click
import mcp.types as types
from mcp.server.lowlevel import Server
# from mcp.server.sse import SseServerTransport
# from starlette.applications import Starlette
# from starlette.routing import Mount, Route
import uvicorn
import os
import functools
import asyncio
from lightrag import LightRAG, QueryParam
from lightrag.utils import EmbeddingFunc
        
# Import the correct functions based on ollama.py structure
from lightrag.kg.shared_storage import initialize_pipeline_status
from lightrag.utils import setup_logger
from lightrag.llm.ollama import ollama_model_complete, ollama_embed

# TODO: Import similar functions for Gemini, Groq, OpenRouter when implementing support
# from lightrag.llm.gemini import gemini_model_complete, gemini_embed # Example
# from lightrag.llm.groq import groq_model_complete, groq_embed # Example

setup_logger("lightrag ollama MCP server", level="INFO")

# --- Configuration via Environment Variables ---
LIGHTRAG_LLM_PROVIDER = os.getenv("LIGHTRAG_LLM_PROVIDER", "ollama").lower()  # ollama, gemini, groq, openrouter
LIGHTRAG_EMBEDDING_PROVIDER = os.getenv("LIGHTRAG_EMBEDDING_PROVIDER", "ollama").lower()  # ollama, gemini, etc.
LIGHTRAG_API_KEY = os.getenv("LIGHTRAG_API_KEY")  # Required for Gemini, Groq, OpenRouter
LIGHTRAG_MODEL_NAME = os.getenv("LIGHTRAG_MODEL_NAME", "llama3.2")  # e.g., llama3, gemini-1.5-flash, mixtral-8x7b-32768
LIGHTRAG_EMBEDDING_MODEL_NAME = os.getenv("LIGHTRAG_EMBEDDING_MODEL_NAME", "nomic-embed-text")  # e.g., nomic-embed-text, models/embedding-001
LIGHTRAG_OLLAMA_BASE_URL = os.getenv("LIGHTRAG_OLLAMA_BASE_URL", "http://localhost:11434")
LIGHTRAG_WORKING_DIR = os.getenv("LIGHTRAG_WORKING_DIR", "./lightrag_mcp_data")
LIGHTRAG_DATA_PATH = os.getenv("LIGHTRAG_DATA_PATH","/mcp_server/book_small.txt",)  # Path to a text file to load data from

# --- Helper Functions for Model/Embedder Selection ---
# These functions now return the actual function expected by LightRAG
# Configuration like model name, API key, base URL seems to be handled
# internally by LightRAG or passed via kwargs based on environment/constructor args.
def get_llm_model_func():
    if LIGHTRAG_LLM_PROVIDER == "ollama":
        # LightRAG will call this function, passing necessary context/kwargs
        return ollama_model_complete
    # elif LIGHTRAG_LLM_PROVIDER == "gemini":
    #     if not LIGHTRAG_API_KEY: raise ValueError("LIGHTRAG_API_KEY is required for Gemini")
    #     # return gemini_model_complete # Example
    # elif LIGHTRAG_LLM_PROVIDER == "groq":
    #     if not LIGHTRAG_API_KEY: raise ValueError("LIGHTRAG_API_KEY is required for Groq")
    #     # return groq_model_complete # Example
    # TODO: Add OpenRouter support
    else:
        raise ValueError(f"Unsupported LLM provider: {LIGHTRAG_LLM_PROVIDER}")

# --- Wrapper for embedding function to add embedding_dim ---
class FunctionWrapperWithDim:
    def __init__(self, func, dim):
        self._func = func
        self.embedding_dim = dim
        # Copy attributes from the wrapped function if needed
        functools.update_wrapper(self, func)

    async def __call__(self, *args, **kwargs):
        # Ensure the call is awaitable if the original function is async
        # The partial object itself isn't async, but the original ollama_embed is.
        # The wrapper needs to be awaitable if LightRAG awaits it.
        # Let's assume LightRAG handles awaiting the underlying function correctly.
        # If errors occur, we might need to make this explicitly async.
        print(f"Calling wrapped embedding function with args: {args}, kwargs: {kwargs}")
        # Check if self._func is awaitable (like the original ollama_embed)
        if asyncio.iscoroutinefunction(self._func) or asyncio.iscoroutine(self._func):
            return await self._func(*args, **kwargs)
        else:
            # Handle non-async case if necessary, though ollama_embed is async
            return self._func(*args, **kwargs)

def get_embedding_func():
    # This function returns an object with an embedding_dim attribute.
    if LIGHTRAG_EMBEDDING_PROVIDER == "ollama":
        # TODO: Make embedding_dim configurable or detect automatically
        embedding_dim = 768  # Default for nomic-embed-text
        print(
            f"Configuring ollama_embed wrapper with model: {LIGHTRAG_EMBEDDING_MODEL_NAME}, host: {LIGHTRAG_OLLAMA_BASE_URL}, dim: {embedding_dim}"
        )
        # Create the partial function first
        partial_func = functools.partial(
            ollama_embed,
            embed_model=LIGHTRAG_EMBEDDING_MODEL_NAME,
            host=LIGHTRAG_OLLAMA_BASE_URL,  # Host seems to be passed via llm_model_kwargs now
        )
        # Wrap the partial function
        return FunctionWrapperWithDim(partial_func, embedding_dim)
    # elif LIGHTRAG_EMBEDDING_PROVIDER == "gemini":
    #     if not LIGHTRAG_API_KEY: raise ValueError("LIGHTRAG_API_KEY is required for Gemini")
    #     embedding_dim = ... # Get Gemini embedding dim
    #     partial_func = functools.partial(gemini_embed, embed_model=..., api_key=...)
    #     return FunctionWrapperWithDim(partial_func, embedding_dim)
    # TODO: Add Groq, OpenRouter embedding support if available
    else:
        raise ValueError(
            f"Unsupported Embedding provider: {LIGHTRAG_EMBEDDING_PROVIDER}"
        )

async def initialize_lightrag():
    global lightrag_instance
    if not os.path.exists(LIGHTRAG_WORKING_DIR):
        os.makedirs(LIGHTRAG_WORKING_DIR)

    print(f"Initializing LightRAG with LLM: {LIGHTRAG_LLM_PROVIDER} ({LIGHTRAG_MODEL_NAME}), Embedding: {LIGHTRAG_EMBEDDING_PROVIDER} ({LIGHTRAG_EMBEDDING_MODEL_NAME})")
    #llm_func = get_llm_model_func()
    #embed_func = get_embedding_func()

    # Initialize LightRAG with Ollama model
    lightrag_instance = LightRAG(
        working_dir=LIGHTRAG_WORKING_DIR,
        llm_model_func=ollama_model_complete,
        llm_model_name=LIGHTRAG_MODEL_NAME,
        llm_model_max_async=4,
        llm_model_max_token_size=32768,
        llm_model_kwargs={
            "host": LIGHTRAG_OLLAMA_BASE_URL,
            "options": {"num_ctx": 32768},
        },
        embedding_func=EmbeddingFunc(
            embedding_dim=768,
            max_token_size=8192,
            func=lambda texts: ollama_embed(
                texts, embed_model=LIGHTRAG_EMBEDDING_MODEL_NAME, host=LIGHTRAG_OLLAMA_BASE_URL
            ),
        ),
    )
    
    await lightrag_instance.initialize_storages()
    print("LightRAG storages initialized.")
    await initialize_pipeline_status()
    print("LightRAG pipeline initialized.")

    # Load data if path is provided
    if LIGHTRAG_DATA_PATH and os.path.exists(LIGHTRAG_DATA_PATH):
        print(f"Loading data from: {LIGHTRAG_DATA_PATH}")
        try:
            with open(LIGHTRAG_DATA_PATH, "r", encoding="utf-8") as f:
                content = f.read()
                # Call the asynchronous ainsert method directly
                await lightrag_instance.ainsert(content)
                print(f"Successfully inserted data from {LIGHTRAG_DATA_PATH}")
        except Exception as e:
            print(f"Error loading or inserting data from {LIGHTRAG_DATA_PATH}: {e}")
    elif LIGHTRAG_DATA_PATH:
        print(
            f"Warning: LIGHTRAG_DATA_PATH specified but file not found: {LIGHTRAG_DATA_PATH}"
        )
    else:
        print("No LIGHTRAG_DATA_PATH specified, skipping data loading.")

# --- Global LightRAG Instance ---
# Initialized asynchronously in startup
lightrag_instance: LightRAG | None = None

async def perform_lightrag_search(tool_name: str, query: str) -> str:
    """Calls the LightRAG query method with the specified mode."""
    global lightrag_instance
    if not lightrag_instance:
        await initialize_lightrag()                   
        #raise RuntimeError("LightRAG instance not initialized")

    mode_map = {
        "naive_search": "naive",
        "local_search": "local",
        "global_search": "global",
        "hybrid_search": "hybrid",
    }
    search_mode = mode_map.get(tool_name)
    if not search_mode:
        raise ValueError(f"Unknown search tool mapped: {tool_name}")

    print(f"Performing LightRAG query (mode: {search_mode}) for: {query}")
    # TODO: Check if rag.query needs to be awaited if llm_model_func is async
    # Assuming rag.query handles async internally or the llm_func is sync wrapper
    try:
        # The query method might return complex objects, convert to string for now
        result = await lightrag_instance.query(query, param=QueryParam(mode=search_mode))
        print(f"LightRAG query result type: {type(result)}")
        # Convert result to string representation for MCP text content
        return str(result)
    except Exception as e:
        print(f"Error during LightRAG query: {e}")
        raise  # Re-raise the exception to be caught by the tool handler


@click.command()
@click.option("--port", default=8001, help="Port to listen on for SSE")  
@click.option("--transport",type=click.Choice(["stdio", "sse"]),default="stdio",help="Transport type",)
def main(port: int, transport: str) -> int:
    app = Server("lightrag-mcp-server")

    @app.call_tool()
    async def handle_search_tool(name: str, arguments: dict) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
        print(f"Received call_tool request for: {name} with args: {arguments}")
        valid_tools = ["naive_search", "local_search", "global_search", "hybrid_search"]
        if name not in valid_tools:
            raise ValueError(f"Unknown tool: {name}")
        if "query" not in arguments or not isinstance(arguments["query"], str):
            raise ValueError(
                "Missing or invalid required argument 'query' (must be a string)"
            )

        query = arguments["query"]
        try:
            search_result = await perform_lightrag_search(name, query)
            return [types.TextContent(type="text", text=search_result)]
        except Exception as e:
            error_message = f"Error during {name}: {e}"
            print(f"Error: {error_message}")
            # Return error information as content with isError flag
            return [types.TextContent(type="text", text=error_message)]
            # Note: Consider setting isError=True in the response if the SDK supports it directly
            # in the return type or via raising specific McpError exceptions.
            # For now, returning error text content.

    @app.list_tools()
    async def list_search_tools() -> list[types.Tool]:
        print("Received list_tools request")
        query_input_schema = {
            "type": "object",
            "required": ["query"],
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The text query to search for.",
                }
            },
        }
        return [
            types.Tool(
                name="naive_search",
                description="Perform a naive search using LightRAG.",
                inputSchema=query_input_schema,
            ),
            types.Tool(
                name="local_search",
                description="Perform a local context search using LightRAG.",
                inputSchema=query_input_schema,
            ),
            types.Tool(
                name="global_search",
                description="Perform a global search across the dataset using LightRAG.",
                inputSchema=query_input_schema,
            ),
            types.Tool(
                name="hybrid_search",
                description="Perform a hybrid (local + global) search using LightRAG.",
                inputSchema=query_input_schema,
            ),
        ]

    if transport == "sse":
        from mcp.server.sse import SseServerTransport
        from starlette.applications import Starlette
        from starlette.routing import Mount, Route
                
        sse = SseServerTransport("/messages/")
        
        async def handle_sse(request):
            async with sse.connect_sse(request.scope, request.receive, request._send) as streams:
                await app.run(streams[0], streams[1], app.create_initialization_options())

        starlette_app = Starlette(
            debug=True,
            routes=[
                Route("/sse", endpoint=handle_sse),
                Mount("/messages/", app=sse.handle_post_message),
            ],
        )
        uvicorn.run(starlette_app, host="0.0.0.0", port=port)
    else: 
        from mcp.server.stdio import stdio_server       
                    
        async def arun(): 
            print(f"Initialize LightRAG instance")            
            async with stdio_server() as streams:
                await app.run(streams[0], streams[1], app.create_initialization_options())
        anyio.run(arun)

    return 0


if __name__ == "__main__":
    main()
