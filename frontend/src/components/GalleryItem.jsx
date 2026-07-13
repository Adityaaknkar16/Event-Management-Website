import React from 'react';

const GalleryItem = ({ item }) => {
  return (
    <div className="gallery-card">
      <div className="gallery-image-wrapper">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'; }}
        />
        <div className="gallery-overlay">
          <div className="gallery-info">
            <span className="gallery-cat">{item.category}</span>
            <h4 className="gallery-title">{item.title}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;
