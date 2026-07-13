import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Calendar, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/testimonials', label: 'Reviews' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <Calendar className="logo-icon" />
          <span>Vibe<span>Events</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              {isAdmin && (
                <Link to="/admin" className="btn btn-secondary dashboard-btn">
                  <LayoutDashboard size={16} />
                  <span>Admin Panel</span>
                </Link>
              )}
              {!isAdmin && (
                <Link to="/mybookings" className="btn btn-secondary">
                  My Bookings
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-danger logout-btn">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="mobile-nav-panel">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => (isActive ? 'mobile-nav-link active' : 'mobile-nav-link')}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mobile-nav-actions">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="mobile-nav-action-btn admin-btn" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard size={18} /> Admin Dashboard
                  </Link>
                )}
                {!isAdmin && (
                  <Link to="/mybookings" className="mobile-nav-action-btn" onClick={() => setIsOpen(false)}>
                    My Bookings
                  </Link>
                )}
                <button onClick={handleLogout} className="mobile-nav-action-btn logout-btn">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-action-btn login-btn" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="mobile-nav-action-btn register-btn" onClick={() => setIsOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
