import os
import httpx
import pandas as pd
import asyncio # Keep asyncio if other async operations might be added later
from dotenv import load_dotenv
from pydantic import ValidationError # Keep ValidationError for error handling
# Remove BaseModel, Field, field_validator as models are removed
from typing import Optional, Dict, Any, List, Literal

from mcp.server.fastmcp import FastMCP # Only import FastMCP from here
# ToolContext import removed as it's not used per examples

# Load environment variables from .env file located in the project root
# Adjust the path if your .env file is elsewhere relative to this script's execution location
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

# --- Configuration ---
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"

PHYSICAL_CURRENCY_LIST_PATH = os.path.join(os.path.dirname(__file__), 'data', 'physical_currency_list.csv')
DIGITAL_CURRENCY_LIST_PATH = os.path.join(os.path.dirname(__file__), 'data', 'digital_currency_list.csv')

# --- Simple Cache for Currency Data ---
_currency_data_cache: Dict[str, Optional[pd.DataFrame]] = {
    "physical": None,
    "digital": None,
}

if not ALPHA_VANTAGE_API_KEY:
    print("Warning: ALPHA_VANTAGE_API_KEY environment variable not set. Using 'demo' key.")
    ALPHA_VANTAGE_API_KEY = "demo" # Fallback to demo key if not set

# --- Helper Function to Load Currency Data ---
def _load_currency_data(currency_type: Literal["physical", "digital"]) -> Optional[pd.DataFrame]:
    """Loads currency data from CSV, caching the result."""
    if _currency_data_cache[currency_type] is not None:
        return _currency_data_cache[currency_type]

    file_path = PHYSICAL_CURRENCY_LIST_PATH if currency_type == "physical" else DIGITAL_CURRENCY_LIST_PATH
    if not os.path.exists(file_path):
        print(f"Warning: Currency list file not found at {file_path}")
        return None

    try:
        df = pd.read_csv(file_path)
        # Standardize column names (assuming 'currency code'/'currency name' or similar)
        df.columns = [col.lower().replace(' ', '_') for col in df.columns]
        if 'currency_code' not in df.columns or 'currency_name' not in df.columns:
             print(f"Warning: Expected columns 'currency_code' and 'currency_name' not found in {file_path}")
             return None # Or handle differently
        _currency_data_cache[currency_type] = df
        print(f"Loaded and cached {currency_type} currency data.")
        return df
    except Exception as e:
        print(f"Error loading currency data from {file_path}: {e}")
        return None


# --- MCP Server Setup ---
app = FastMCP(
    title="FOREX MCP Server",
    dependencies=["requests", "pandas", "tabulate"],    
    description="Provides tools for foreign currency exchange operations using Alpha Vantage.",
    version="0.1.0",
)

# --- Pydantic Models Removed - Arguments passed directly to functions ---
# --- Tool Implementation ---
@app.tool() # Use the tool decorator from the FastMCP instance
async def from_currency_to_target_currency(
    from_currency: str,
    to_currency: str,
    amount: float = 1.0 # Default amount if not provided
) -> Dict[str, Any]:
    """
    Performs a currency value conversion from one currency to another using the
    realtime exchange rate from Alpha Vantage. Multiplies the rate by the provided amount.

    Realtime Currency Exchange Rate	
    1. From_Currency Code	"USD"
    2. From_Currency Name	"United States Dollar"
    3. To_Currency Code	"JPY"
    4. To_Currency Name	"Japanese Yen"
    5. Exchange Rate	"146.93500000"
    6. Last Refreshed	"2025-04-05 18:40:02"
    7. Time Zone	"UTC"
    8. Bid Price	"146.93320000"
    9. Ask Price	"146.93810000"

    """
    if not ALPHA_VANTAGE_API_KEY:
         return {"error": "ALPHA_VANTAGE_API_KEY is not configured."}

    params = {
        "function": "CURRENCY_EXCHANGE_RATE",
        "from_currency": from_currency,
        "to_currency": to_currency,
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

    async with httpx.AsyncClient() as client:
        try:
            # ctx.send_progress removed
            response = await client.get(ALPHA_VANTAGE_BASE_URL, params=params)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            data = response.json()

            # --- Process Alpha Vantage Response ---
            rate_data = data.get("Realtime Currency Exchange Rate")
            if not rate_data:
                error_message = data.get("Error Message", "Unknown error from Alpha Vantage API.")
                note = data.get("Note")
                if note:
                     error_message += f" Note: {note}"
                return {"error": f"Could not retrieve exchange rate: {error_message}"}

            exchange_rate_str = rate_data.get("5. Exchange Rate")
            if not exchange_rate_str:
                return {"error": "Exchange rate not found in API response."}

            try:
                exchange_rate = float(exchange_rate_str)
            except ValueError:
                return {"error": f"Invalid exchange rate format received: {exchange_rate_str}"}

            converted_amount = exchange_rate * amount

            # ctx.send_progress removed
            return {
                "from_currency": rate_data.get("1. From_Currency Code"),
                "from_currency_name": rate_data.get("2. From_Currency Name"),
                "to_currency": rate_data.get("3. To_Currency Code"),
                "to_currency_name": rate_data.get("4. To_Currency Name"),
                "exchange_rate": exchange_rate,
                "last_refreshed": rate_data.get("6. Last Refreshed"),
                "time_zone": rate_data.get("7. Time Zone"),
                "bid_price": rate_data.get("8. Bid Price"),
                "ask_price": rate_data.get("9. Ask Price"),
                "input_amount": amount,
                "converted_amount": converted_amount,
            }

        except httpx.HTTPStatusError as e:
            return {"error": f"HTTP error occurred: {e.response.status_code} - {e.response.text}"}
        except httpx.RequestError as e:
            return {"error": f"An unexpected error occurred: {str(e)}"}

# --- Search Currency Code Tool ---

# SearchCurrencyInput model removed
#@app.tool() # Use the tool decorator from the FastMCP instance
async def search_currency_code(
    search_term: str,
    currency_type: Literal["physical", "digital"] = "physical" # Default directly in signature
) -> Dict[str, Any]:
    """
    Searches for currency codes and names based on a search term within the
    specified currency type (physical or digital).
    """
    # ctx.send_progress removed

    # Validate currency_type just in case (though Literal should handle it)
    if currency_type not in ["physical", "digital"]:
         return {"error": "Invalid currency_type. Must be 'physical' or 'digital'."}

    df = _load_currency_data(currency_type)

    if df is None:
        return {"error": f"Could not load {currency_type} currency data. Check server logs."}

    #search_term_lower = search_term.lower().strip()  # Normalize search term
    # Search in both code and name columns
    name_match_mask = df.loc[df['currency_name'] == search_term]
    print(name_match_mask)

    # Combine the masks using logical OR and filter the DataFrame
    #matches = df[code_match_mask | name_match_mask]
    if name_match_mask is None:
        return {"message": f"No {currency_type} currencies found matching '{search_term}'."}
    else:
        # Convert matching rows to a list of dictionaries for JSON serialization
        return {"matches": name_match_mask}

if __name__ == "__main__":
    import asyncio

    res= asyncio.run(search_currency_code(search_term="Canadian Dollar", currency_type="physical"))

    # res= asyncio.run(from_currency_to_target_currency(from_currency="CAD", to_currency="USD", amount=100))
    print(res)


