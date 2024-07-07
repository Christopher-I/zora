import React, { useState } from 'react';
import axios from 'axios';
import ImageList from './ImageList';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('relevant');
  const [error, setError] = useState('');

  const handleSearch = async (newPage: number = 1) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query, page: newPage, per_page: 12, color: selectedColor || undefined, order_by: sortBy },
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`
        }
      });
      setImages(response.data.results);
      setPage(newPage);
      setError('');
    } catch (err) {
      setError('Failed to fetch images. Please try again.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
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
        <select onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor}>
          <option value="">All Colors</option>
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
          <option value="relevant">Relevant</option>
          <option value="latest">Latest</option>
        </select>
      </div>
      {error && <p>{error}</p>}
      <ImageList images={images} />
      {images.length > 0 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
          <button onClick={handleNextPage}>Next</button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
