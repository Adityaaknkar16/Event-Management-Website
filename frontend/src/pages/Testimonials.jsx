import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import TestimonialCard from '../components/TestimonialCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { Star, MessageSquareCode, CheckCircle2 } from 'lucide-react';

const Testimonials = () => {
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
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="testimonials-page">
      <section className="page-header">
        <div className="container">
          <h1>Client Testimonials</h1>
          <p>Read what our clients say about their stress-free event experiences.</p>
        </div>
      </section>

      <section className="testimonials-content container">
        <div className="testimonials-layout">
          {/* List Section */}
          <div className="testimonials-list-section">
            <h2>Reviews ({testimonials.length})</h2>
            {loading ? (
              <Loader />
            ) : testimonials.length === 0 ? (
              <p className="no-data">No approved reviews yet.</p>
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
            <div className="form-sticky-card">
              <h3>Share Your Experience</h3>
              {success ? (
                <div className="success-card-inline">
                  <CheckCircle2 size={32} className="success-icon" />
                  <h4>Thank you!</h4>
                  <p>Your review has been submitted and is pending admin moderation.</p>
                  <button onClick={() => setSuccess(false)} className="btn btn-outline btn-sm">
                    Submit Another Review
                  </button>
                </div>
              ) : isAuthenticated ? (
                <form onSubmit={handleSubmit}>
                  {error && <div className="error-banner">{error}</div>}
                  
                  <div className="form-group">
                    <label>Rating</label>
                    <div className="star-rating-selector">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          className={`star-select-btn ${val <= rating ? 'active' : ''}`}
                          onClick={() => setRating(val)}
                        >
                          <Star size={24} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Review *</label>
                    <textarea
                      id="message"
                      rows="5"
                      placeholder="Write details about our team, services, decorations, or setup..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                    {submitting ? 'Submitting review...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="login-prompt">
                  <MessageSquareCode size={40} className="prompt-icon" />
                  <p>Only logged-in customers can submit reviews.</p>
                  <a href="/login" className="btn btn-secondary btn-block">
                    Log In to Review
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
