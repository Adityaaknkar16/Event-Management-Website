import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Packages' },
    { path: '/about', label: 'Process' },
    { path: '/gallery', label: 'Locations' },
    { path: '/testimonials', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="luxury-navbar" style={{ position: 'sticky', top: 0, background: 'var(--bg-glass)', backdropFilter: 'var(--glass-blur)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container luxury-nav-container">
        <Link to="/" className="luxury-nav-logo" onClick={() => setIsOpen(false)}>
          <div className="logo-monogram">E</div>
          <div className="logo-wordmark">
            <h2>EVENT LUXE</h2>
            <span>PARADISE</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="luxury-nav-menu">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => (isActive ? 'luxury-nav-item active' : 'luxury-nav-item')}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-dropdown-btn" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="btn-luxury-solid btn-sm">
                  <LayoutDashboard size={14} /> Admin
                </Link>
              )}
              {!isAdmin && (
                <Link to="/my-bookings" className="btn-luxury-ghost btn-sm">
                  My Bookings
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ padding: '8px 16px', borderRadius: '50px' }}>
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="luxury-nav-item" style={{ fontSize: '13px' }}>Log In</Link>
              <Link to="/book" className="btn-luxury-solid btn-sm">
                Book Event <ChevronRight size={12} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="mobile-luxury-menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="mobile-nav-panel" style={{ display: 'flex', top: '80px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '24px' }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => (isActive ? 'mobile-nav-link active' : 'mobile-nav-link')}
              onClick={() => setIsOpen(false)}
              style={{ color: 'var(--lux-text-dim)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 0' }}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mobile-nav-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="btn-luxury-solid" onClick={() => setIsOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                {!isAdmin && (
                  <Link to="/my-bookings" className="btn-luxury-ghost" onClick={() => setIsOpen(false)}>
                    My Bookings
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-luxury-ghost logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-luxury-ghost" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/book" className="btn-luxury-solid" onClick={() => setIsOpen(false)}>
                  Book Event
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
