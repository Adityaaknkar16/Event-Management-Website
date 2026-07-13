import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { Trash2, Phone, Mail, Calendar, MapPin, Users } from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      // Update local state instead of full reload to prevent screen flicker
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      console.error('Failed to update booking status', err);
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id, customerName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the booking for "${customerName}"?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      console.error('Failed to delete booking', err);
      alert(err.response?.data?.message || 'Failed to delete booking.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="manage-bookings">
      <div className="admin-section-header">
        <div>
          <h3>Manage Booking Requests</h3>
          <p>Review booking details, change reservation statuses, or delete requests.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p className="no-data">No booking requests submitted yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer info</th>
                <th>Selected Service</th>
                <th>Event Specs</th>
                <th>Notes / Requirements</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <div className="customer-info-cell">
                      <strong>{booking.customer?.name || 'Unknown User'}</strong>
                      <span className="subtext-detail"><Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />{booking.customer?.email}</span>
                      {booking.customer?.phone && (
                        <span className="subtext-detail"><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />{booking.customer.phone}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <strong>{booking.eventService?.title || 'Custom Service'}</strong>
                    <span className="subtext-detail">{booking.eventService?.category}</span>
                  </td>
                  <td>
                    <div className="specs-cell">
                      <span><Calendar size={12} /> {new Date(booking.eventDate).toLocaleDateString()}</span>
                      <span><Users size={12} /> {booking.guestCount} Guests</span>
                      <span><MapPin size={12} /> {booking.location}</span>
                    </div>
                  </td>
                  <td>
                    <p className="notes-para">{booking.notes || '—'}</p>
                  </td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className={`status-selector ${booking.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(booking._id, booking.customer?.name || 'Unknown')}
                      className="action-btn delete-btn"
                      title="Delete Booking"
                    >
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

export default ManageBookings;
