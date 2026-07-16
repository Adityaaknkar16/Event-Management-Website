import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LuxuryServiceCard = ({ service, isActive, onCardClick, onBookClick }) => {
  return (
    <motion.div 
      className={`luxury-service-card ${isActive ? 'active-fanned' : ''}`}
      onClick={onCardClick}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="card-image-container">
        <img src={service.imageUrl} alt={service.title} />
        <div className="card-glow-overlay"></div>
      </div>
      <div className="card-luxury-content">
        <div className="category-row">
          <Sparkles size={12} className="gold-spark" />
          <span>{service.category}</span>
        </div>
        <h3>{service.title}</h3>
        <p className="card-description">{service.subtitle}</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onBookClick();
          }}
          className="btn-luxury-ghost"
        >
          Book Event
        </button>
      </div>
    </motion.div>
  );
};

export default LuxuryServiceCard;
