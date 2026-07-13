import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, UserCheck, Mail, Lock, User, Phone } from 'lucide-react';
import Button from '../components/shared/Button';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { name, email, password, confirmPassword, phone } = formData;

    if (!name || !email || !password || !confirmPassword || !phone) {
      setError('Please fill in all fields.');
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }

    try {
      await register(name, email, password, phone);
      navigate('/');
    } catch (err) {
      console.error('Registration failed', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page container">
      {/* Decorative mandalas */}
      <div className="mandala-decor left-decor" style={{ top: '20%', opacity: 0.15 }}></div>
      <div className="mandala-decor right-decor" style={{ bottom: '20%', opacity: 0.15 }}></div>

      <div className="auth-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--lux-gold)' }}>
        <div className="auth-header">
          <Calendar className="auth-logo" size={32} style={{ color: 'var(--lux-gold)' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Create Account</h2>
          <p style={{ color: 'var(--lux-text-dim)' }}>Sign up to book services and track event coordinates.</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" style={{ color: 'var(--lux-gold)' }}>Full Name</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" style={{ left: '16px', color: 'var(--lux-gold)' }} />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" style={{ color: 'var(--lux-gold)' }}>Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" style={{ left: '16px', color: 'var(--lux-gold)' }} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone" style={{ color: 'var(--lux-gold)' }}>Phone Number</label>
            <div className="input-with-icon">
              <Phone size={16} className="input-icon" style={{ left: '16px', color: 'var(--lux-gold)' }} />
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="e.g. +1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" style={{ color: 'var(--lux-gold)' }}>Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" style={{ left: '16px', color: 'var(--lux-gold)' }} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" style={{ color: 'var(--lux-gold)' }}>Confirm</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" style={{ left: '16px', color: 'var(--lux-gold)' }} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Repeat pass"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="6"
                  required
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="solid" className="btn-block btn-lg" disabled={submitting}>
            {submitting ? 'Registering...' : 'Register'} <UserCheck size={16} style={{ marginLeft: '8px' }} />
          </Button>
        </form>

        <div className="auth-footer" style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--lux-text-dim)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--lux-gold)', textDecoration: 'underline' }}>Log In here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
