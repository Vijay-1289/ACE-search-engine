
const GOOGLE_API_KEY = "AIzaSyAv1w55nm72qtpFiij2FCBmQ0TxCAJ0iNg";
const SEARCH_ENGINE_ID = "017576662512468239146:omuauf_lfve";

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

export interface SearchResponse {
  items: SearchResult[];
  searchInformation: {
    totalResults: string;
    searchTime: number;
  };
}

export const searchGoogle = async (query: string): Promise<SearchResponse> => {
  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
  
  console.log("Making search request to:", url);
  
  try {
    const response = await fetch(url);
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      
      if (response.status === 403) {
        throw new Error("API access denied. Please enable the Custom Search API in Google Cloud Console and ensure your API key has the necessary permissions.");
      }
      
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Search response data:", data);
    
    if (data.error) {
      console.error("API error:", data.error);
      throw new Error(data.error.message || "Search API error");
    }
    
    return {
      items: data.items || [],
      searchInformation: data.searchInformation || { totalResults: "0", searchTime: 0 }
    };
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};
