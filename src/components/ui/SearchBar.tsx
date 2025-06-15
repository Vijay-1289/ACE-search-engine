
import React, { useState } from "react";
import { searchGoogle, SearchResult } from "@/services/searchService";
import { toast } from "sonner";

interface SearchBarProps {
  onSearchResults: (results: SearchResult[], searchInfo: { searchTime: number; totalResults: string }) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults, onLoading, onError }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    onLoading(true);
    onError(null);

    try {
      console.log("Searching for:", searchQuery);
      const response = await searchGoogle(searchQuery);
      
      onSearchResults(response.items, {
        searchTime: response.searchInformation.searchTime,
        totalResults: response.searchInformation.totalResults
      });
      
      if (response.items.length === 0) {
        toast.info("No results found for your search");
      } else {
        toast.success(`Found ${response.items.length} results`);
      }
    } catch (error) {
      console.error("Search failed:", error);
      let errorMessage = "Search failed. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("403") || error.message.includes("API access denied")) {
          errorMessage = "API access denied. The Custom Search API needs to be enabled in Google Cloud Console.";
        } else if (error.message.includes("quota")) {
          errorMessage = "API quota exceeded. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto mt-8">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ask Nova anything..."
          className="w-full px-6 py-4 pr-12 text-lg border-2 border-[#080808] rounded-full focus:outline-none focus:ring-2 focus:ring-[#110B53]"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:text-[#110B53] transition-colors"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
