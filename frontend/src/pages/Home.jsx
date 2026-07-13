import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import GalleryItem from '../components/GalleryItem';
import TestimonialCard from '../components/TestimonialCard';
import Loader from '../components/Loader';
import { ArrowRight, Sparkles, Star, CalendarDays, ThumbsUp, ShieldCheck } from 'lucide-react';

const Home = () => {
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, galleryRes, testimonialsRes] = await Promise.all([
          api.get('/services'),
          api.get('/gallery'),
          api.get('/testimonials'),
        ]);
        setServices(servicesRes.data.slice(0, 3));
        setGallery(galleryRes.data.slice(0, 4));
        setTestimonials(testimonialsRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Award-Winning Event Organizers</span>
          </div>
          <h1>Design the Event of Your Dreams</h1>
          <p>
            From stunning weddings and corporate dinners to spectacular birthdays, we handle the details so you can enjoy the moment.
          </p>
          <div className="hero-actions">
            <Link to="/booking" className="btn btn-primary btn-lg">
              Book a Service
            </Link>
            <Link to="/services" className="btn btn-outline-white btn-lg">
              Explore Offerings
            </Link>
          </div>
        </div>
      </header>

      {/* Features/Stats Section */}
      <section className="stats-section container">
        <div className="stat-card">
          <CalendarDays className="stat-icon" />
          <h3>500+</h3>
          <p>Events Managed</p>
        </div>
        <div className="stat-card">
          <ThumbsUp className="stat-icon" />
          <h3>99%</h3>
          <p>Customer Satisfaction</p>
        </div>
        <div className="stat-card">
          <ShieldCheck className="stat-icon" />
          <h3>100%</h3>
          <p>Stress-Free Guarantee</p>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="home-section container">
        <div className="section-header">
          <div>
            <span className="section-subtitle">What We Do</span>
            <h2>Our Featured Services</h2>
          </div>
          <Link to="/services" className="btn btn-link">
            View All Services <ArrowRight size={16} />
          </Link>
        </div>
        {services.length === 0 ? (
          <p className="no-data">No services listed yet.</p>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* Gallery Preview Section */}
      <section className="home-section dark-bg">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Portfolio</span>
              <h2>Moments from Our Events</h2>
            </div>
            <Link to="/gallery" className="btn btn-link">
              View Full Gallery <ArrowRight size={16} />
            </Link>
          </div>
          {gallery.length === 0 ? (
            <p className="no-data">No gallery items uploaded yet.</p>
          ) : (
            <div className="gallery-grid">
              {gallery.map((item) => (
                <GalleryItem key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Preview Section */}
      <section className="home-section container">
        <div className="section-header centered">
          <span className="section-subtitle">Testimonials</span>
          <h2>Loved by Our Clients</h2>
        </div>
        {testimonials.length === 0 ? (
          <p className="no-data">No reviews yet. Be the first to leave one!</p>
        ) : (
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial._id} testimonial={testimonial} />
            ))}
          </div>
        )}
        <div className="testimonial-action-wrapper">
          <Link to="/testimonials" className="btn btn-secondary">
            Write a Review
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section container">
        <div className="cta-content">
          <h2>Ready to Begin Your Next Celebration?</h2>
          <p>Get in touch with our event planners today and let’s start designing together.</p>
          <Link to="/booking" className="btn btn-primary btn-lg">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
