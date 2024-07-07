import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import ImageList from "./ImageList";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [clientFilterColor, setClientFilterColor] = useState("");
  const [clientSortOrder, setClientSortOrder] = useState("relevant");
  const [error, setError] = useState("");

  const handleSearch = async (newPage: number = 1) => {
    try {
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

      console.log("Request URL:", url);
      console.log("Request Params:", params);
      console.log("Request Headers:", headers);

      const response = await axios.get(url, { params, headers });
      setImages(response.data.results);
      setPage(newPage);
      setError("");
    } catch (error) {
      const err = error as AxiosError; // Use AxiosError for type assertion if using axios
      if (err.response) {
        console.error("Error Response Data:", err.response.data);
        console.error("Error Response Status:", err.response.status);
        console.error("Error Response Headers:", err.response.headers);
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
        console.error("Error Request:", err.request);
        setError("No response received from server. Please try again.");
      } else {
        console.error("Error Message:", err.message);
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleNextPage = () => handleSearch(page + 1);
  const handlePrevPage = () => handleSearch(page - 1);

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
        <select
          onChange={(e) => setSelectedColor(e.target.value)}
          value={selectedColor}
        >
          <option value="">All Colors(search)</option>
          <option value="black_and_white">Black and White</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="yellow">Yellow</option>
          <option value="orange">Orange</option>
          <option value="red">Red</option>
          <option value="purple">Purple</option>
          <option value="magenta">Magenta</option>
          <option value="green">Green</option>
          <option value="teal">Teal</option>
          <option value="blue">Blue</option>
        </select>
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="relevant">Relevant(Search)</option>
          <option value="latest">Latest(Search)</option>
        </select>
        <select
          onChange={(e) => setClientFilterColor(e.target.value)}
          value={clientFilterColor}
        >
          <option value="">All Colors (Filter)</option>
          <option value="black_and_white">Black and White (Client)</option>
          <option value="black">Black (Client)</option>
          <option value="white">White (Client)</option>
          <option value="yellow">Yellow (Client)</option>
          <option value="orange">Orange (Client)</option>
          <option value="red">Red (Client)</option>
          <option value="purple">Purple (Client)</option>
          <option value="magenta">Magenta (Client)</option>
          <option value="green">Green (Client)</option>
          <option value="teal">Teal (Client)</option>
          <option value="blue">Blue (Client)</option>
        </select>
        <select
          onChange={(e) => setClientSortOrder(e.target.value)}
          value={clientSortOrder}
        >
          <option value="relevant">Relevant (Filter)</option>
          <option value="latest">Latest (Filter)</option>
        </select>
      </div>
      {error && <p>{error}</p>}
      <ImageList
        images={images}
        filterColor={clientFilterColor}
        sortOrder={clientSortOrder}
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
