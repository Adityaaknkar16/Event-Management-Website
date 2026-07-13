import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshNotifications } = useOutletContext() || {};

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    imageUrl: '',
    isActive: true,
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/services/admin');
      setServices(response.data);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      imageUrl: '',
      isActive: true,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price.toString(),
      imageUrl: service.imageUrl,
      isActive: service.isActive,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const { title, description, category, price, imageUrl } = formData;
    if (!title || !description || !category || price === '' || !imageUrl) {
      setFormError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = { ...formData, price: parseFloat(price) };

      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
      } else {
        await api.post('/services', payload);
      }

      setShowModal(false);
      fetchServices();
      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Failed to save service', err);
      setFormError(err.response?.data?.message || 'Error occurred while saving service package.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    const confirm = window.confirm(`Are you sure you want to delete the package "${title}"?`);
    if (!confirm) return;

    try {
      await api.delete(`/services/${id}`);
      fetchServices();
      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Failed to delete service', err);
      alert(err.response?.data?.message || 'Failed to remove service.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="manage-services">
      <div className="admin-section-header">
        <div>
          <h3>Service Packages catalog</h3>
          <p>Configure packages shown in the concierge services tab.</p>
        </div>
        <Button variant="solid" onClick={handleOpenCreate}>
          <Plus size={16} /> Add New Package
        </Button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Package Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>
                  <img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="admin-table-thumb"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=100'; }}
                  />
                </td>
                <td>
                  <strong>{service.title}</strong>
                  <span className="subtext-detail truncate-text">{service.description}</span>
                </td>
                <td>{service.category}</td>
                <td>${service.price.toLocaleString()}</td>
                <td>
                  <span className={`status-badge-boolean ${service.isActive ? 'active' : 'inactive'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="table-action-buttons">
                    <button onClick={() => handleOpenEdit(service)} className="action-btn edit-btn" title="Edit Package">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(service._id, service.title)} className="action-btn delete-btn" title="Delete Package">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Event Package' : 'Add New Event Package'}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="error-banner">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" style={{ color: 'var(--lux-gold)' }}>Package Title *</label>
            <input 
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Royal Palace Wedding Banquet"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" style={{ color: 'var(--lux-gold)' }}>Category *</label>
              <input 
                type="text"
                id="category"
                name="category"
                placeholder="e.g. Weddings, Sangeet"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price" style={{ color: 'var(--lux-gold)' }}>Starting Price ($) *</label>
              <input 
                type="number"
                id="price"
                name="price"
                placeholder="e.g. 5000"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl" style={{ color: 'var(--lux-gold)' }}>Image Banner URL *</label>
            <input 
              type="url"
              id="imageUrl"
              name="imageUrl"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" style={{ color: 'var(--lux-gold)' }}>Description *</label>
            <textarea 
              id="description"
              name="description"
              rows="4"
              placeholder="Describe what resources, catering, and layouts are included..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive">Show package on active public list</label>
          </div>

          <div className="modal-actions">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="solid" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Package'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminServicesPage;
