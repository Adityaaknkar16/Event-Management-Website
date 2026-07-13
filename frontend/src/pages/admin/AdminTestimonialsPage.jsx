import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import StatusBadge from '../../components/shared/StatusBadge';
import { Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const AdminTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending'); // Default to Pending tab highlighted first
  const { refreshNotifications } = useOutletContext() || {};

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await api.get('/testimonials/admin');
      setTestimonials(response.data);
      setFilteredList(response.data.filter(t => !t.isApproved)); // Filter pending by default
    } catch (err) {
      console.error('Failed to load testimonials', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      setFilteredList(testimonials);
    } else if (tab === 'Pending') {
      setFilteredList(testimonials.filter(t => !t.isApproved));
    } else if (tab === 'Approved') {
      setFilteredList(testimonials.filter(t => t.isApproved));
    }
  };

  const handleApproveStatus = async (id, isApproved) => {
    try {
      await api.put(`/testimonials/${id}`, { isApproved });
      const updated = testimonials.map(t => t._id === id ? { ...t, isApproved } : t);
      setTestimonials(updated);
      
      // Update filtered list based on current active tab
      if (activeTab === 'All') {
        setFilteredList(updated);
      } else if (activeTab === 'Pending') {
        setFilteredList(updated.filter(t => !t.isApproved));
      } else if (activeTab === 'Approved') {
        setFilteredList(updated.filter(t => t.isApproved));
      }

      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Failed to update testimonial approval', err);
      alert(err.response?.data?.message || 'Failed to update approval.');
    }
  };

  const handleDelete = async (id, name) => {
    const confirm = window.confirm(`Are you sure you want to delete the testimonial from "${name}"?`);
    if (!confirm) return;

    try {
      await api.delete(`/testimonials/${id}`);
      const updated = testimonials.filter(t => t._id !== id);
      setTestimonials(updated);
      
      if (activeTab === 'All') {
        setFilteredList(updated);
      } else if (activeTab === 'Pending') {
        setFilteredList(updated.filter(t => !t.isApproved));
      } else if (activeTab === 'Approved') {
        setFilteredList(updated.filter(t => t.isApproved));
      }

      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Failed to delete testimonial', err);
      alert(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="manage-testimonials">
      <div className="admin-section-header">
        <div>
          <h3>Client Review Moderation</h3>
          <p>Moderate testimonial reviews submitted by clients before publishing.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filters-wrapper" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
        <div className="filter-buttons">
          {['Pending', 'Approved', 'All'].map(tab => (
            <button
              key={tab}
              className={`filter-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleFilter(tab)}
              style={{
                background: activeTab === tab && tab === 'Pending' ? 'var(--lux-gold)' : '',
                borderColor: activeTab === tab && tab === 'Pending' ? 'var(--lux-gold)' : ''
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredList.length === 0 ? (
        <p className="no-data">No testimonials found in this category.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Review Message</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((t) => (
                <tr key={t._id} style={{ background: !t.isApproved ? 'rgba(201, 169, 97, 0.03)' : '' }}>
                  <td>
                    <strong>{t.customerName}</strong>
                  </td>
                  <td>
                    <p style={{ fontSize: '13px', color: 'var(--lux-text-dim)', maxWidth: '400px', wordBreak: 'break-word' }}>"{t.message}"</p>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '2px', color: 'var(--warning)' }}>
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <span key={idx}>★</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={t.isApproved ? 'approved' : 'pending'} />
                  </td>
                  <td>
                    <div className="table-action-buttons">
                      {t.isApproved ? (
                        <button onClick={() => handleApproveStatus(t._id, false)} className="action-btn" title="Unapprove Review">
                          <XCircle size={14} style={{ color: 'var(--text-muted)' }} />
                        </button>
                      ) : (
                        <button onClick={() => handleApproveStatus(t._id, true)} className="action-btn" title="Approve Review" style={{ borderColor: 'var(--lux-gold)', color: 'var(--lux-gold)' }}>
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(t._id, t.customerName)} className="action-btn delete-btn" title="Delete Review">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonialsPage;
