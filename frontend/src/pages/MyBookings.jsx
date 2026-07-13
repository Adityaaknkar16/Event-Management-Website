import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { Calendar, MapPin, Users, Info, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await api.get('/bookings/mybookings');
        setBookings(response.data);
      } catch (err) {
        console.error('Failed to load user bookings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-badge confirmed';
      case 'rejected': return 'status-badge rejected';
      case 'completed': return 'status-badge completed';
      default: return 'status-badge pending';
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="mybookings-page container">
      <div className="page-header-simple">
        <h1>My Bookings</h1>
        <p>Track the confirmation and schedule details of your event requests.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-bookings-card">
          <Calendar size={48} className="empty-icon" />
          <h3>No Bookings Request Found</h3>
          <p>You haven't scheduled any event services yet. Select a service to get started.</p>
          <Link to="/services" className="btn btn-primary">
            <Plus size={16} /> Book a Service
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-item-card">
              <div className="booking-item-header">
                <div>
                  <span className="booking-service-cat">{booking.eventService?.category}</span>
                  <h3>{booking.eventService?.title || 'Custom Event Service'}</h3>
                </div>
                <span className={getStatusClass(booking.status)}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              
              <div className="booking-item-details">
                <div className="detail-field">
                  <Calendar size={16} className="field-icon" />
                  <div>
                    <span>Date</span>
                    <p>{new Date(booking.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="detail-field">
                  <Users size={16} className="field-icon" />
                  <div>
                    <span>Guests</span>
                    <p>{booking.guestCount} People</p>
                  </div>
                </div>

                <div className="detail-field">
                  <MapPin size={16} className="field-icon" />
                  <div>
                    <span>Location</span>
                    <p>{booking.location}</p>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="booking-item-notes">
                  <Info size={14} className="notes-icon" />
                  <p><strong>Note:</strong> {booking.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
