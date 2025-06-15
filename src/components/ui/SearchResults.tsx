
import React from "react";
import { SearchResult } from "@/services/searchService";

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  searchTime?: number;
  totalResults?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  searchTime,
  totalResults,
}) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 px-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#110B53]"></div>
          <span className="ml-3 text-lg">Searching...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4">
      {searchTime && totalResults && (
        <div className="text-sm text-gray-600 mb-4">
          About {parseInt(totalResults).toLocaleString()} results ({searchTime.toFixed(2)} seconds)
        </div>
      )}
      
      <div className="space-y-6">
        {results.map((result, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="text-sm text-green-700 mb-1">{result.displayLink}</div>
            <h3 className="text-xl text-blue-600 hover:underline mb-2">
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="visited:text-purple-600"
              >
                {result.title}
              </a>
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
