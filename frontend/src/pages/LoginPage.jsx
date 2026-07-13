import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, LogIn, Mail, Lock } from 'lucide-react';
import Button from '../components/shared/Button';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setSubmitting(false);
      return;
    }

    try {
      const data = await login(email, password);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      console.error('Login failed', err);
      setError(err.response?.data?.message || 'Invalid email or password.');
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
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--lux-text-dim)' }}>Log in to access packages and track event status.</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="form-group">
            <label htmlFor="password" style={{ color: 'var(--lux-gold)' }}>Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" style={{ left: '16px', color: 'var(--lux-gold)' }} />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          <Button type="submit" variant="solid" className="btn-block btn-lg" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log In'} <LogIn size={16} style={{ marginLeft: '8px' }} />
          </Button>
        </form>

        <div className="auth-footer" style={{ marginTop: '24px', textAlign: 'center' }}>
          <p>
            <Link to="/forgot-password" style={{ color: 'var(--lux-gold)', textDecoration: 'underline' }}>Forgot password?</Link>
          </p>
          <p style={{ marginTop: '8px', color: 'var(--lux-text-dim)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--lux-gold)', textDecoration: 'underline' }}>Sign Up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
