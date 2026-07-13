import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../components/shared/Button';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/login');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      console.error('Failed reset-password request', err);
      setError(err.response?.data?.message || 'Token is invalid or has expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--lux-gold)' }}>
        <div className="auth-header">
          <Calendar className="auth-logo" size={32} style={{ color: 'var(--lux-gold)' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Configure Password</h2>
          <p style={{ color: 'var(--lux-text-dim)' }}>Set your new secure access credentials below.</p>
        </div>

        {success ? (
          <div className="success-card-inline" style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--lux-gold)', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Reset Successful!</h3>
            <p style={{ color: 'var(--lux-text-dim)', fontSize: '14px', marginTop: '12px' }}>
              Redirecting to login portal in {countdown} seconds...
            </p>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="solid" className="btn-block" style={{ marginTop: '24px' }}>
                Go to Login Now
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-banner" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
                {error.includes('expired') && (
                  <Link to="/forgot-password" style={{ color: 'var(--lux-gold)', textDecoration: 'underline', fontSize: '13px' }}>
                    Request a new link
                  </Link>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password" style={{ color: 'var(--lux-gold)' }}>New Password *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" style={{ left: '16px', color: 'var(--lux-gold)' }} />
                <input
                  type="password"
                  id="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                  required
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" style={{ color: 'var(--lux-gold)' }}>Confirm Password *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" style={{ left: '16px', color: 'var(--lux-gold)' }} />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength="6"
                  required
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <Button type="submit" variant="solid" className="btn-block btn-lg" disabled={submitting}>
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
