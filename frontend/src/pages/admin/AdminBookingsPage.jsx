import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import StatusBadge from '../../components/shared/StatusBadge';
import { Trash2, Phone, Mail, Calendar, MapPin, Users } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const { refreshNotifications } = useOutletContext() || {};

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === tab.toLowerCase()));
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      const updated = bookings.map(b => b._id === id ? { ...b, status } : b);
      setBookings(updated);
      
      // Update filtered list based on current active tab
      if (activeTab === 'All') {
        setFilteredBookings(updated);
      } else {
        setFilteredBookings(updated.filter(b => b.status === activeTab.toLowerCase()));
      }

      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Failed to update booking status', err);
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id, name) => {
    const confirm = window.confirm(`Are you sure you want to delete the booking request from "${name}"?`);
    if (!confirm) return;

    try {
      await api.delete(`/bookings/${id}`);
      const updated = bookings.filter(b => b._id !== id);
      setBookings(updated);
      
      if (activeTab === 'All') {
        setFilteredBookings(updated);
      } else {
        setFilteredBookings(updated.filter(b => b.status === activeTab.toLowerCase()));
      }

      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Failed to delete booking', err);
      alert(err.response?.data?.message || 'Failed to delete booking.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="manage-bookings">
      <div className="admin-section-header">
        <div>
          <h3>Booking Reservations</h3>
          <p>Review customer dates, modify confirmation states, and approve plans.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="filters-wrapper" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
        <div className="filter-buttons">
          {['All', 'Pending', 'Confirmed', 'Rejected', 'Completed'].map(tab => (
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

      {filteredBookings.length === 0 ? (
        <p className="no-data">No bookings found under this status.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer details</th>
                <th>Selected Package</th>
                <th>Event Specs</th>
                <th>Add-ons / Requirements</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b._id} style={{ background: b.status === 'pending' ? 'rgba(201, 169, 97, 0.03)' : '' }}>
                  <td>
                    <div className="customer-info-cell">
                      <strong>{b.customer?.name}</strong>
                      <span className="subtext-detail"><Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />{b.customer?.email}</span>
                      {b.customer?.phone && (
                        <span className="subtext-detail"><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />{b.customer?.phone}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <strong>{b.eventService?.title || 'Custom package'}</strong>
                    <span className="subtext-detail">{b.eventService?.category}</span>
                  </td>
                  <td>
                    <div className="specs-cell">
                      <span><Calendar size={12} style={{ color: 'var(--lux-gold)' }} /> {new Date(b.eventDate).toLocaleDateString()}</span>
                      <span><Users size={12} style={{ color: 'var(--lux-gold)' }} /> {b.guestCount} Guests</span>
                      <span><MapPin size={12} style={{ color: 'var(--lux-gold)' }} /> {b.location}</span>
                    </div>
                  </td>
                  <td>
                    <p className="notes-para" style={{ whiteSpace: 'pre-line' }}>{b.notes || '—'}</p>
                  </td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className={`status-selector ${b.status}`}
                      style={{
                        border: b.status === 'pending' ? '1px solid var(--lux-gold)' : ''
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(b._id, b.customer?.name)} className="action-btn delete-btn" title="Delete Booking">
                      <Trash2 size={16} />
                    </button>
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

export default AdminBookingsPage;
