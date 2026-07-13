import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/shared/Button';
import { Calendar, MapPin, Users, HelpCircle, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const serviceIdParam = searchParams.get('serviceId') || '';
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    eventService: serviceIdParam,
    eventDate: '',
    guestCount: '',
    location: '',
    notes: '',
    premiumMandap: true,
    catering: false,
    photography: false,
    floral: false,
    music: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=/book${serviceIdParam ? `?serviceId=${serviceIdParam}` : ''}`);
    }
  }, [isAuthenticated, authLoading, navigate, serviceIdParam]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (err) {
        console.error('Failed to load services', err);
        setError('Failed to load services database.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

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
      const addonsSelected = [];
      if (formData.catering) addonsSelected.push('Gourmet Royal Catering');
      if (formData.photography) addonsSelected.push('Cinematic Videography');
      if (formData.floral) addonsSelected.push('Dutch Rose Floral Decor');
      if (formData.music) addonsSelected.push('Live Sitar Ensemble');
      if (formData.premiumMandap) addonsSelected.push('Premium Gold Mandap');

      const notesText = `${formData.notes || ''}\n\nAdd-ons requested: ${addonsSelected.join(', ') || 'None'}`;

      await api.post('/bookings', {
        eventService,
        eventDate,
        guestCount: parseInt(guestCount),
        location,
        notes: notesText,
      });

      setSuccess(true);
    } catch (err) {
      console.error('Failed to submit booking', err);
      setError(err.response?.data?.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedServiceObj = services.find(s => s._id === formData.eventService);

  if (loading || authLoading) return <LoadingSpinner fullPage />;

  if (success) {
    return (
      <div className="luxury-theme-wrapper container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="success-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--lux-gold)', padding: '60px 40px', borderRadius: '16px', display: 'inline-block', maxWidth: '600px' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--lux-gold)', marginBottom: '24px' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '28px', marginBottom: '16px' }}>Request Sent — Awaiting Confirmation</h2>
          <p style={{ color: 'var(--lux-text-dim)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
            Thank you! Your custom booking request has been successfully sent to our event coordinators. We will review the details and contact you shortly with the final approval status.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/my-bookings">
              <Button variant="solid">View My Bookings</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Book Event' },
    { num: 2, label: 'Specs' },
    { num: 3, label: 'Add-ons' },
    { num: 4, label: 'Confirm' }
  ];

  return (
    <div className="luxury-theme-wrapper" style={{ paddingBottom: '80px' }}>
      <section className="page-header">
        <div className="container">
          <span className="section-subtitle">CONCIERGE RESERVE</span>
          <h1>Reserve Event Date</h1>
          <p>Tell us about your destination preferences to initialize your coordinate layout.</p>
        </div>
      </section>

      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="luxury-modal-card" style={{ position: 'static', maxWidth: '650px', background: 'var(--bg-secondary)' }}>
          {/* Progress Header */}
          <div className="luxury-progress-indicator">
            {stepsList.map((s, index) => (
              <React.Fragment key={s.num}>
                <div className={`progress-circle ${step >= s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
                  {step > s.num ? <Check size={12} /> : s.num}
                  <span className="progress-label">{s.label}</span>
                </div>
                {index < stepsList.length - 1 && (
                  <div className={`progress-line ${step > s.num ? 'active' : ''}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit}>
            <div className="luxury-modal-body" style={{ padding: '30px 48px' }}>
              {error && <div className="error-banner">{error}</div>}

              {step === 1 && (
                <div className="step-content">
                  <h3>Step 1: Customize Your Package</h3>
                  <p className="step-description">Select your destination package theme below.</p>
                  
                  <div className="luxury-form-group">
                    <label>Select Service *</label>
                    <select
                      name="eventService"
                      value={formData.eventService}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Event Service Package --</option>
                      {services.map(s => (
                        <option key={s._id} value={s._id}>{s.title} (${s.price.toLocaleString()})</option>
                      ))}
                    </select>
                  </div>

                  <div className="luxury-checkbox-group" style={{ marginTop: '24px' }}>
                    <input 
                      type="checkbox"
                      id="premiumMandap"
                      name="premiumMandap"
                      checked={formData.premiumMandap}
                      onChange={handleChange}
                    />
                    <label htmlFor="premiumMandap">Request Premium Golden Mandap & Accent Lighting Setup</label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="step-content">
                  <h3>Step 2: Event Date, Location, & Attendance</h3>
                  <p className="step-description">Secure date coordinates and location addresses.</p>

                  <div className="form-row">
                    <div className="luxury-form-group">
                      <label>Event Date *</label>
                      <input 
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="luxury-form-group">
                      <label>Expected Guests count *</label>
                      <input 
                        type="number"
                        name="guestCount"
                        placeholder="e.g. 200"
                        value={formData.guestCount}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="luxury-form-group">
                    <label>Venue / Destination Address *</label>
                    <div className="input-with-icon">
                      <MapPin size={16} className="input-icon" style={{ left: '16px', color: 'var(--lux-gold)' }} />
                      <input 
                        type="text"
                        name="location"
                        placeholder="e.g. The Palace Lawns, Udaipur"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '48px' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="step-content">
                  <h3>Step 3: Heritage Services & Add-ons</h3>
                  <p className="step-description">Select optional configurations to append to your booking.</p>

                  <div className="addons-list-luxury">
                    <div 
                      className={`addon-luxury-card ${formData.catering ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, catering: !formData.catering })}
                    >
                      <div className="addon-check">{formData.catering && <Check size={12} />}</div>
                      <div>
                        <h4>Gourmet Royal Catering</h4>
                        <p>Bespoke food buffet led by Michelin-star chefs.</p>
                      </div>
                    </div>

                    <div 
                      className={`addon-luxury-card ${formData.photography ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, photography: !formData.photography })}
                    >
                      <div className="addon-check">{formData.photography && <Check size={12} />}</div>
                      <div>
                        <h4>Cinematic Videography & Shoots</h4>
                        <p>High quality documentary production & wedding trailers.</p>
                      </div>
                    </div>

                    <div 
                      className={`addon-luxury-card ${formData.floral ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, floral: !formData.floral })}
                    >
                      <div className="addon-check">{formData.floral && <Check size={12} />}</div>
                      <div>
                        <h4>Dutch Floral Mandap Arches</h4>
                        <p>Imported hand-woven setups and floral entrances.</p>
                      </div>
                    </div>

                    <div 
                      className={`addon-luxury-card ${formData.music ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, music: !formData.music })}
                    >
                      <div className="addon-check">{formData.music && <Check size={12} />}</div>
                      <div>
                        <h4>Classical Sitar & Instrumental Orchestra</h4>
                        <p>Welcoming music performers during guest arrivals.</p>
                      </div>
                    </div>
                  </div>

                  <div className="luxury-form-group" style={{ marginTop: '24px' }}>
                    <label>Special Instructions / Notes</label>
                    <textarea 
                      name="notes"
                      rows="3"
                      placeholder="List any medical restrictions, stage width requirements, etc..."
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="step-content confirmation-step">
                  <h3>Step 4: Review Selections</h3>
                  <p className="step-description">Verify details before requesting final coordinator review.</p>

                  <div className="booking-summary-box">
                    <div className="summary-row">
                      <span>Service Package:</span>
                      <strong>{selectedServiceObj?.title || 'Custom Service'}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Date:</span>
                      <strong>{formData.eventDate}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Expected Guests:</span>
                      <strong>{formData.guestCount} People</strong>
                    </div>
                    <div className="summary-row">
                      <span>Venue Location:</span>
                      <strong>{formData.location}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Special Requests:</span>
                      <strong>
                        {[
                          formData.premiumMandap && 'Gold Mandap',
                          formData.catering && 'Royal Catering',
                          formData.photography && 'Cinematic Video',
                          formData.floral && 'Dutch Florals',
                          formData.music && 'Classical Live Music'
                        ].filter(Boolean).join(', ') || 'None'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="luxury-modal-footer">
              {step > 1 ? (
                <Button variant="ghost" onClick={handlePrev}>Back</Button>
              ) : (
                <Link to="/services">
                  <Button variant="ghost">Cancel</Button>
                </Link>
              )}

              {step < 4 ? (
                <Button variant="solid" onClick={handleNext} disabled={step === 1 && !formData.eventService}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" variant="solid" disabled={submitting}>
                  {submitting ? 'Sending Request...' : 'Book Event'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
