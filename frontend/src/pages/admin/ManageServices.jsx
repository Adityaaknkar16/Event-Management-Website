import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form modal state
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
    } catch (error) {
      console.error('Failed to fetch admin services', error);
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
      const payload = {
        ...formData,
        price: parseFloat(price),
      };

      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
      } else {
        await api.post('/services', payload);
      }
      
      setShowModal(false);
      fetchServices();
    } catch (err) {
      console.error('Failed to save service', err);
      setFormError(err.response?.data?.message || 'Error occurred while saving service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the service "${title}"?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error('Failed to delete service', err);
      alert(err.response?.data?.message || 'Failed to delete service.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="manage-services">
      <div className="admin-section-header">
        <div>
          <h3>Manage Event Services</h3>
          <p>Create, update, or disable service listings displayed to users.</p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={16} /> Add New Service
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Service Title</th>
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
                    <button
                      onClick={() => handleOpenEdit(service)}
                      className="action-btn edit-btn"
                      title="Edit Service"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id, service.title)}
                      className="action-btn delete-btn"
                      title="Delete Service"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content-card">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Event Service' : 'Add New Event Service'}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {formError && (
                <div className="error-banner">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="title">Service Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g. Wedding Floral Decoration"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="e.g. Decor, Catering, Sound"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Starting Price ($) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="e.g. 1500"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Service Banner Image URL *</label>
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
                <label htmlFor="description">Detailed Description *</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="Describe details and limits of the package..."
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
                <label htmlFor="isActive">Mark as Active (Show in customer catalog)</label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
