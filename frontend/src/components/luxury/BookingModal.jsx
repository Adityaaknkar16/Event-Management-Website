import React, { useState } from 'react';
import { X, Check, HelpCircle, Calendar, Sparkles } from 'lucide-react';

const BookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    packageName: 'Royal Marriage',
    guestRange: '100-250 guests',
    premiumSetup: true,
    eventDate: '',
    venueType: 'Palace Grounds',
    addons: {
      catering: true,
      photography: true,
      floral: false,
      music: false,
    }
  });

  if (!isOpen) return null;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleAddonChange = (name) => {
    setFormData({
      ...formData,
      addons: {
        ...formData.addons,
        [name]: !formData.addons[name]
      }
    });
  };

  const stepsList = [
    { num: 1, label: 'Book Event' },
    { num: 2, label: 'Customize Package' },
    { num: 3, label: 'Select Add-ons' },
    { num: 4, label: 'Confirm' }
  ];

  return (
    <div className="luxury-modal-backdrop">
      {/* Decorative Mandala left */}
      <div className="mandala-decor left-decor"></div>
      
      <div className="luxury-modal-card">
        <button onClick={onClose} className="luxury-modal-close">
          <X size={20} />
        </button>

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
          {step === 1 && (
            <div className="step-content">
              <h3>Step 1: Customize Your Package</h3>
              <p className="step-description">Select the primary celebration style and guest count for your custom luxury layout.</p>
              
              <div className="luxury-form-group">
                <label>Select Event Theme *</label>
                <select 
                  value={formData.packageName}
                  onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                >
                  <option value="Royal Marriage">Royal Palace Marriage</option>
                  <option value="Grand Sangeet">Grand Sangeet Showcase</option>
                  <option value="Holi Festival">Holi Festival & Gala</option>
                  <option value="Diwali Gala">Diwali Heritage Banquet</option>
                  <option value="Corporate Event">Corporate Summit</option>
                </select>
              </div>

              <div className="luxury-form-group">
                <label>Estimated Attendance *</label>
                <select
                  value={formData.guestRange}
                  onChange={(e) => setFormData({ ...formData, guestRange: e.target.value })}
                >
                  <option value="50-100 guests">Intimate (50 - 100 guests)</option>
                  <option value="100-250 guests">Standard (100 - 250 guests)</option>
                  <option value="250-500 guests">Grand (250 - 500 guests)</option>
                  <option value="500+ guests">Royal Majestic (500+ guests)</option>
                </select>
              </div>

              <div className="luxury-checkbox-group">
                <input 
                  type="checkbox" 
                  id="premiumSetup"
                  name="premiumSetup"
                  checked={formData.premiumSetup}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="premiumSetup">Request Premium Golden Mandap & Accent Lighting</label>
              </div>

              <a href="/about" target="_blank" className="find-out-more-link">
                <HelpCircle size={14} /> Find out more about themes
              </a>
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
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="luxury-form-group">
                <label>Preferred Venue Style *</label>
                <select
                  value={formData.venueType}
                  onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                >
                  <option value="Palace Grounds">Heritage Palace Grounds & Lawns</option>
                  <option value="Luxury Resort">Beachside Luxury Pavilion</option>
                  <option value="Royal Ballroom">Royal Heritage Ballroom</option>
                  <option value="Historic Fort">Fortress Courtyard</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3>Step 3: Heritage Services & Add-ons</h3>
              <p className="step-description">Select additional handpicked options to complete your destination experience.</p>

              <div className="addons-list-luxury">
                <div 
                  className={`addon-luxury-card ${formData.addons.catering ? 'selected' : ''}`}
                  onClick={() => handleAddonToggle('catering')}
                >
                  <div className="addon-check">
                    {formData.addons.catering && <Check size={12} />}
                  </div>
                  <div>
                    <h4>Gourmet Royal Catering</h4>
                    <p>Traditional multi-cuisine luxury buffet led by Michelin chefs.</p>
                  </div>
                </div>

                <div 
                  className={`addon-luxury-card ${formData.addons.photography ? 'selected' : ''}`}
                  onClick={() => handleAddonToggle('photography')}
                >
                  <div className="addon-check">
                    {formData.addons.photography && <Check size={12} />}
                  </div>
                  <div>
                    <h4>Cinematic Videography</h4>
                    <p>Exclusive drone coordination & full documentary production.</p>
                  </div>
                </div>

                <div 
                  className={`addon-luxury-card ${formData.addons.floral ? 'selected' : ''}`}
                  onClick={() => handleAddonToggle('floral')}
                >
                  <div className="addon-check">
                    {formData.addons.floral && <Check size={12} />}
                  </div>
                  <div>
                    <h4>Traditional Rose Decor</h4>
                    <p>Imported Dutch roses, customized arches, and hand-woven garlands.</p>
                  </div>
                </div>

                <div 
                  className={`addon-luxury-card ${formData.addons.music ? 'selected' : ''}`}
                  onClick={() => handleAddonToggle('music')}
                >
                  <div className="addon-check">
                    {formData.addons.music && <Check size={12} />}
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
                  <strong>{formData.packageName}</strong>
                </div>
                <div className="summary-row">
                  <span>Expected Guests:</span>
                  <strong>{formData.guestRange}</strong>
                </div>
                <div className="summary-row">
                  <span>Date:</span>
                  <strong>{formData.eventDate || 'Not selected'}</strong>
                </div>
                <div className="summary-row">
                  <span>Venue:</span>
                  <strong>{formData.venueType}</strong>
                </div>
                <div className="summary-row">
                  <span>Gold Mandap:</span>
                  <strong>{formData.premiumSetup ? 'Yes, Requested' : 'No'}</strong>
                </div>
                <div className="summary-row">
                  <span>Selected Add-ons:</span>
                  <strong>
                    {Object.keys(formData.addons)
                      .filter((key) => formData.addons[key])
                      .map((key) => key.charAt(0).toUpperCase() + key.slice(1))
                      .join(', ') || 'None'}
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
            <button onClick={handleNext} className="btn-luxury-solid">
              Continue
            </button>
          ) : (
            <button 
              onClick={() => {
                alert('Your Royal booking request has been submitted! Our premium designers will contact you.');
                onClose();
              }}
              className="btn-luxury-solid"
            >
              Book Event
            </button>
          )}
        </div>
      </div>

      {/* Decorative Mandala right */}
      <div className="mandala-decor right-decor"></div>
    </div>
  );

  function handleAddonToggle(name) {
    handleAddonChange(name);
  }
};

export default BookingModal;
