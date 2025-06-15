
const GOOGLE_API_KEY = "AIzaSyAv1w55nm72qtpFiij2FCBmQ0TxCAJ0iNg";
const SEARCH_ENGINE_ID = "017576662512468239146:omuauf_lfve"; // Generic search engine ID

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
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
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
