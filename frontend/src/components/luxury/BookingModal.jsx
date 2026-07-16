// ROOT CAUSE: The booking modal on the homepage was not calling the backend API at all; it was using a mock alert message. Now it properly fetches active services, checks authentication, and posts the booking request to /api/bookings.
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Check, HelpCircle, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Button from '../shared/Button';

const BookingModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    eventService: '',
    guestCount: '150',
    premiumSetup: true,
    eventDate: '',
    location: 'Palace Grounds',
    catering: true,
    photography: true,
    floral: false,
    music: false,
  });

  useEffect(() => {
    if (isOpen) {
      const fetchServices = async () => {
        try {
          const response = await api.get('/services');
          setServices(response.data);
          if (response.data.length > 0) {
            setFormData(prev => ({ ...prev, eventService: response.data[0]._id }));
          }
        } catch (err) {
          console.error('Failed to load services in modal', err);
        } finally {
          setLoading(false);
        }
      };
      fetchServices();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login?redirect=/book');
      return;
    }

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
      if (formData.premiumSetup) addonsSelected.push('Premium Gold Mandap');

      const notesText = `Add-ons requested: ${addonsSelected.join(', ') || 'None'}`;

      await api.post('/bookings', {
        eventService,
        eventDate,
        guestCount: parseInt(guestCount),
        location,
        notes: notesText,
      });

      setSuccess(true);
    } catch (err) {
      console.error('Modal booking failed', err);
      setError(err.response?.data?.message || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Book Event' },
    { num: 2, label: 'Customize Package' },
    { num: 3, label: 'Select Add-ons' },
    { num: 4, label: 'Confirm' }
  ];

  const selectedServiceObj = services.find(s => s._id === formData.eventService);

  return (
    <div className="luxury-modal-backdrop" onClick={onClose}>
      <div className="luxury-modal-card" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="luxury-modal-close">
          <X size={20} />
        </button>

        {success ? (
          <div className="luxury-modal-body" style={{ padding: '40px', textAlign: 'center' }}>
            <CheckCircle2 size={64} style={{ color: 'var(--lux-gold)', marginBottom: '24px', display: 'inline-block' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '24px', marginBottom: '16px' }}>Request Sent — Awaiting Confirmation</h2>
            <p style={{ color: 'var(--lux-text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
              Thank you! Your custom booking request has been successfully sent to our event coordinators. We will review the details and contact you shortly with the final approval status.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/my-bookings" onClick={onClose}>
                <Button variant="solid">View My Bookings</Button>
              </Link>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : (
          <>
            {/* Multi-step progress indicator */}
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

            {/* Step Content Area */}
            <div className="luxury-modal-body">
              {error && <div className="error-banner" style={{ marginBottom: '16px' }}>{error}</div>}

              {step === 1 && (
                <div className="step-content">
                  <h3>Step 1: Customize Your Package</h3>
                  <p className="step-description">Select the primary celebration style and guest count for your custom luxury layout.</p>
                  
                  <div className="luxury-form-group">
                    <label>Select Event Theme *</label>
                    {loading ? (
                      <select disabled><option>Loading packages...</option></select>
                    ) : (
                      <select 
                        name="eventService"
                        value={formData.eventService}
                        onChange={handleChange}
                      >
                        {services.map(s => (
                          <option key={s._id} value={s._id}>{s.title} (${s.price.toLocaleString()})</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="luxury-form-group">
                    <label>Estimated Attendance *</label>
                    <input 
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleChange}
                      min="1"
                      placeholder="e.g. 150"
                      required
                      style={{
                        width: '100%',
                        background: '#121420',
                        border: '1px solid var(--border-color)',
                        color: 'var(--lux-text-light)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        marginTop: '8px'
                      }}
                    />
                  </div>

                  <div className="checkbox-group" style={{ marginTop: '16px' }}>
                    <input 
                      type="checkbox" 
                      id="premiumSetup"
                      name="premiumSetup"
                      checked={formData.premiumSetup}
                      onChange={handleChange}
                    />
                    <label htmlFor="premiumSetup">Request Premium Golden Mandap & Accent Lighting</label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="step-content">
                  <h3>Step 2: Set Date & Venue Style</h3>
                  <p className="step-description">Secure your preferred date and select from our list of architectural styles.</p>

                  <div className="luxury-form-group">
                    <label>Event Date *</label>
                    <div className="luxury-input-wrapper">
                      <Calendar className="input-icon" size={16} />
                      <input 
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="luxury-form-group">
                    <label>Preferred Venue Style *</label>
                    <input 
                      type="text"
                      name="location"
                      placeholder="e.g. Heritage Palace Grounds & Lawns"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        background: '#121420',
                        border: '1px solid var(--border-color)',
                        color: 'var(--lux-text-light)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        marginTop: '8px'
                      }}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="step-content">
                  <h3>Step 3: Heritage Services & Add-ons</h3>
                  <p className="step-description">Select additional handpicked options to complete your destination experience.</p>

                  <div className="addons-list-luxury">
                    <div 
                      className={`addon-luxury-card ${formData.catering ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, catering: !formData.catering })}
                    >
                      <div className="addon-check">
                        {formData.catering && <Check size={12} />}
                      </div>
                      <div>
                        <h4>Gourmet Royal Catering</h4>
                        <p>Traditional multi-cuisine luxury buffet led by Michelin chefs.</p>
                      </div>
                    </div>

                    <div 
                      className={`addon-luxury-card ${formData.photography ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, photography: !formData.photography })}
                    >
                      <div className="addon-check">
                        {formData.photography && <Check size={12} />}
                      </div>
                      <div>
                        <h4>Cinematic Videography</h4>
                        <p>Exclusive drone coordination & full documentary production.</p>
                      </div>
                    </div>

                    <div 
                      className={`addon-luxury-card ${formData.floral ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, floral: !formData.floral })}
                    >
                      <div className="addon-check">
                        {formData.floral && <Check size={12} />}
                      </div>
                      <div>
                        <h4>Traditional Rose Decor</h4>
                        <p>Imported Dutch roses, customized arches, and hand-woven garlands.</p>
                      </div>
                    </div>

                    <div 
                      className={`addon-luxury-card ${formData.music ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, music: !formData.music })}
                    >
                      <div className="addon-check">
                        {formData.music && <Check size={12} />}
                      </div>
                      <div>
                        <h4>Classical Sitar & Shehnai Ensemble</h4>
                        <p>Live traditional background musicians for welcoming guests.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="step-content confirmation-step">
                  <div className="success-badge-luxury">
                    <Sparkles size={32} />
                  </div>
                  <h3>Review Your Royal Package</h3>
                  <p className="step-description">Here is a summary of your selected preferences before submitting.</p>

                  <div className="booking-summary-box">
                    <div className="summary-row">
                      <span>Theme:</span>
                      <strong>{selectedServiceObj?.title || 'Custom Theme'}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Expected Guests:</span>
                      <strong>{formData.guestCount} Guests</strong>
                    </div>
                    <div className="summary-row">
                      <span>Date:</span>
                      <strong>{formData.eventDate || 'Not selected'}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Venue:</span>
                      <strong>{formData.location}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Gold Mandap:</span>
                      <strong>{formData.premiumSetup ? 'Yes, Requested' : 'No'}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Selected Add-ons:</span>
                      <strong>
                        {[
                          formData.catering && 'Catering',
                          formData.photography && 'Photography',
                          formData.floral && 'Floral Decor',
                          formData.music && 'Live Music'
                        ].filter(Boolean).join(', ') || 'None'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="luxury-modal-footer">
              {step > 1 ? (
                <button onClick={handlePrev} className="btn-luxury-ghost">
                  Back
                </button>
              ) : (
                <button onClick={onClose} className="btn-luxury-ghost">
                  Cancel
                </button>
              )}

              {step < 4 ? (
                <button onClick={handleNext} className="btn-luxury-solid" disabled={!formData.eventService}>
                  Continue
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="btn-luxury-solid"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : isAuthenticated ? 'Book Event' : 'Log in to Book'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
