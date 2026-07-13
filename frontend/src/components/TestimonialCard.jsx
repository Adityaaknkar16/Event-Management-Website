import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={16}
      className={index < testimonial.rating ? 'star-filled' : 'star-empty'}
    />
  ));

  return (
    <div className="testimonial-card">
      <div className="rating-stars">{stars}</div>
      <p className="testimonial-message">"{testimonial.message}"</p>
      <div className="testimonial-author">
        <div className="avatar">
          {testimonial.customerName.charAt(0).toUpperCase()}
        </div>
        <div className="author-info">
          <h5>{testimonial.customerName}</h5>
          <span>Verified Customer</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
