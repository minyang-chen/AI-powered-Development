#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Activate virtual environment (assuming it's in the script's directory)
source "$SCRIPT_DIR/.venv/bin/activate"

# Check if .env file exists and load API key for display purposes (optional)
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
  echo "ALPHA_VANTAGE_API_KEY loaded from .env"
else
  echo "Warning: .env file not found. Server might use demo key or fail if key is required."
fi

echo "Starting FOREX MCP Server with Uvicorn for SSE..."
echo "Access SSE endpoint at http://localhost:8000/mcp"
echo "Press CTRL+C to stop the server."

# Run uvicorn
# Note: If you still encounter 'FastMCP object is not callable',
# you might need to try 'src.forex_mcp_server.server:app.app' below,
# depending on the internal structure of FastMCP.
uvicorn src.forex_mcp_server.server:app --host 127.0.0.1 --port 8000 --app-dir "$SCRIPT_DIR"

echo "Server stopped."