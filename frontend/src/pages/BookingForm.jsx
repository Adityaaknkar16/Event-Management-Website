import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import { Calendar, MapPin, Users, FileText, CheckCircle2 } from 'lucide-react';

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const serviceIdParam = searchParams.get('serviceId') || '';
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    eventService: serviceIdParam,
    eventDate: '',
    guestCount: '',
    location: '',
    notes: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (err) {
        console.error('Failed to fetch services', err);
        setError('Failed to fetch available services. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { eventService, eventDate, guestCount, location } = formData;
    if (!eventService || !eventDate || !guestCount || !location) {
      setError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/bookings', {
        ...formData,
        guestCount: parseInt(guestCount),
      });
      setSuccess(true);
    } catch (err) {
      console.error('Booking submission failed', err);
      setError(err.response?.data?.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage />;

  if (success) {
    return (
      <div className="container message-container">
        <div className="success-card">
          <CheckCircle2 size={64} className="success-icon" />
          <h2>Booking Request Submitted!</h2>
          <p>
            Your event request has been successfully recorded. An event planner will review the details and contact you shortly.
          </p>
          <div className="success-actions">
            <Link to="/mybookings" className="btn btn-primary">
              View My Bookings
            </Link>
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page container">
      <div className="form-card-wrapper">
        <div className="form-header">
          <h2>Book an Event Service</h2>
          <p>Tell us about your event details and we will make it happen.</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="eventService">Select Event Service *</label>
            <div className="input-with-icon">
              <select
                id="eventService"
                name="eventService"
                value={formData.eventService}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose a Service --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title} (${s.price.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventDate">Event Date *</label>
              <div className="input-with-icon">
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="guestCount">Expected Guest Count *</label>
              <div className="input-with-icon">
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  placeholder="e.g. 150"
                  value={formData.guestCount}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Event Location/Venue Address *</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g. The Grand Ballroom, New York"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Special Requirements / Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              placeholder="Tell us about special dietary rules, color themes, schedules, etc..."
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
            {submitting ? 'Submitting request...' : 'Submit Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
