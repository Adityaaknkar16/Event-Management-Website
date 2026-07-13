import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import TestimonialCard from '../components/TestimonialCard';
import Button from '../components/shared/Button';
import { useAuth } from '../context/AuthContext';
import { Star, MessageSquareCode, CheckCircle2 } from 'lucide-react';

const TestimonialsPage = () => {
  const { isAuthenticated } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/testimonials');
      setTestimonials(response.data);
    } catch (err) {
      console.error('Failed to load testimonials', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!message) {
      setError('Please write a review message.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/testimonials', { message, rating });
      setSuccess(true);
      setMessage('');
      setRating(5);
    } catch (err) {
      console.error('Testimonial submission failed', err);
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="luxury-theme-wrapper" style={{ paddingBottom: '80px' }}>
      <section className="page-header">
        <div className="container">
          <span className="section-subtitle">GUEST JOURNAL</span>
          <h1>Reviews & Testimonials</h1>
          <p>Read what hosts and families share about their destination experiences.</p>
        </div>
      </section>

      <section className="container">
        <div className="testimonials-layout">
          {/* List Section */}
          <div className="testimonials-list-section">
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '24px', marginBottom: '24px' }}>Client Reviews ({testimonials.length})</h2>
            {loading ? (
              <LoadingSpinner />
            ) : testimonials.length === 0 ? (
              <EmptyState message="No approved reviews published yet." />
            ) : (
              <div className="testimonials-grid-vertical">
                {testimonials.map((t) => (
                  <TestimonialCard key={t._id} testimonial={t} />
                ))}
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="testimonial-form-section">
            <div className="form-sticky-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Write a Review</h3>
              
              {success ? (
                <div className="success-card-inline" style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CheckCircle2 size={40} style={{ color: 'var(--lux-gold)', marginBottom: '16px' }} />
                  <h4 style={{ color: 'var(--lux-text-light)', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Review Submitted</h4>
                  <p style={{ color: 'var(--lux-text-dim)', fontSize: '13px', marginBottom: '20px' }}>
                    Thanks! Your review is awaiting admin approval before it appears publicly.
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setSuccess(false)}>
                    Submit Another Review
                  </Button>
                </div>
              ) : isAuthenticated ? (
                <form onSubmit={handleSubmit}>
                  {error && <div className="error-banner">{error}</div>}
                  
                  <div className="form-group">
                    <label style={{ color: 'var(--lux-gold)' }}>Rating</label>
                    <div className="star-rating-selector">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          className={`star-select-btn ${val <= rating ? 'active' : ''}`}
                          onClick={() => setRating(val)}
                        >
                          <Star size={20} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" style={{ color: 'var(--lux-gold)' }}>Your Experience *</label>
                    <textarea
                      id="message"
                      rows="4"
                      placeholder="Share details about the decorations, food, lighting, and coordinators..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <Button type="submit" variant="solid" className="btn-block" disabled={submitting}>
                    {submitting ? 'Submitting review...' : 'Submit Review'}
                  </Button>
                </form>
              ) : (
                <div className="login-prompt">
                  <MessageSquareCode size={40} className="prompt-icon" style={{ color: 'var(--lux-gold)' }} />
                  <p style={{ color: 'var(--lux-text-dim)' }}>Only logged-in customers can submit reviews.</p>
                  <Link to="/login" style={{ width: '100%' }}>
                    <Button variant="ghost" className="btn-block">
                      Log In to Review
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;
