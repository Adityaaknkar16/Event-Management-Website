import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange, ArrowLeft } from 'lucide-react';
import Button from '../components/shared/Button';

const NotFoundPage = () => {
  return (
    <div className="luxury-theme-wrapper container" style={{ padding: '120px 0', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <CalendarRange size={64} style={{ color: 'var(--lux-gold)' }} />
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '56px', margin: 0 }}>404</h1>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '24px', margin: 0 }}>Palace Location Not Found</h2>
        <p style={{ color: 'var(--lux-text-dim)', maxWidth: '400px', margin: '0 auto 20px', fontSize: '15px' }}>
          The requested url layout or concierge page does not exist in our heritage database records.
        </p>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="solid" style={{ display: 'inline-flex', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
