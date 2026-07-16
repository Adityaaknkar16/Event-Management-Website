import React, { useState } from 'react';
import api from '../api/axios';
import Button from '../components/shared/Button';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { name, email, phone, message } = formData;
    if (!name || !email || !phone || !message) {
      setError('Please fill in all fields.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/enquiries', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Failed to submit enquiry', err);
      setError(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="luxury-theme-wrapper" style={{ paddingBottom: '80px' }}>
      <section className="page-header">
        <motion.div 
          className="container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-subtitle">CONCIERGE DESK</span>
          <h1>Contact Us</h1>
          <p>Get in touch with our event planners to design your upcoming celebration.</p>
        </motion.div>
      </section>

      <section className="container">
        <div className="contact-grid">
          {/* Details */}
          <motion.div 
            className="contact-details"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '32px' }}>Let's Begin Planning</h2>
            <p className="contact-desc" style={{ color: 'var(--lux-text-dim)' }}>
              Concierge coordinators are available to answer queries relating to destination scheduling, floor layouts, catering menus, and booking rates.
            </p>

            <div className="contact-info-list">
              <div className="info-item">
                <Phone className="info-icon" style={{ color: 'var(--lux-gold)' }} />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Call Us</h4>
                  <p style={{ color: 'var(--lux-text-dim)' }}>+1 (555) 019-2834</p>
                </div>
              </div>
              <div className="info-item">
                <Mail className="info-icon" style={{ color: 'var(--lux-gold)' }} />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Email Us</h4>
                  <p style={{ color: 'var(--lux-text-dim)' }}>concierge@eventluxe.com</p>
                </div>
              </div>
              <div className="info-item">
                <MapPin className="info-icon" style={{ color: 'var(--lux-gold)' }} />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Our Location</h4>
                  <p style={{ color: 'var(--lux-text-dim)' }}>78 Heritage Palace Road, Jaipur, RJ</p>
                </div>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="map-placeholder" style={{ border: '1px solid var(--lux-gold)', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe
                title="Bespoke Venue Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d14234.62900741271!2d75.806259!3d26.9124336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4066c1b3f9d%3A0xe5a3cff9d713c4!2sJaipur%20Palace!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            className="contact-form-wrapper" 
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '24px' }}>Send a Message</h2>
            {success ? (
              <div className="success-card-inline" style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--lux-gold)', marginBottom: '20px' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', marginBottom: '8px' }}>Enquiry Received</h3>
                <p style={{ color: 'var(--lux-text-dim)', fontSize: '14px', marginBottom: '24px' }}>
                  Your enquiry has been sent to our team. We'll get back to you shortly.
                </p>
                <Button variant="ghost" onClick={() => setSuccess(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {error && <div className="error-banner">{error}</div>}

                <div className="form-group">
                  <label htmlFor="name" style={{ color: 'var(--lux-gold)' }}>Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" style={{ color: 'var(--lux-gold)' }}>Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" style={{ color: 'var(--lux-gold)' }}>Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="e.g. +1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message" style={{ color: 'var(--lux-gold)' }}>Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Provide details about dates, service type, guest numbers, etc..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <Button type="submit" variant="solid" className="btn-block" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'} <Send size={14} style={{ marginLeft: '8px' }} />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
