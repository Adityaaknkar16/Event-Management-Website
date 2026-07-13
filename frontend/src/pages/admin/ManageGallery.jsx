import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { Trash2, Plus, X, Image, Upload } from 'lucide-react';

const ManageGallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setGalleryItems(response.data);
    } catch (error) {
      console.error('Failed to load gallery items', error);
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
    } catch (err) {
      console.error('Failed to create gallery item', err);
      setFormError(err.response?.data?.message || 'Failed to add image.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the gallery photo "${title}"?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/gallery/${id}`);
      setGalleryItems(galleryItems.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to delete gallery item', err);
      alert(err.response?.data?.message || 'Failed to remove image.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="manage-gallery">
      <div className="admin-section-header">
        <div>
          <h3>Manage Portfolio Gallery</h3>
          <p>Add new project visuals or delete outdated items from the public website.</p>
        </div>
      </div>

      <div className="gallery-admin-grid">
        {/* Upload Form */}
        <div className="gallery-upload-card">
          <h4>Add New Portfolio Item</h4>
          {formError && <div className="error-banner">{formError}</div>}
          
          <form onSubmit={handleSubmit} className="admin-gallery-form">
            <div className="form-group">
              <label htmlFor="title">Photo Title *</label>
              <input
                type="text"
                id="title"
                placeholder="e.g. Wedding Reception Backdrop"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <input
                type="text"
                id="category"
                placeholder="e.g. Weddings, Corporate, Birthday"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">Image URL *</label>
              <input
                type="url"
                id="imageUrl"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Uploading...' : 'Add Image'} <Upload size={16} style={{ marginLeft: '8px' }} />
            </button>
          </form>
        </div>

        {/* Existing Grid */}
        <div className="gallery-admin-list">
          <h4>Uploaded Items ({galleryItems.length})</h4>
          {galleryItems.length === 0 ? (
            <p className="no-data">No gallery items uploaded yet.</p>
          ) : (
            <div className="admin-thumbnails-grid">
              {galleryItems.map((item) => (
                <div key={item._id} className="thumb-item-wrapper">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=100'; }}
                  />
                  <div className="thumb-info-bar">
                    <h5>{item.title}</h5>
                    <span>{item.category}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="thumb-delete-btn"
                    title="Delete Image"
                  >
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

export default ManageGallery;
