
# Tariff News MCP Server
The MCP server `tariff-news-server` has been updated to support both stdio and SSE transports, selectable via a command-line argument. The necessary dependencies and code structure are in place. The server should start correctly in either mode, and the `get_tariff_reaction_news` tool is available.

## Installation 

Download code
```
git clone https://github.com/minyang-chen/AI-powered-Development.git
cd tariff-news-server
pip install -r requirements.txt
pip install -e .
```
Run transport stdio 
```
python -m tariff_news_server.server
```
Run  transport  sse
```
python -m tariff_news_server.server --transport sse
```

## mcp_settings.json
```
{
  "mcpServers": {
    "tariff-news-server": {
      "command": "python",
      "args": [
        "-m",
        "tariff_news_server.server"
      ],
      "env": {},
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

# Toolstack
```
VS Code
Roo Code
MCP Python SDK
Google Gemini 2.5 Pro
```

## Solution Diagram

I have generated a Mermaid sequence diagram illustrating the solution architecture for the Tariff News MCP Server. The diagram shows the interaction between the user, the MCP client, the MCP runner, the Python server process, the DuckDuckGo search library, and the external DuckDuckGo service to fulfill a tool request.
```mermaid
sequenceDiagram
    participant User/AI Agent
    participant MCP Client (Roo-Cline)
    participant MCP Runner
    participant Tariff News Server (Python Process)
    participant DuckDuckGo Search Library
    participant DuckDuckGo News Service

    User/AI Agent->>+MCP Client (Roo-Cline): use_mcp_tool(server='tariff-news-server', tool='get_tariff_reaction_news', args={...})
    MCP Client (Roo-Cline)->>+MCP Runner: Forward MCP Request
    Note over MCP Runner, Tariff News Server (Python Process): Communication via Stdio (using `python -m tariff_news_server.server`)
    MCP Runner->>+Tariff News Server (Python Process): CallToolRequest (get_tariff_reaction_news)
    Tariff News Server (Python Process)->>Tariff News Server (Python Process): Validate input, call tool function
    Tariff News Server (Python Process)->>+DuckDuckGo Search Library: ddgs.news(query, timelimit='w', ...)
    DuckDuckGo Search Library->>+DuckDuckGo News Service: HTTP Search Request
    DuckDuckGo News Service-->>-DuckDuckGo Search Library: Search Results
    DuckDuckGo Search Library-->>-Tariff News Server (Python Process): Return results list
    Tariff News Server (Python Process)->>Tariff News Server (Python Process): Process results, format as TextContent
    Tariff News Server (Python Process)-->>-MCP Runner: CallToolResponse (TextContent with JSON results)
    MCP Runner-->>-MCP Client (Roo-Cline): Forward MCP Response
    MCP Client (Roo-Cline)-->>-User/AI Agent: Display Results
```
