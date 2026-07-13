import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/shared/Button';
import { ArrowLeft, CheckCircle2, DollarSign, CalendarCheck, Sparkles } from 'lucide-react';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${id}`);
        setService(response.data);
      } catch (err) {
        console.error('Failed to load service', err);
        setError('Service package details could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <LoadingSpinner fullPage />;

  if (error) {
    return (
      <div className="luxury-theme-wrapper container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="error-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '40px', borderRadius: '16px', display: 'inline-block', maxWidth: '500px' }}>
          <p style={{ color: 'var(--danger)', marginBottom: '24px' }}>{error}</p>
          <Link to="/services">
            <Button variant="solid">Back to Packages</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-theme-wrapper" style={{ paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>
        <Link to="/services" className="back-link" style={{ color: 'var(--lux-text-dim)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <ArrowLeft size={16} /> Back to Packages
        </Link>

        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px' }}>
          {/* Left: Image */}
          <div style={{ height: '480px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--lux-gold)' }}>
            <img 
              src={service.imageUrl} 
              alt={service.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'; }}
            />
          </div>

          {/* Right: details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--lux-gold)' }}>
              <Sparkles size={14} />
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{service.category}</span>
            </div>
            
            <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '40px', margin: 0 }}>{service.title}</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Exclusive Package Price</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--lux-gold)' }}>${service.price.toLocaleString()}</span>
            </div>

            <div className="divider"></div>

            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Overview & Details</h3>
            <p style={{ color: 'var(--lux-text-dim)', fontSize: '15px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {service.description}
            </p>

            <div className="whats-included" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '12px', marginTop: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '16px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Concierge inclusions</h3>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--lux-text-dim)', fontSize: '14px', marginBottom: '10px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--lux-gold)' }} />
                  <span>Full palace vendor management & scheduling</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--lux-text-dim)', fontSize: '14px', marginBottom: '10px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--lux-gold)' }} />
                  <span>3D floor layout designs & theme consultations</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--lux-text-dim)', fontSize: '14px', marginBottom: '10px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--lux-gold)' }} />
                  <span>Bespoke catering menus with chef tasting sessions</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--lux-text-dim)', fontSize: '14px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--lux-gold)' }} />
                  <span>On-site execution coordinator & supervisor team</span>
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Link to={`/book?serviceId=${service._id}`} style={{ textDecoration: 'none' }}>
                <Button variant="solid" size="lg" style={{ display: 'inline-flex', gap: '8px' }}>
                  <CalendarCheck size={18} /> Book This Package
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
