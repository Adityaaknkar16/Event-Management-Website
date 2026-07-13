import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer" style={{ background: '#080808', borderTop: '1px solid rgba(201, 169, 97, 0.15)', marginTop: '80px', padding: '60px 0 24px' }}>
      <div className="footer-container">
        <div className="footer-section branding">
          <Link to="/" className="luxury-nav-logo" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-monogram">E</div>
            <div className="logo-wordmark">
              <h2>EVENT LUXE</h2>
              <span>PARADISE</span>
            </div>
          </Link>
          <p className="footer-desc" style={{ color: 'var(--lux-text-dim)' }}>
            Curating bespoke destination settings, royal mandaps, sangeet orchestrations, and majestic banquets.
          </p>
          <div className="social-icons" style={{ marginTop: '20px' }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ border: '1px solid rgba(201, 169, 97, 0.2)', color: 'var(--lux-gold)' }}><Facebook size={18} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ border: '1px solid rgba(201, 169, 97, 0.2)', color: 'var(--lux-gold)' }}><Instagram size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ border: '1px solid rgba(201, 169, 97, 0.2)', color: 'var(--lux-gold)' }}><Twitter size={18} /></a>
          </div>
        </div>

        <div className="footer-section links">
          <h4 style={{ color: 'var(--lux-gold)', fontFamily: 'var(--font-serif)', letterSpacing: '1px' }}>Quick Links</h4>
          <ul>
            <li><Link to="/services" style={{ color: 'var(--lux-text-dim)' }}>Our Packages</Link></li>
            <li><Link to="/gallery" style={{ color: 'var(--lux-text-dim)' }}>Locations</Link></li>
            <li><Link to="/testimonials" style={{ color: 'var(--lux-text-dim)' }}>Gallery</Link></li>
            <li><Link to="/about" style={{ color: 'var(--lux-text-dim)' }}>Our Process</Link></li>
            <li><Link to="/contact" style={{ color: 'var(--lux-text-dim)' }}>Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section contacts">
          <h4 style={{ color: 'var(--lux-gold)', fontFamily: 'var(--font-serif)', letterSpacing: '1px' }}>Contact Info</h4>
          <ul>
            <li style={{ color: 'var(--lux-text-dim)' }}>
              <Phone size={16} style={{ color: 'var(--lux-gold)' }} />
              <span>+1 (555) 019-2834</span>
            </li>
            <li style={{ color: 'var(--lux-text-dim)' }}>
              <Mail size={16} style={{ color: 'var(--lux-gold)' }} />
              <span>concierge@eventluxe.com</span>
            </li>
            <li style={{ color: 'var(--lux-text-dim)' }}>
              <MapPin size={16} style={{ color: 'var(--lux-gold)' }} />
              <span>78 Heritage Palace Road, Jaipur, RJ</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p style={{ color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} Event Luxe Paradise. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
