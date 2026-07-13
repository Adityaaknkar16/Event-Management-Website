import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Button from '../../components/shared/Button';
import { Trash2, Upload } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const AdminGalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshNotifications } = useOutletContext() || {};

  // Form State
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await api.get('/gallery');
      setItems(response.data);
    } catch (err) {
      console.error('Failed to load gallery', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!title || !imageUrl || !category) {
      setFormError('Please fill in all fields.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/gallery', { title, imageUrl, category });
      setTitle('');
      setImageUrl('');
      setCategory('');
      fetchGallery();
      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Failed to create gallery item', err);
      setFormError(err.response?.data?.message || 'Failed to add image.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    const confirm = window.confirm(`Are you sure you want to delete the gallery photo "${title}"?`);
    if (!confirm) return;

    try {
      await api.delete(`/gallery/${id}`);
      setItems(items.filter(item => item._id !== id));
      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Failed to delete image', err);
      alert(err.response?.data?.message || 'Failed to delete photo.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="manage-gallery">
      <div className="admin-section-header">
        <div>
          <h3>Portfolio Gallery</h3>
          <p>Add new destination images and remove outdated visuals.</p>
        </div>
      </div>

      <div className="gallery-admin-grid">
        {/* Upload form */}
        <div className="gallery-upload-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Add New Portfolio Image</h4>
          
          {formError && <div className="error-banner">{formError}</div>}
          
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label htmlFor="title" style={{ color: 'var(--lux-gold)' }}>Photo Title *</label>
              <input 
                type="text"
                id="title"
                placeholder="e.g. Royal Wedding Mandap, Jaipur"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" style={{ color: 'var(--lux-gold)' }}>Category *</label>
              <input 
                type="text"
                id="category"
                placeholder="e.g. Palaces, Banquets, Decor"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl" style={{ color: 'var(--lux-gold)' }}>Image URL *</label>
              <input 
                type="url"
                id="imageUrl"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="solid" className="btn-block" disabled={submitting}>
              {submitting ? 'Uploading...' : 'Add Image'} <Upload size={16} style={{ marginLeft: '8px' }} />
            </Button>
          </form>
        </div>

        {/* List of images */}
        <div className="gallery-admin-list" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Uploaded Photos ({items.length})</h4>
          
          {items.length === 0 ? (
            <p className="no-data">No gallery items uploaded yet.</p>
          ) : (
            <div className="admin-thumbnails-grid">
              {items.map((item) => (
                <div key={item._id} className="thumb-item-wrapper" style={{ border: '1px solid var(--border-color)' }}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=100'; }}
                  />
                  <div className="thumb-info-bar">
                    <h5>{item.title}</h5>
                    <span>{item.category}</span>
                  </div>
                  <button onClick={() => handleDelete(item._id, item.title)} className="thumb-delete-btn" title="Delete Image">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryPage;
