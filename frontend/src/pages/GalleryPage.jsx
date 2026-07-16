import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { Camera, X, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await api.get('/gallery');
      setItems(response.data);
      
      const cats = ['All', ...new Set(response.data.map(item => item.category))];
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load gallery', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (category) => {
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
    <div className="luxury-theme-wrapper" style={{ paddingBottom: '80px' }}>
      <section className="page-header">
        <motion.div 
          className="container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-subtitle">VISUAL ARCHIVE</span>
          <h1>Event Locations</h1>
          <p>Explore Visual setups from our destination banquets, fortresses, and palaces.</p>
        </motion.div>
      </section>

      <section className="container">
        {/* Filters */}
        <div className="filters-wrapper" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '40px' }}>
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <EmptyState message="No photos found under this category." icon={<Camera size={48} style={{ color: 'var(--lux-gold)' }} />} />
        ) : (
          <motion.div 
            className="gallery-grid"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {items.map(item => (
              <motion.div 
                key={item._id} 
                className="gallery-card"
                onClick={() => setLightboxItem(item)}
                style={{ height: '300px' }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="gallery-image-wrapper">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'; }}
                  />
                  <div className="gallery-overlay" style={{ opacity: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', background: 'rgba(0,0,0,0.6)' }}>
                      <ZoomIn size={24} style={{ color: 'var(--lux-gold)', marginBottom: '8px' }} />
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--lux-gold)' }}>{item.category}</span>
                      <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', margin: '4px 0 0' }}>{item.title}</h4>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 5, 5, 0.95)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
          }}
          onClick={() => setLightboxItem(null)}
        >
          <button 
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'transparent',
              border: 'none',
              color: 'var(--lux-gold)',
              cursor: 'pointer'
            }}
            onClick={() => setLightboxItem(null)}
          >
            <X size={28} />
          </button>
          
          <img 
            src={lightboxItem.imageUrl} 
            alt={lightboxItem.title} 
            style={{
              maxWidth: '90%',
              maxHeight: '75vh',
              objectFit: 'contain',
              border: '1px solid var(--lux-gold)',
              borderRadius: '8px',
              boxShadow: '0 0 40px rgba(201, 169, 97, 0.2)'
            }}
          />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: 'var(--lux-gold)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{lightboxItem.category}</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', margin: '4px 0 0', fontSize: '24px' }}>{lightboxItem.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
