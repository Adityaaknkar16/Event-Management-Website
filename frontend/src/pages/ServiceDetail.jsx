import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import { ArrowLeft, CheckCircle2, DollarSign, CalendarCheck } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${id}`);
        setService(response.data);
      } catch (err) {
        console.error('Error fetching service', err);
        setError('Service not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <Loader fullPage />;
  if (error) {
    return (
      <div className="container message-container">
        <div className="error-card">
          <p>{error}</p>
          <Link to="/services" className="btn btn-primary"><ArrowLeft size={16} /> Back to Services</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-page container">
      <Link to="/services" className="back-link">
        <ArrowLeft size={16} /> Back to Services
      </Link>
      
      <div className="detail-grid">
        <div className="detail-image">
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'; }}
          />
        </div>
        <div className="detail-info">
          <span className="category-tag">{service.category}</span>
          <h1>{service.title}</h1>
          <p className="detail-price">Starting from <span>${service.price.toLocaleString()}</span></p>
          <div className="divider"></div>
          
          <h3>Service Description</h3>
          <p className="description-text">{service.description}</p>
          
          <div className="whats-included">
            <h3>What is Included</h3>
            <ul>
              <li><CheckCircle2 size={16} className="check-icon" /> Full Planning & Logistics Coordination</li>
              <li><CheckCircle2 size={16} className="check-icon" /> On-site Event Supervisor</li>
              <li><CheckCircle2 size={16} className="check-icon" /> Vendor Management & Scheduling</li>
              <li><CheckCircle2 size={16} className="check-icon" /> Design consultation & Setup</li>
            </ul>
          </div>
          
          <div className="booking-nudge">
            <Link to={`/booking?serviceId=${service._id}`} className="btn btn-primary btn-lg">
              <CalendarCheck size={18} /> Book This Service Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
