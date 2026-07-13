import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../components/shared/Button';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      console.error('Failed forgot-password submission', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--lux-gold)' }}>
        <div className="auth-header">
          <Calendar className="auth-logo" size={32} style={{ color: 'var(--lux-gold)' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Forgot Password?</h2>
          <p style={{ color: 'var(--lux-text-dim)' }}>Provide your registered email to request a reset link.</p>
        </div>

        {success ? (
          <div className="success-card-inline" style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--lux-gold)', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Link Dispatched</h3>
            <p style={{ color: 'var(--lux-text-dim)', fontSize: '14px', marginTop: '12px' }}>
              If an account exists with this email, a reset link has been sent. Please inspect your inbox and junk filters.
            </p>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="solid" className="btn-block" style={{ marginTop: '24px' }}>
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-banner">{error}</div>}

            <div className="form-group">
              <label htmlFor="email" style={{ color: 'var(--lux-gold)' }}>Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" style={{ left: '16px', color: 'var(--lux-gold)' }} />
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <Button type="submit" variant="solid" className="btn-block btn-lg" disabled={submitting}>
              {submitting ? 'Submitting request...' : 'Send Reset Link'}
            </Button>

            <div className="auth-footer" style={{ marginTop: '24px', textAlign: 'center' }}>
              <Link to="/login" className="back-link" style={{ justifyContent: 'center', margin: 0, color: 'var(--lux-gold)' }}>
                <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
