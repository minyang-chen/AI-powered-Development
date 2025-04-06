
**Project Requirement: Stock Analyst MCP Server**

**Goal:**
Develop a Model Context Protocol (MCP) server in Python that provides stock analysis capabilities using the AlphaVantage API. The server should offer specific tools for technical analysis and prompts to guide language models in performing financial analysis tasks.

**Core Functionalities:**

1.  **MCP Server Implementation:**
    *   Utilize the Python `mcp-sdk`, specifically the `mcp.server.lowlevel.Server`.
    *   The server should identify itself as "stock-analyst".
    *   Support both `stdio` and `sse` transport mechanisms, selectable via command-line arguments (`--transport`, `--port`). Use the `click` library for command-line argument parsing.

2.  **AlphaVantage API Integration:**
    *   Integrate with the AlphaVantage API to fetch `TIME_SERIES_INTRADAY` data.
    *   Manage the AlphaVantage API key securely using a `.env` file and the `python-dotenv` library. The key should be read from the `ALPHAVANTAGE_API_KEY` environment variable. Raise an error if the key is not found.
    *   Use `httpx` for making asynchronous API calls. Include appropriate error handling for API requests (e.g., HTTP errors, API-specific error messages).

3.  **Data Caching:**
    *   Implement a simple in-memory cache (`dict`) to store fetched intraday data (e.g., using `pandas.DataFrame`) keyed by symbol and interval (e.g., "SYMBOL_1min").
    *   Before fetching data from the API, check the cache. Log cache hits and misses.

**Specific MCP Tools:**

1.  **`trade_recommendation` Tool:**
    *   **Input:** Stock symbol (string).
    *   **Functionality:**
        *   Fetch necessary intraday data (using the cached `AlphaVantageAPI` helper).
        *   Calculate Simple Moving Averages (SMA) for short (e.g., 20) and long (e.g., 50) periods.
        *   Calculate the Relative Strength Index (RSI) (e.g., 14 periods).
        *   Combine MA signals (crossovers, relative position) and RSI signals (oversold < 30, overbought > 70) to determine an overall signal strength.
        *   Generate a final recommendation (STRONG BUY, BUY, HOLD, SELL, STRONG SELL) based on the signal strength.
        *   Estimate a simple risk level (Low, Medium, High).
    *   **Output:** A JSON string containing the analysis results (symbol, recommendation, risk level, signal strength, MA signal, RSI signal, current price, detailed analysis text).

**Specific MCP Prompts:**

*(These functions generate prompts for an LLM, guiding it to use the server's tools)*

1.  **`analyze_ticker` Prompt:**
    *   **Input:** Stock symbol (string).
    *   **Output:** An MCP `GetPromptResult` containing a user message that instructs an LLM to perform a comprehensive analysis of the given ticker, covering company background, news, financials, technicals (using the `trade_recommendation` tool), analyst ratings, and an overall investment thesis.

2.  **`compare_tickers` Prompt:**
    *   **Input:** List of stock symbols (list of strings).
    *   **Output:** An MCP `GetPromptResult` containing a user message instructing an LLM to compare the provided tickers by fetching recommendations for each (using `trade_recommendation`), analyzing trends/news, and ranking them based on short-term trading opportunities.

3.  **`intraday_strategy_builder` Prompt:**
    *   **Input:** Stock symbol (string), optional risk tolerance (string, default "Medium"), optional capital (string, default "N/A").
    *   **Output:** An MCP `GetPromptResult` containing a user message instructing an LLM to build a custom intraday trading strategy for the given symbol, considering risk/capital, using the `trade_recommendation` tool for technicals, and outlining entry/exit conditions, position sizing, etc.

**Technical Requirements:**

*   **Language:** Python >= 3.11
*   **Dependencies:** Manage via `pyproject.toml`. Key dependencies include `mcp-sdk[cli]`, `httpx`, `pandas`, `python-dotenv`, `click`, `anyio`.
*   **Logging:** Implement comprehensive logging throughout the server code using Python's standard `logging` module. Log server start/stop, API calls, cache hits/misses, tool executions, prompt generations, errors, and warnings. Configure basic logging format and level (e.g., INFO).
*   **Packaging:** Ensure the project is structured as a Python package (`stockanalyst_mcp_tool`) with a `pyproject.toml` configured for building.
*   **Error Handling:** Implement robust error handling for API calls, missing arguments, and internal calculations. Log errors appropriately.

**Testing & Documentation:**

*   **Test Client:** Provide a `test_client.py` script that connects to the server via `stdio`, lists available tools and prompts, and executes the `trade_recommendation` tool for a sample symbol (e.g., "IBM"). The client should use the `mcp-sdk` client components (`StdioServerParameters`, `stdio_client`, `ClientSession`).
*   **README:** Create a `README.md` file detailing the project's features, dependencies, installation steps, configuration (`.env` file setup), usage instructions (how to run the server and test client), and how to build the package.
