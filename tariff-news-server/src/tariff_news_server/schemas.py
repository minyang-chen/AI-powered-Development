from typing import List, Optional
from pydantic import BaseModel, Field

# Input Schema for the tool
class GetTariffReactionNewsInput(BaseModel):
    country: Optional[str] = Field(None, description="The specific country to focus the search on.")
    additional_keywords: Optional[str] = Field(None, description="Extra terms to add to the query.")

# Output Schema for a single search result item
class SearchResultItem(BaseModel):
    title: str = Field(..., description="Article title.")
    url: str = Field(..., description="Article URL.")
    snippet: str = Field(..., description="A short summary or relevant text snippet.")
    source: Optional[str] = Field(None, description="The source publication or website.")
    published_date: Optional[str] = Field(None, description="The publication date (if available).")

# Output Schema for successful results (list of items)
class SearchSuccessOutput(BaseModel):
    results: List[SearchResultItem] = Field(..., description="List of found news articles.")

# Output Schema for errors or no results
class SearchErrorOutput(BaseModel):
    error: str = Field(..., description="Descriptive error message.")