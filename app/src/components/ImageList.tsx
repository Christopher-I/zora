import React from 'react';

interface Image {
  id: string;
  alt_description: string;
  urls: { small: string };
  color: string;
  created_at: string;
}

interface ImageListProps {
  images: Image[];
  filterColor: string;
  sortOrder: string;
  isLoading: boolean;
  hasSearched: boolean;
}

const ImageList: React.FC<ImageListProps> = ({ images, filterColor, sortOrder, isLoading, hasSearched }) => {
  const filteredImages = images.filter((image) => {
    return filterColor ? image.color === filterColor : true;
  });

  const sortedImages = filteredImages.sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0; // Default to relevant (no client-side sorting)
  });

  if (isLoading) {
    return (
      <div className="image-list">
        {[...Array(9)].map((_, index) => (
          <div key={index} className="image-container">
            <div className="skeleton-loader"></div>
          </div>
        ))}
      </div>
    );
  }

  if (hasSearched && !sortedImages.length) {
    return <p>No images found</p>;
  }

  return (
    <div className="image-list">
      {sortedImages.map((image) => (
        <div key={image.id} className="image-container">
          <img src={image.urls.small} alt={image.alt_description} />
        </div>
      ))}
    </div>
  );
};

export default ImageList;
