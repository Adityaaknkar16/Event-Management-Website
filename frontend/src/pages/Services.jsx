import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import Loader from '../components/Loader';
import { Filter } from 'lucide-react';

const Services = () => {
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
        
        // Extract unique categories
        const cats = ['All', ...new Set(response.data.map(s => s.category))];
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(s => s.category === category));
    }
  };

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className="services-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>We provide full-spectrum event management services custom-tailored to your desires.</p>
        </div>
      </section>

      <section className="services-content container">
        {/* Category Filters */}
        <div className="filters-wrapper">
          <div className="filter-title">
            <Filter size={16} />
            <span>Filter Categories:</span>
          </div>
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <div className="empty-state">
            <p>No services found in this category.</p>
          </div>
        ) : (
          <div className="services-grid">
            {filteredServices.map(service => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Services;
