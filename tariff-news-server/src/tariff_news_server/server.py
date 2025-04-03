import logging
import json
import anyio
import click # Import click for CLI args
# Remove FastAPI import
from pydantic import ValidationError
from mcp.server.lowlevel import Server as McpServer # Use lowlevel Server
from mcp.server.stdio import stdio_server # Import stdio_server helper
# Import types correctly
import mcp.types as types
# Remove contrib import

from .schemas import GetTariffReactionNewsInput, SearchSuccessOutput, SearchErrorOutput
from .tool import get_tariff_reaction_news

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- MCP Server Setup ---
# Instantiate server with just the name, like the example
mcp_server = McpServer("tariff-news-server")

# --- Tool Definition ---
TOOL_NAME = "get_tariff_reaction_news"

# Derive JSON schema from Pydantic model for MCP ToolDefinition
input_schema = GetTariffReactionNewsInput.model_json_schema()

# Tool definition will be created within list_tools now

# --- MCP Request Handlers ---

@mcp_server.list_tools()
async def list_tools() -> list[types.Tool]:
    logger.info("Received list_tools request")
    # Define the tool directly here using types.Tool
    tool_definition = types.Tool(
        name=TOOL_NAME,
        description="Searches DuckDuckGo for recent news articles (past week) about international reactions to the April 2025 US tariffs. Optionally filters by country and accepts additional keywords.",
        inputSchema=input_schema, # Use the derived schema
    )
    return [tool_definition]

@mcp_server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]: # Correct return type hint
    logger.info(f"Received call_tool request for tool: {name}")
    if name != TOOL_NAME:
        logger.warning(f"Unknown tool requested: {name}")
        # Raise standard ValueError for unknown tool with this API style
        raise ValueError(f"Unknown tool: {name}")

    try:
        # Validate and parse input arguments using the Pydantic schema
        tool_input = GetTariffReactionNewsInput.model_validate(arguments or {})
        logger.info(f"Parsed tool input: {tool_input}")
    except ValidationError as e:
        logger.error(f"Invalid input arguments: {e}")
        # Raise standard ValueError for invalid params
        raise ValueError(f"Invalid input arguments: {e}")

    # Call the actual tool implementation
    result = get_tariff_reaction_news(tool_input)
    logger.info(f"Tool execution result type: {type(result)}")

    # Format the response based on success or error
    if isinstance(result, SearchSuccessOutput):
        logger.info(f"Tool succeeded, returning {len(result.results)} results.")
        # Serialize the Pydantic model to JSON string for the TextContentBlock
        response_text = result.model_dump_json(indent=2)
        return [types.TextContent(type="text", text=response_text)]
    elif isinstance(result, SearchErrorOutput):
        logger.warning(f"Tool returned an error: {result.error}")
        # Serialize the error model to JSON string for the error message
        error_text = result.model_dump_json(indent=2)
        # Raise standard Exception for tool errors, MCP handles formatting it
        raise Exception(error_text)
    else:
        # Should not happen if tool function type hints are correct
        logger.error(f"Unexpected return type from tool function: {type(result)}")
        raise Exception("Unexpected internal server error.")


# --- Main CLI Function ---
@click.command()
@click.option("--port", default=8000, help="Port to listen on for SSE transport.")
@click.option(
    "--transport",
    type=click.Choice(["stdio", "sse"]),
    default="stdio",
    help="MCP transport type (stdio or sse).",
)
def main_cli(port: int, transport: str):
    """Runs the Tariff News MCP Server with the specified transport."""
    logger.info(f"Starting server with transport: {transport}")

    if transport == "sse":
        # Import SSE-specific components only when needed
        try:
            from mcp.server.sse import SseServerTransport
            from starlette.applications import Starlette
            from starlette.routing import Mount, Route
            import uvicorn
        except ImportError:
            logger.error("Please install 'starlette' and 'uvicorn' for SSE transport: pip install starlette \"uvicorn[standard]\"")
            return 1 # Indicate error

        logger.info(f"Configuring SSE transport on port {port}")
        # Define the SSE endpoint path, e.g., /mcp/sse
        sse_path = "/mcp/sse"
        sse_transport = SseServerTransport(sse_path)

        async def handle_sse(request):
            """Handles incoming SSE connection requests."""
            logger.info(f"SSE connection request received from {request.client}")
            async with sse_transport.connect_sse(
                request.scope, request.receive, request._send
            ) as streams:
                logger.info("SSE streams acquired. Running MCP server logic.")
                await mcp_server.run(
                    streams[0], streams[1], mcp_server.create_initialization_options()
                )
            logger.info("SSE connection closed.")

        # Create Starlette app
        starlette_app = Starlette(
            debug=True, # Enable debug for more logs if needed
            routes=[
                Route(sse_path, endpoint=handle_sse),
                # Mount the POST handler for client messages
                Mount(sse_transport.post_message_path, app=sse_transport.handle_post_message),
            ],
        )

        # Run with Uvicorn
        logger.info(f"Running Uvicorn server on 0.0.0.0:{port}")
        uvicorn.run(starlette_app, host="0.0.0.0", port=port)

    else: # Default to stdio
        logger.info("Configuring stdio transport")
        async def run_stdio():
            async with stdio_server() as streams:
                logger.info("MCP stdio streams acquired. Running server...")
                await mcp_server.run(streams[0], streams[1], mcp_server.create_initialization_options())

        try:
            anyio.run(run_stdio)
        except KeyboardInterrupt:
            logger.info("Stdio server stopped by user.")
        except Exception as e:
            logger.error(f"Stdio server exited with error: {e}", exc_info=True)
            return 1 # Indicate error

    return 0 # Indicate success

# --- Entry Point for Script Execution ---
if __name__ == "__main__":
    main_cli()