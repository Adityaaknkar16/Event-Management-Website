import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import Button from '../components/shared/Button';
import { Sparkles, Filter } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
        setFilteredServices(response.data);
        
        // Get unique categories
        const cats = ['All', ...new Set(response.data.map(s => s.category))];
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load services', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleFilter = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(s => s.category === cat));
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="luxury-theme-wrapper" style={{ paddingBottom: '60px' }}>
      <section className="page-header">
        <div className="container">
          <span className="section-subtitle">OUR COLLECTION</span>
          <h1>Luxury Packages</h1>
          <p>Handpicked traditional setups coordinated down to the smallest detail.</p>
        </div>
      </section>

      <section className="container">
        {/* Filter bar */}
        <div className="filters-wrapper" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="filter-title">
            <Filter size={16} style={{ color: 'var(--lux-gold)' }} />
            <span style={{ color: 'var(--lux-text-dim)' }}>Select Theme:</span>
          </div>
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <EmptyState message="No packages found under this category." />
        ) : (
          <div className="services-grid">
            {filteredServices.map(service => (
              <div key={service._id} className="service-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'; }}
                  />
                  <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.75)', border: '1px solid var(--lux-gold)', color: 'var(--lux-gold)', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '50px', textTransform: 'uppercase' }}>
                    {service.category}
                  </span>
                </div>
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '22px', margin: 0 }}>{service.title}</h3>
                  <p style={{ color: 'var(--lux-text-dim)', fontSize: '14px', height: '60px', overflow: 'hidden', lineBreak: 'anywhere' }}>{service.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Starts at</span>
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--lux-gold)' }}>${service.price.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/services/${service._id}`}>
                        <Button variant="ghost" size="sm">Details</Button>
                      </Link>
                      <Link to={`/book?serviceId=${service._id}`}>
                        <Button variant="solid" size="sm">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ServicesPage;
