import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section branding">
          <Link to="/" className="footer-logo">
            <Calendar className="logo-icon" />
            <span>Vibe<span>Events</span></span>
          </Link>
          <p className="footer-desc">
            Crafting memories that last a lifetime. Premium events, customized planning, and unmatched execution.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={18} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><Twitter size={18} /></a>
          </div>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/services">Our Services</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/testimonials">Reviews</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section contacts">
          <h4>Contact Info</h4>
          <ul>
            <li>
              <Phone size={16} />
              <span>+1 (555) 019-2834</span>
            </li>
            <li>
              <Mail size={16} />
              <span>info@vibeevents.com</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>123 Celebration Boulevard, Suite 500, NY</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vibe Events. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
