import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import ImageList from "./ImageList";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [clientFilterColor] = useState("");
  const [clientSortOrder] = useState("relevant");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed

  const handleSearch = async (newPage: number = 1) => {
    if (!query) {
      return;
    }

    try {
      setIsLoading(true); // Set loading to true
      const url = `https://api.unsplash.com/search/photos`;
      const params = {
        query,
        page: newPage,
        per_page: 12,
        color: selectedColor || undefined,
        order_by: sortBy,
      };
      const headers = {
        Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
      };

      const response = await axios.get(url, { params, headers });
      setImages(response.data.results);
      setPage(newPage);
      setError("");
      setHasSearched(true); // Set hasSearched to true after the first search
    } catch (error) {
      const err = error as AxiosError; // Use AxiosError for type assertion if using axios
      if (err.response) {
        if (
          err.response.status === 403 &&
          (err.response.data as any).message === "Rate Limit Exceeded"
        ) {
          setError("Rate limit exceeded. Please try again later.");
        } else {
          setError(
            `Failed to fetch images: ${
              (err.response.data as any).errors
                ? (err.response.data as any).errors.join(", ")
                : "Unknown error"
            }`
          );
        }
      } else if (err.request) {
        setError("No response received from server. Please try again.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleNextPage = () => handleSearch(page + 1);
  const handlePrevPage = () => handleSearch(page - 1);

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  useEffect(() => {
    if (query) {
      handleSearch(1);
    }
  }, [selectedColor, sortBy]); // Trigger search when selectedColor or sortBy changes

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for images..."
        />
        <button onClick={() => handleSearch()}>Search</button>
        <select onChange={handleColorChange} value={selectedColor}>
          <option value="">All Colors (search)</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
        <select onChange={handleSortChange} value={sortBy}>
          <option value="relevant">Relevant (search)</option>
          <option value="latest">Latest (search)</option>
        </select>
      </div>
      {error && <p>{error}</p>}
      <ImageList
        images={images}
        filterColor={clientFilterColor}
        sortOrder={clientSortOrder}
        isLoading={isLoading} // Pass isLoading prop
        hasSearched={hasSearched} // Pass hasSearched prop
      />
      {images.length > 0 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </button>
          <button onClick={handleNextPage}>Next</button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
