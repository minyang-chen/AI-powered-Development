# server.py
"""
MCP Server for Stock Analysis using AlphaVantage API.

This server provides tools and prompts for fetching stock data, calculating
technical indicators (MACD, Moving Averages, RSI), and generating trading
recommendations. It uses an in-memory cache for intraday data to minimize
API calls. The AlphaVantage API key is loaded from a .env file.
"""

import json
import logging  # Import logging module
import os
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict

import anyio
import click
import httpx
import mcp.types as types
import pandas as pd

# from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv
from mcp.server.lowlevel import Server
from pydantic import FileUrl

# Load environment variables from .env file
load_dotenv()

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,  # Set default logging level
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__) # Get logger for this module

# # Create the MCP server (Assuming low-level Server is used based on imports)
# # mcp = FastMCP("AlphaVantageTrader") # This seems to be from a previous attempt

# Constants and configurations
API_KEY = os.getenv("ALPHAVANTAGE_API_KEY")
if not API_KEY:
    # Log error before raising
    logger.critical("ALPHAVANTAGE_API_KEY environment variable not set. Please create a .env file with the key.")
    raise ValueError(
        "ALPHAVANTAGE_API_KEY environment variable not set. Please create a .env file with the key."
    )

SAMPLE_RESOURCES = {
    "help": "This server provides implementation of AlphaAdvantage API.",
    "about": "This is the MCP server implementation of AlphaAdvantage API.",
}

@dataclass
class MarketData:
    """
    Dataclass to hold cached market data for a specific symbol and interval.

    Attributes:
        symbol: The stock ticker symbol (e.g., "IBM").
        interval: The data interval (e.g., "1min", "5min").
        data: A pandas DataFrame containing the time series data.
        last_updated: The timestamp when the data was last fetched.
    """

    symbol: str
    interval: str
    data: pd.DataFrame
    last_updated: datetime

class AlphaVantageAPI:
    """
    Helper class to interact with the AlphaVantage API.
    Provides a static method to fetch intraday stock data.
    """

    @staticmethod
    async def get_intraday_data(
        symbol: str, interval: str = "1min", outputsize: str = "compact"
    ) -> pd.DataFrame:
        """
        Fetch intraday time series data from the AlphaVantage API.

        Args:
            symbol: The stock ticker symbol.
            interval: The time interval between data points (e.g., "1min", "5min", "15min", "30min", "60min").
            outputsize: The number of data points ("compact" for 100, "full" for full history).

        Returns:
            A pandas DataFrame containing the intraday data, indexed by datetime.

        Raises:
            ValueError: If the API returns an error or no data is found.
            httpx.HTTPStatusError: If the API request fails.
        """
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={interval}&outputsize={outputsize}&apikey={API_KEY}"

        logger.info(f"Fetching data from AlphaVantage API for {symbol} with interval {interval}...")

        headers = {
            "User-Agent": "MCP Server (github.com/modelcontextprotocol/python-sdk)"
        }
        try:
            async with httpx.AsyncClient(follow_redirects=True, headers=headers) as client:
                response = await client.get(url)
                response.raise_for_status() # Raise exception for bad status codes
                data = response.json()

                # Check for error responses
                if "Error Message" in data:
                    logger.error(f"AlphaVantage API Error for {symbol}: {data['Error Message']}")
                    raise ValueError(f"API Error: {data['Error Message']}")
                if "Note" in data:
                    logger.info(f"API Note for {symbol}: {data['Note']}") # Log API notes

                # Extract time series data
                time_series_key = f"Time Series ({interval})"
                if time_series_key not in data:
                    logger.error(f"No time series data found for {symbol} with interval {interval}. API Response: {data}")
                    raise ValueError(
                        f"No time series data found for {symbol} with interval {interval}"
                    )

                time_series = data[time_series_key]

                # Convert to DataFrame
                df = pd.DataFrame.from_dict(time_series, orient="index")
                df.index = pd.to_datetime(df.index)
                df = df.sort_index()

                # Rename columns and convert to numeric
                df.columns = [col.split(". ")[1] for col in df.columns]
                for col in df.columns:
                    df[col] = pd.to_numeric(df[col])

                logger.info(f"Successfully fetched data for {symbol} ({interval}). Shape: {df.shape}")
                return df
        except httpx.HTTPStatusError as e:
            logger.exception(f"HTTP error fetching data for {symbol}: {e.response.status_code}")
            raise
        except Exception as e:
            logger.exception(f"Unexpected error fetching data for {symbol}")
            raise

# In-memory cache for market data
market_data_cache: Dict[
    str, MarketData
] = {}  # Cache format: {"SYMBOL_INTERVAL": MarketData}

@click.command()
@click.option("--port", default=8008, help="Port to listen on for SSE")
@click.option(
    "--transport",
    type=click.Choice(["stdio", "sse"]),
    default="stdio",
    help="Transport type",
)
def main(port: int, transport: str) -> int:
    logger.info(f"Starting Stock Analyst MCP Server (Transport: {transport}, Port: {port if transport == 'sse' else 'N/A'})")
    app = Server("stock-analyst")

    # --- MCP Resources ---
    @app.list_resources()
    async def list_resources() -> list[types.Resource]:
        logger.debug("Listing resources...")
        return [
            types.Resource(
                uri=FileUrl(f"file:///{name}.txt"),
                name=name,
                description=f"A sample text resource named {name}",
                mimeType="text/plain",
            )
            for name in SAMPLE_RESOURCES.keys()
        ]

    @app.read_resource()
    async def read_resource(uri: FileUrl) -> str | bytes:
        """Provides static configuration data for the application."""
        logger.debug(f"Reading resource: {uri}")
        # "config://app"
        name = uri.path.replace(".txt", "").lstrip("/")
        if name not in SAMPLE_RESOURCES:
            logger.warning(f"Attempted to read unknown resource: {uri}")
            raise ValueError(f"Unknown resource: {uri}")

        return SAMPLE_RESOURCES[name]

    # Technical Analysis Tools
    # --- MCP Tools ---
    @app.list_tools()
    async def list_tools() -> list[types.Tool]:
        logger.debug("Listing tools...")
        return [
            types.Tool(
                name="trade_recommendation",
                description="Provide a comprehensive trade recommendation based on multiple indicators",
                inputSchema={
                    "type": "object",
                    "required": ["symbol"],
                    "properties": {
                        "symbol": {
                            "type": "string",
                            "description": "The ticker symbol to analyze",
                        },
                    },
                },
            ),
        ]

    async def calculate_moving_averages(
        symbol: str, short_period: int = 20, long_period: int = 50
    ) -> Dict[str, Any]:
        """
        Calculate short and long moving averages for a symbol
        """
        logger.debug(f"calculate_moving_averages called for {symbol} ({short_period}/{long_period})")
        # Use a consistent cache key format
        cache_key = f"{symbol}_1min"

        # Check cache first, fetch if necessary
        if cache_key not in market_data_cache:
            logger.info(f"Cache miss for {cache_key}. Fetching new data.")
            # Fetch full data for calculations
            df = await AlphaVantageAPI.get_intraday_data(symbol, "1min", outputsize="full")
            market_data_cache[cache_key] = MarketData(
                symbol=symbol,
                interval="1min",
                data=df,
                last_updated=datetime.now(),  # Store fetch time
            )
        else:
            logger.debug(f"Cache hit for {cache_key}.")

        data = market_data_cache[cache_key].data

        # Calculate moving averages
        data[f"SMA{short_period}"] = data["close"].rolling(window=short_period).mean()
        data[f"SMA{long_period}"] = data["close"].rolling(window=long_period).mean()

        # Get latest values
        latest = data.iloc[-1]
        current_price = latest["close"]
        short_ma = latest[f"SMA{short_period}"]
        long_ma = latest[f"SMA{long_period}"]

        # Determine signal
        if short_ma > long_ma:
            signal = "BULLISH (Short MA above Long MA)"
        elif short_ma < long_ma:
            signal = "BEARISH (Short MA below Long MA)"
        else:
            signal = "NEUTRAL (MAs are equal)"

        # Check for crossover in the last 5 periods
        last_5 = data.iloc[-5:]
        crossover = False
        crossover_type = ""

        for i in range(1, len(last_5)):
            prev = last_5.iloc[i - 1]
            curr = last_5.iloc[i]

            # Golden Cross (short crosses above long)
            if (
                prev[f"SMA{short_period}"] <= prev[f"SMA{long_period}"]
                and curr[f"SMA{short_period}"] > curr[f"SMA{long_period}"]
            ):
                crossover = True
                crossover_type = "GOLDEN CROSS (Bullish)"
                break

            # Death Cross (short crosses below long)
            if (
                prev[f"SMA{short_period}"] >= prev[f"SMA{long_period}"]
                and curr[f"SMA{short_period}"] < curr[f"SMA{long_period}"]
            ):
                crossover = True
                crossover_type = "DEATH CROSS (Bearish)"
                break

        return {
            "symbol": symbol,
            "current_price": current_price,
            f"SMA{short_period}": short_ma,
            f"SMA{long_period}": long_ma,
            "signal": signal,
            "crossover_detected": crossover,
            "crossover_type": crossover_type if crossover else "None",
            "analysis": f"""Moving Average Analysis for {symbol}:
    Current Price: ${current_price:.2f}
    {short_period}-period SMA: ${short_ma:.2f}
    {long_period}-period SMA: ${long_ma:.2f}
    Signal: {signal}
    Recent Crossover: {"Yes - " + crossover_type if crossover else "No"}

    Recommendation: {
                "STRONG BUY"
                if crossover and crossover_type == "GOLDEN CROSS (Bullish)"
                else "BUY"
                if signal == "BULLISH (Short MA above Long MA)"
                else "STRONG SELL"
                if crossover and crossover_type == "DEATH CROSS (Bearish)"
                else "SELL"
                if signal == "BEARISH (Short MA below Long MA)"
                else "HOLD"
            }""",
        }

    async def calculate_rsi(symbol: str, period: int = 14) -> Dict[str, Any]:
        """
        Calculate Relative Strength Index (RSI) for a symbol
        """
        logger.debug(f"calculate_rsi called for {symbol} (period {period})")
        # Use a consistent cache key format
        cache_key = f"{symbol}_1min"

        # Check cache first, fetch if necessary
        if cache_key not in market_data_cache:
            logger.info(f"Cache miss for {cache_key}. Fetching new data.")
            # Fetch full data for calculations
            df = await AlphaVantageAPI.get_intraday_data(symbol, "1min", outputsize="full")
            market_data_cache[cache_key] = MarketData(
                symbol=symbol,
                interval="1min",
                data=df,
                last_updated=datetime.now(),  # Store fetch time
            )
        else:
            logger.debug(f"Cache hit for {cache_key}.")

        data = market_data_cache[cache_key].data.copy()

        # Calculate price changes
        delta = data["close"].diff()

        # Create gain and loss series
        gain = delta.copy()
        loss = delta.copy()
        gain[gain < 0] = 0
        loss[loss > 0] = 0
        loss = abs(loss)

        # Calculate average gain and loss
        avg_gain = gain.rolling(window=period).mean()
        avg_loss = loss.rolling(window=period).mean()

        # Calculate RS and RSI
        # Avoid division by zero if avg_loss is 0
        rs = avg_gain / avg_loss if avg_loss.iloc[-1] != 0 else 0
        rsi = 100 - (100 / (1 + rs))

        # Get latest RSI
        latest_rsi = rsi.iloc[-1]

        # Determine signal
        if latest_rsi < 30:
            signal = "OVERSOLD (Potential buy opportunity)"
        elif latest_rsi > 70:
            signal = "OVERBOUGHT (Potential sell opportunity)"
        else:
            signal = "NEUTRAL"

        return {
            "symbol": symbol,
            "period": period,
            "rsi": latest_rsi,
            "signal": signal,
            "analysis": f"""RSI Analysis for {symbol}:
    {period}-period RSI: {latest_rsi:.2f}
    Signal: {signal}

    Recommendation: {
                "BUY" if latest_rsi < 30 else "SELL" if latest_rsi > 70 else "HOLD"
            }""",
        }

    async def analyze_stock(symbol: str, period: int = 14) -> Dict[str, Any]:
        """
        Combines MA and RSI for a recommendation.
        """
        logger.debug(f"analyze_stock called for {symbol} (period {period})")
        # Calculate individual indicators
        ma_data = await calculate_moving_averages(symbol)
        rsi_data = await calculate_rsi(symbol)

        # Extract signals
        ma_signal = ma_data["signal"]
        ma_crossover = ma_data["crossover_detected"]
        ma_crossover_type = ma_data["crossover_type"]
        rsi_value = rsi_data["rsi"]
        rsi_signal = rsi_data["signal"]

        # Determine overall signal strength
        signal_strength = 0

        # MA contribution
        if "BULLISH" in ma_signal:
            signal_strength += 1
        elif "BEARISH" in ma_signal:
            signal_strength -= 1

        # Crossover contribution
        if ma_crossover:
            if "GOLDEN" in ma_crossover_type:
                signal_strength += 2
            elif "DEATH" in ma_crossover_type:
                signal_strength -= 2

        # RSI contribution
        if "OVERSOLD" in rsi_signal:
            signal_strength += 1.5
        elif "OVERBOUGHT" in rsi_signal:
            signal_strength -= 1.5

        # Determine final recommendation
        if signal_strength >= 2:
            recommendation = "STRONG BUY"
        elif signal_strength > 0:
            recommendation = "BUY"
        elif signal_strength <= -2:
            recommendation = "STRONG SELL"
        elif signal_strength < 0:
            recommendation = "SELL"
        else:
            recommendation = "HOLD"

        # Calculate risk level (simple version)
        risk_level = "MEDIUM"
        if abs(signal_strength) > 3:
            risk_level = "LOW"  # Strong signal, lower risk
        elif abs(signal_strength) < 1:
            risk_level = "HIGH"  # Weak signal, higher risk

        analysis = f"""# Trading Recommendation for {symbol}

    ## Summary
    Recommendation: {recommendation}
    Risk Level: {risk_level}
    Signal Strength: {signal_strength:.1f} / 4.5

    ## Technical Indicators
    Moving Averages: {ma_signal}
    Recent Crossover: {"Yes - " + ma_crossover_type if ma_crossover else "No"}
    RSI ({rsi_data["period"]}): {rsi_value:.2f} - {rsi_signal}

    ## Reasoning
    This recommendation is based on a combination of Moving Average analysis and RSI indicators.
    {
            f"The {ma_crossover_type} provides a strong directional signal. "
            if ma_crossover
            else ""
        }{
            f"The RSI indicates the stock is {rsi_signal.split(' ')[0].lower()}. "
            if "NEUTRAL" not in rsi_signal
            else ""
        }

    ## Action Plan
    {
            "Consider immediate entry with a stop loss at the recent low. Target the next resistance level."
            if recommendation == "STRONG BUY"
            else "Look for a good entry point on small dips. Set reasonable stop loss."
            if recommendation == "BUY"
            else "Consider immediate exit or setting tight stop losses to protect gains."
            if recommendation == "STRONG SELL"
            else "Start reducing position on strength or set trailing stop losses."
            if recommendation == "SELL"
            else "Monitor the position but no immediate action needed."
        }
    """
        result_dict= {
            "symbol": symbol,
            "recommendation": recommendation,
            "risk_level": risk_level,
            "signal_strength": signal_strength,
            "ma_signal": ma_signal,
            "rsi_signal": rsi_signal,
            "current_price": ma_data["current_price"],
            "analysis": analysis,
        }
        return result_dict

    @app.call_tool()
    async def trade_recommendation(name: str, arguments: dict) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
        """
        Provide a comprehensive trade recommendation based on multiple indicators
        """
        # The 'name' parameter is passed by the low-level server; we don't need it here
        # as the decorator handles routing.
        logger.info(f"Executing tool 'trade_recommendation' with args: {arguments}")

        if not arguments or "symbol" not in arguments:
            logger.error(f"Missing required argument 'symbol' in trade_recommendation call. Args: {arguments}")
            # Consider returning an error message via MCP instead of raising ValueError directly
            # For now, raising is simpler.
            raise ValueError("Missing required argument 'symbol'")

        symbol = arguments["symbol"]
        try:
            result_dict = await analyze_stock(symbol) # This function combines MA and RSI
            logger.debug(f"analyze_stock result for {symbol}: {result_dict}")
        except Exception as e:
            logger.exception(f"Error during analyze_stock for {symbol} within trade_recommendation")
            # Re-raise the exception so the MCP framework can report an error
            raise
        # Ensure result_dict is defined before trying to dump it (it is defined within the try block)
        result_text = json.dumps(result_dict) # Convert the result dict to JSON string
        return [types.TextContent(type="text", text=result_text)] # Return as TextContent

    # --- MCP Prompts ---
    # These prompts guide an LLM (like Claude) on how to use the available tools
    # to perform specific financial analysis tasks.
    @app.list_prompts()
    async def list_prompts() -> list[types.Prompt]:
        logger.debug("Listing prompts...")
        return [
            types.Prompt(
                name="analyze_ticker",
                description="Provide a detailed analysis for a single stock ticker.",
                inputSchema={
                    "type": "object",
                    "required": ["symbol"],
                    "properties": {
                        "symbol": {
                            "type": "string",
                            "description": "The ticker symbol to analyze",
                        },
                    },
                },
            ),
            types.Prompt(
                name="compare_tickers",
                description="Compare multiple stock tickers to find the best trading opportunity.",
                 inputSchema={
                    "type": "object",
                    "required": ["symbols"],
                    "properties": {
                        "symbols": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "A list of ticker symbols to compare",
                        },
                    },
                },
            ),
             types.Prompt(
                name="intraday_strategy_builder",
                description="Build a custom intraday trading strategy for a specific ticker.",
                 inputSchema={
                    "type": "object",
                    "required": ["symbol"],
                    "properties": {
                        "symbol": {
                            "type": "string",
                            "description": "The ticker symbol for the strategy",
                        },
                         "risk_tolerance": {
                            "type": "string",
                            "description": "Investor's risk tolerance (e.g., Low, Medium, High)",
                            "default": "Medium",
                        },
                         "capital": {
                            "type": "string", # Or number, depending on expected format
                            "description": "Amount of capital allocated for the trade",
                            "default": "N/A",
                        },
                    },
                },
            ),
        ]

    @app.get_prompt()
    async def analyze_ticker(name: str, arguments: dict[str] | None = None) -> types.GetPromptResult:
        """
        Provide a detailed analysis prompt for a single stock ticker.
        """
        logger.info(f"Generating prompt 'analyze_ticker' for args: {arguments}")
        if not arguments or "symbol" not in arguments:
            logger.error(f"Missing required argument 'symbol' in analyze_ticker prompt request. Args: {arguments}")
            raise ValueError("Missing required argument 'symbol'")

        symbol = arguments["symbol"]
        prompt_content = f"""
Analyze the stock ticker {symbol}. Provide a comprehensive overview covering:
1.  Company background and sector.
2.  Recent news and events impacting the stock.
3.  Key financial metrics (Revenue, EPS, P/E ratio).
4.  Technical analysis summary (support/resistance levels, trend).
5.  Analyst ratings and price targets.
6.  Overall investment thesis (Bullish/Bearish/Neutral) with justification.

Use the available tools if necessary to gather data (e.g., trade_recommendation for technical summary).
Present the analysis in a clear, professional format suitable for an investor report.
"""
        # Ensure correct indentation for return
        return types.GetPromptResult(
            prompt=[types.Message(role="user", content=[types.TextContent(type="text", text=prompt_content)])]
        )

    @app.get_prompt()
    async def compare_tickers(name: str, arguments: dict[str] | None = None) -> types.GetPromptResult:
        """
        Compare multiple stock tickers to find the best trading opportunity prompt.
        """
        logger.info(f"Generating prompt 'compare_tickers' for args: {arguments}")
        if name != "compare_tickers": # Keep existing name check
             raise ValueError(f"Unknown prompt: {name}")
        # Correct argument check for 'symbols' list
        if not arguments or "symbols" not in arguments:
            logger.error(f"Missing required argument 'symbols' (list) in compare_tickers prompt request. Args: {arguments}")
            raise ValueError("Missing required argument 'symbols' (list of strings)")
        symbols = arguments["symbols"] # Use 'symbols'
        # Check if symbols is actually a list
        if not isinstance(symbols, list):
             logger.error(f"'symbols' argument is not a list in compare_tickers prompt request. Args: {arguments}")
             raise ValueError("'symbols' argument must be a list of strings")

        symbol_list = ", ".join(symbols)
        symbol_section = "\n".join([f"- {s}" for s in symbols])

        prompt_content = f"""You are a professional stock market analyst. I would like you to compare these stocks and identify the best trading opportunity:

    {symbol_section}

    For each stock in the list, please:

    1. Check the current market data using the appropriate resource (if available, otherwise rely on tools).
    2. Generate a comprehensive trade recommendation using the trade_recommendation tool.
    3. Compare all stocks based on:
    - Current trend direction and strength
    - Technical indicator signals
    - Risk/reward profile
    - Trading recommendation strength

    After analyzing each stock, rank them from most promising to least promising trading opportunity. Explain your ranking criteria and why you believe the top-ranked stock represents the best current trading opportunity.

    Conclude with a specific recommendation on which stock to trade and what action to take (buy, sell, or hold).
    """
        messages = [types.Message(role="user", content=[types.TextContent(type="text", text=prompt_content)])]

        # Ensure correct indentation for return
        return types.GetPromptResult(
            messages=messages, # Use 'messages' key for low-level server
            description="Compare multiple ticker symbols for the best trading opportunity",
        )

    @app.get_prompt()
    async def intraday_strategy_builder(name: str, arguments: dict[str]| None = None) -> types.GetPromptResult:
        """
        Build a custom intraday trading strategy for a specific ticker
        """
        logger.info(f"Generating prompt 'intraday_strategy_builder' for args: {arguments}")
        if name != "intraday_strategy_builder": # Keep existing name check
            raise ValueError(f"Unknown prompt: {name}")

        if not arguments or "symbol" not in arguments: # Check for 'symbol' based on current code
             logger.error(f"Missing required argument 'symbol' in intraday_strategy_builder prompt request. Args: {arguments}")
             raise ValueError("please specify a stock symbol") # Keep existing error message

        symbol = arguments.get("symbol")
        risk = arguments.get("risk_tolerance", "Medium") # Default risk
        capital = arguments.get("capital", "N/A")

        user_prompt = f"""You are an expert algorithmic trader specializing in intraday strategies. I want you to develop a custom intraday trading strategy for {symbol}.
My risk tolerance is {risk} and my allocated capital is {capital}.

    Please follow these steps:

    1. First, analyze the current market data for {symbol} using the market-data resource (if available, otherwise use tools).
    2. Calculate relevant technical indicators using the trade_recommendation tool.
    3. Based on your analysis, design an intraday trading strategy that includes:
    - Specific entry conditions (technical setups that would trigger a buy/sell)
    - Exit conditions (both take-profit and stop-loss levels)
    - Position sizing recommendations based on capital: {capital} and risk: {risk}
    - Optimal trading times during the day
    - Risk management rules

    Make your strategy specific to the current market conditions for {symbol}, not just generic advice. Include exact indicator values and price levels where possible.

    Conclude with a summary of the strategy and how a trader should implement it for today's trading session.
    """
        messages = [types.Message(role="user", content=[types.TextContent(type="text", text=user_prompt)])]

        # Ensure correct indentation for return
        return types.GetPromptResult(
            messages=messages, # Use 'messages' key for low-level server
            description="Build a custom intraday trading strategy for a specific ticker",
        )

    # --- Transport Handling ---
    if transport == "sse":
        from mcp.server.sse import SseServerTransport
        from starlette.applications import Starlette
        from starlette.routing import Mount, Route

        sse = SseServerTransport("/messages/")

        async def handle_sse(request):
            async with sse.connect_sse(
                request.scope, request.receive, request._send # type: ignore[reportPrivateUsage]
            ) as streams:
                await app.run(
                    streams[0], streams[1], app.create_initialization_options()
                )

        starlette_app = Starlette(
            debug=True, # Consider making this configurable
            routes=[
                Route("/sse", endpoint=handle_sse),
                Mount("/messages/", app=sse.handle_post_message),
            ],
        )
        import uvicorn

        logger.info(f"Starting SSE server on http://0.0.0.0:{port}")
        uvicorn.run(starlette_app, host="0.0.0.0", port=port)
    else: # stdio
        from mcp.server.stdio import stdio_server

        async def arun():
            logger.info("Starting stdio server...")
            async with stdio_server() as streams:
                await app.run(
                    streams[0], streams[1], app.create_initialization_options()
                )
            logger.info("Stdio server finished.")

        anyio.run(arun)
    return 0

# Note: The if __name__ == "__main__": block is handled by the @click.command decorator
# when the script is run directly or via `python -m`.
