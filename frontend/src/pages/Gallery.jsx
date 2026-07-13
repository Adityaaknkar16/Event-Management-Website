import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import GalleryItem from '../components/GalleryItem';
import Loader from '../components/Loader';
import { Camera } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.get('/gallery');
        setItems(response.data);
        
        // Extract unique categories
        const cats = ['All', ...new Set(response.data.map(item => item.category))];
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load gallery items', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGallery();
  }, []);

  const handleCategoryFilter = async (category) => {
    setActiveCategory(category);
    setLoading(true);
    try {
      const url = category === 'All' ? '/gallery' : `/gallery?category=${encodeURIComponent(category)}`;
      const response = await api.get(url);
      setItems(response.data);
    } catch (error) {
      console.error('Failed to filter gallery', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gallery-page">
      <section className="page-header">
        <div className="container">
          <h1>Event Gallery</h1>
          <p>Explore some of the visual magic we have co-created with our clients.</p>
        </div>
      </section>

      <section className="gallery-content container">
        {/* Filters */}
        <div className="filters-wrapper">
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <div className="empty-state">
            <Camera size={48} className="empty-icon" />
            <p>No photos uploaded yet in this category.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {items.map(item => (
              <GalleryItem key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Gallery;
