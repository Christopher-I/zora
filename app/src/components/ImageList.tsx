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
    <div>
      {images.map((image) => (
        <img key={image.id} src={image.urls.small} alt={image.alt_description} />
      ))}
    </div>
  );
};

export default ImageList;
