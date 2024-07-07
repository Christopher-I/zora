import React from 'react';

interface Image {
  id: string;
  alt_description: string;
  urls: { small: string };
}

interface ImageListProps {
  images: Image[];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  if (!images.length) {
    return <p>No images found</p>;
  }

  return (
    <div className="image-list">
      {images.map((image) => (
        <div key={image.id} className="image-container">
          <img src={image.urls.small} alt={image.alt_description} />
        </div>
      ))}
    </div>
  );
};

export default ImageList;
