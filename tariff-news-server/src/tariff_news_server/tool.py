import logging
from typing import Union, List, Optional
from urllib.parse import urlparse
from duckduckgo_search import DDGS
from .schemas import (
    GetTariffReactionNewsInput,
    SearchResultItem,
    SearchSuccessOutput,
    SearchErrorOutput,
)

logger = logging.getLogger(__name__)

def get_tariff_reaction_news(
    input_data: GetTariffReactionNewsInput,
) -> Union[SearchSuccessOutput, SearchErrorOutput]:
    """
    Searches for recent news articles about international reactions to US tariffs.
    """
    base_query = "reactions to US tariffs April 2025"
    query_parts = []

    if input_data.country:
        query_parts.append(f"reactions from {input_data.country}")
        query_parts.append("to US tariffs")
    else:
        query_parts.append(base_query)

    if input_data.additional_keywords:
        query_parts.append(input_data.additional_keywords)

    search_query = " ".join(query_parts)
    logger.info(f"Executing search with query: '{search_query}'")

    results: List[SearchResultItem] = []
    try:
        # Use DDGS context manager for search
        # timelimit='w' searches for results from the past week
        # region='wt-wt' is world-wide search
        with DDGS() as ddgs:
            search_results = ddgs.news(
                keywords=search_query,
                region="wt-wt",
                safesearch="off",
                timelimit="w", # Past week
                max_results=10 # Limit results for brevity
            )

            if not search_results:
                 logger.info("No results found from DDGS.")
                 return SearchErrorOutput(error="No results found for the specified query and time frame.")

            for r in search_results:
                # Attempt to extract source from URL
                source = None
                try:
                    parsed_url = urlparse(r.get("url"))
                    if parsed_url.netloc:
                        # Remove www. if present
                        source = parsed_url.netloc.replace("www.", "")
                except Exception:
                    logger.warning(f"Could not parse source from URL: {r.get('url')}", exc_info=True)

                results.append(
                    SearchResultItem(
                        title=r.get("title", "N/A"),
                        url=r.get("url", "#"),
                        snippet=r.get("body", ""),
                        source=source,
                        published_date=r.get("date") # DDGS provides date string
                    )
                )

    except Exception as e:
        logger.error(f"Error during DuckDuckGo search: {e}", exc_info=True)
        return SearchErrorOutput(error=f"Error connecting to search service or processing results: {e}")

    if not results:
         logger.info("Formatted results list is empty.")
         # This case might be redundant if DDGS already returned empty, but good safety check
         return SearchErrorOutput(error="No results found after processing.")

    logger.info(f"Found {len(results)} results.")
    return SearchSuccessOutput(results=results)