# Requirements for FOREX MCP Server

## Project Goal

Develop an MCP server named `forex_mcp_server` to provide tools related to Foreign Currency Exchange (FOREX). This server utilizes the Alpha Vantage API for real-time exchange rates and local CSV files for currency code lookups.

**Project Location:** `./forex_mcp_server` (Note: Corrected path from original prompt)

## 1. Functional Overview & Implemented Tools

The server provides the following MCP tools, implemented using the `FastMCP` framework:

1.  **`from_currency_to_target_currency`**
    *   **Purpose:** Converts a specified amount from a base currency to a target currency using the latest real-time exchange rate fetched from Alpha Vantage.
    *   **Inputs:** `from_currency` (str), `to_currency` (str), `amount` (float, default: 1.0)
    *   **Output:** Dictionary containing detailed conversion results including base/target codes and names, exchange rate, input amount, converted amount, timestamp, bid/ask prices.
    *   **Status:** Implemented and functional. Uses `httpx` for asynchronous API calls.

2.  **`search_currency_code`**
    *   **Purpose:** Searches local CSV data (`physical_currency_list.csv` or `digital_currency_list.csv`) to find currency information based on a search term matching the currency name or code.
    *   **Inputs:** `search_term` (str), `currency_type` (Literal["physical", "digital"], default: "physical")
    *   **Output:** Dictionary containing a list of matching currency details.
    *   **Status:** *Partially implemented, currently commented out (`#@app.tool()`) in `server.py` and requires review/completion.* Uses pandas for data loading and caching. The search logic needs refinement for correctness and efficiency (e.g., case-insensitive partial matching on both code and name).

## 2. Environment Setup & Dependencies

*   **Environment:** Python virtual environment (e.g., using `python -m venv .venv` or `uv venv`).
*   **Activation:** `source .venv/bin/activate` (Linux/macOS) or `.venv\Scripts\activate` (Windows).
*   **Core Dependencies:**
    *   `mcp[cli]` (or specific MCP SDK components like `mcp[server]`)
    *   `httpx` (for async HTTP requests to Alpha Vantage)
    *   `pandas` (for reading and searching currency CSV files)
    *   `python-dotenv` (for loading API keys from `.env` file)
*   **Installation (using uv):**
    ```bash
    uv pip install "mcp[server]" httpx pandas python-dotenv
    ```
    *(Adjust `mcp[server]` if client features are also needed)*

## 3. Technology Stack & Implementation Details

*   **Programming Language:** Python 3.x
*   **MCP Framework:** `FastMCP` (from the `mcp` Python SDK)
*   **HTTP Client:** `httpx` (asynchronous)
*   **Data Handling:** `pandas` for CSV loading/searching, basic Python dictionaries for caching.
*   **Configuration:** API keys managed via `.env` file (requires `ALPHA_VANTAGE_API_KEY`).
*   **MCP Transports:** Supports `sse` and `stdio` (as configured in `mcp_config.json` if applicable, or via FastMCP defaults).

## 4. Integration

*   Designed to be potentially proxied via MCPO (Model Context Proxy Orchestrator).
*   Requires `ALPHA_VANTAGE_API_KEY` set in a `.env` file in the project root for the conversion tool to function fully (falls back to "demo" key otherwise).

## 5. Solution References

1.  **Alpha Vantage API Docs:** [https://www.alphavantage.co/documentation/](https://www.alphavantage.co/documentation/)
2.  **Foreign Currency Exchange API Details:** `/home/pop/hosting/vide_coding/agentui/references/currencyapis.md`
3.  **MCP Python SDK Examples:** `/home/pop/hosting/vide_coding/agentui/references/python-sdk/examples` (Especially `fastmcp` examples)
4.  **Finance MCP Server Example:** `/home/pop/hosting/vide_coding/agentui/references/stock_analysis_mcp/finance` (Another example using Alpha Vantage)
5.  **MCPO Project Sample:** `/home/pop/hosting/vide_coding/agentui/references/mcpo`

## 6. Future Work & Documentation

*   **Complete `search_currency_code`:** Fix the search logic, uncomment the tool decorator, and ensure JSON-serializable output.
*   **Add Unit/Integration Tests:** Implement tests for the tools.
*   **Enhance Error Handling:** Add more specific error handling where needed.
*   **Generate Solution Diagram:** Create a visual representation of the server architecture and data flow.
*   **Generate Source Code Documentation:** Use tools like Sphinx or MkDocs to generate documentation from docstrings.