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
}

const ImageList: React.FC<ImageListProps> = ({ images, filterColor, sortOrder }) => {
  const filteredImages = images.filter((image) => {
    return filterColor ? image.color === filterColor : true;
  });

  const sortedImages = filteredImages.sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0; // Default to relevant (no client-side sorting)
  });

  if (!sortedImages.length) {
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
