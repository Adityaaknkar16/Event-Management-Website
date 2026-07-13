import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import StatusBadge from '../components/shared/StatusBadge';
import { Calendar, MapPin, Users, Info, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';

const MyBookingsPage = () => {
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

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="luxury-theme-wrapper container" style={{ paddingBottom: '80px', paddingTop: '40px' }}>
      <div className="page-header-simple">
        <span className="section-subtitle">YOUR DASHBOARD</span>
        <h1>My Bookings</h1>
        <p>Track the confirmation state of your submitted destination requests.</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState 
          message="You haven't scheduled any event bookings yet." 
          icon={
            <Link to="/book">
              <Button variant="solid" size="md">
                <Plus size={16} /> Book a Package
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-item-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div className="booking-item-header">
                <div>
                  <span className="booking-service-cat" style={{ color: 'var(--lux-gold)' }}>{booking.eventService?.category}</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '22px' }}>{booking.eventService?.title || 'Custom Service Package'}</h3>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              
              <div className="booking-item-details">
                <div className="detail-field">
                  <Calendar size={16} className="field-icon" style={{ color: 'var(--lux-gold)' }} />
                  <div>
                    <span>Event Date</span>
                    <p style={{ color: 'var(--lux-text-light)' }}>
                      {new Date(booking.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="detail-field">
                  <Users size={16} className="field-icon" style={{ color: 'var(--lux-gold)' }} />
                  <div>
                    <span>Expected Attendance</span>
                    <p style={{ color: 'var(--lux-text-light)' }}>{booking.guestCount} Guests</p>
                  </div>
                </div>

                <div className="detail-field">
                  <MapPin size={16} className="field-icon" style={{ color: 'var(--lux-gold)' }} />
                  <div>
                    <span>Venue Location</span>
                    <p style={{ color: 'var(--lux-text-light)' }}>{booking.location}</p>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="booking-item-notes" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <Info size={14} className="notes-icon" style={{ color: 'var(--lux-gold)' }} />
                  <p style={{ color: 'var(--lux-text-dim)', fontSize: '13px' }}><strong>Coordinator Notes:</strong> {booking.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
