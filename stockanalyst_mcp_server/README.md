# Stock Analyst MCP Server

This project provides a Model Context Protocol (MCP) server that offers stock analysis tools and prompts using the AlphaVantage API.

## Features

*   **MCP Server:** Built using the `mcp-sdk`.
*   **AlphaVantage Integration:** Fetches intraday stock data.
*   **Technical Analysis Tools:**
    *   `calculate_moving_averages`: Calculates Simple Moving Averages (SMA) and provides bullish/bearish signals based on crossovers.
    *   `calculate_rsi`: Calculates the Relative Strength Index (RSI) to identify overbought/oversold conditions.
    *   `trade_recommendation`: Provides a consolidated recommendation (Strong Buy, Buy, Hold, Sell, Strong Sell) based on MA and RSI indicators.
*   **Analysis Prompts:**
    *   `analyze_ticker`: Generates a professional analysis for a single stock.
    *   `compare_tickers`: Compares multiple stocks to find the best trading opportunity.
    *   `intraday_strategy_builder`: Helps build a custom intraday trading strategy for a specific stock.

## Dependencies

*   Python >= 3.11
*   mcp[cli] >= 1.6.0
*   httpx >= 0.28.1
*   pandas >= 2.2.3
*   requests >= 2.32.3
*   tabulate >= 0.9.0
*   python-dotenv >= 1.0.0
*   anyio >= 4.5
*   click >= 8.1.0
*   uvloop

*(See `pyproject.toml` for full details and development dependencies)*

## Installation

1.  **Clone the repository or download the source code.**

2.  **Navigate to the `stockanalyst_mcp_server` directory:**
    ```bash
    cd path/to/agentui/stockanalyst_mcp_server
    ```

3.  **Set up a virtual environment (recommended):**
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
    ```

4.  **Install the package and its dependencies:**
    ```bash
    pip install .
    ```

5. Get API Key https://www.alphavantage.co/support/#api-key


## Configuration

This server requires an AlphaVantage API key.

1.  **Create `.env` file:** In the `stockanalyst_mcp_server` directory, create a file named `.env` (you can copy `.env.example`).
2.  **Add API Key:** Open `.env` and add the following line, replacing `"YOUR_API_KEY_HERE"` with your actual key:
    ```
    ALPHAVANTAGE_API_KEY="YOUR_API_KEY_HERE"
    ```
3.  **Save** the `.env` file.

## Usage

To run the MCP server, execute the package as a module from the project root directory (`agentui`):

```bash
python -m stockanalyst_mcp_tool.server
```

This starts the MCP server (using stdio by default). Connect using a compatible MCP client.

## Testing

A test client (`test_client.py`) is included.

1.  Ensure dependencies are installed and the API key is configured in `.env`.
2.  Run the test client from the project root directory (`agentui`):
    ```bash
    python stockanalyst_mcp_server/test_client.py
    ```

The client will start the server, connect, list tools/prompts, and run basic tests on the tools.