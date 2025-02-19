"use client";
import React, { FC } from 'react';

interface SearchComponentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchComponent: FC<SearchComponentProps> = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the form from refreshing the page
    if (searchQuery.trim() !== "") {
      // Perform the search action
      console.log("Searching for:", searchQuery);
      // You can add your search logic here (e.g., call an API or filter a list)
    } else {
      alert("Please enter a search query");
    }
  };

  return (
    <form className="max-w-md mx-auto" onSubmit={handleSearchSubmit}>   
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 rounded-3xl pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input 
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          id="default-search" 
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-white focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Search by name or email" 
          required 
        />
        
      </div>
      {/* <button 
          type="submit" 
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button> */}
    </form>
  );
};

export default SearchComponent;
