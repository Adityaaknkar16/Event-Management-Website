import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign } from 'lucide-react';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="service-card-image">
        <img src={service.imageUrl} alt={service.title} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'; }} />
        <span className="service-card-category">{service.category}</span>
      </div>
      <div className="service-card-content">
        <h3>{service.title}</h3>
        <p className="service-card-desc">{service.description}</p>
        <div className="service-card-footer">
          <div className="service-price">
            <span className="price-label">Starting at</span>
            <span className="price-val">${service.price.toLocaleString()}</span>
          </div>
          <div className="service-actions">
            <Link to={`/services/${service._id}`} className="btn btn-link">
              Details
            </Link>
            <Link to={`/booking?serviceId=${service._id}`} className="btn btn-primary btn-sm">
              Book Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
