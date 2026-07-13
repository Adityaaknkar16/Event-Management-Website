import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!email) {
      setError('Please provide an email address.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      console.error('Forgot password submission failed', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <div className="auth-header">
          <Calendar className="auth-logo" size={32} />
          <h2>Forgot Password?</h2>
          <p>Provide your email address below, and we will send you a password reset link.</p>
        </div>

        {success ? (
          <div className="success-card-inline">
            <CheckCircle2 size={48} className="success-icon" />
            <h3>Request Processed</h3>
            <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
              If an account exists with this email, a reset link has been sent. Please check your inbox (and spam folder) for instructions.
            </p>
            <Link to="/login" className="btn btn-primary btn-block" style={{ marginTop: '24px' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-banner">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
              {submitting ? 'Submitting request...' : 'Send Reset Link'}
            </button>

            <div className="auth-footer" style={{ marginTop: '24px' }}>
              <Link to="/login" className="back-link" style={{ justifyContent: 'center', margin: 0 }}>
                <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
