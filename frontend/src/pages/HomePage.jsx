import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, CalendarCheck, Sparkles, ChevronRight, Menu } from 'lucide-react';
import './luxury/HomePage.css';
import LuxuryServiceCard from '../components/luxury/LuxuryServiceCard';
import BookingModal from '../components/luxury/BookingModal';
import api from '../api/axios';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCard, setActiveCard] = useState(1);
  const [testimonials, setTestimonials] = useState([]);

  // Carousel Data
  const slides = [
    {
      title: "Elevating Indian <span>Celebrations</span>",
      subtitle: "Unforgettable settings for weddings, sangeets, and grand festivals.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600"
    },
    {
      title: "Majestic Heritage <span>Weddings</span>",
      subtitle: "Experience destination management inspired by palace architecture.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600"
    },
    {
      title: "Spectacular <span>Banquets</span>",
      subtitle: "Breathtaking configurations curated with custom lighting & floral accents.",
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1600"
    }
  ];

  // Service Data
  const services = [
    {
      id: 0,
      title: "Royal Marriages",
      subtitle: "Exquisite destination setups in heritage palaces and fortresses.",
      category: "Weddings",
      imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800"
    },
    {
      id: 1,
      title: "Grand Sangeet",
      subtitle: "Theatrical staging, cinematic audio, and live classical orchestras.",
      category: "Celebrations",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
    },
    {
      id: 2,
      title: "Diwali & Holi Galas",
      subtitle: "Vibrant traditional theme decoration, custom catering, and sound.",
      category: "Festivals",
      imageUrl: "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800"
    }
  ];

  useEffect(() => {
    const fetchApprovedTestimonials = async () => {
      try {
        const response = await api.get('/testimonials');
        setTestimonials(response.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load testimonials', err);
      }
    };
    fetchApprovedTestimonials();
  }, []);

  // Auto rotate carousel slide
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

  return (
    <div className="luxury-theme-wrapper" style={{ minHeight: 'auto' }}>
      {/* Sparkle decors */}
      <Sparkles className="sparkle-icon-decor" size={16} style={{ top: '15%', right: '15%' }} />
      <Sparkles className="sparkle-icon-decor" size={24} style={{ bottom: '25%', left: '8%' }} />
      <Sparkles className="sparkle-icon-decor" size={14} style={{ bottom: '15%', right: '35%' }} />

      {/* HERO SECTION WITH CAROUSEL */}
      <header className="luxury-hero">
        {slides.map((slide, idx) => (
          <div 
            key={idx}
            className={`hero-slide ${idx === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-slide-overlay"></div>
            <div className="container">
              <motion.div 
                className="hero-slide-content"
                initial={{ opacity: 0, y: 30 }}
                animate={idx === activeSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 dangerouslySetInnerHTML={{ __html: slide.title }}></h1>
                <p>{slide.subtitle}</p>
                <div className="hero-slide-actions">
                  <Link to="/book" className="btn-luxury-solid btn-lg" style={{ display: 'inline-flex' }}>
                    Plan Your Event
                  </Link>
                  <Link to="/book" className="btn-luxury-ghost btn-lg" style={{ display: 'inline-flex' }}>
                    Book Event
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        ))}

        {/* Carousel indicators */}
        <div className="carousel-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
            ></button>
          ))}
        </div>

        {/* Decorative gold sparkle icon */}
        <Sparkles className="sparkle-icon-decor" size={20} style={{ bottom: '40px', right: '40px' }} />
      </header>

      {/* SERVICES SECTION */}
      <section className="luxury-services-section">
        <div className="container">
          <motion.div 
            className="centered-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="section-subtitle">Handpicked Events</span>
            <h2>Our Services</h2>
            <p>
              We coordinate all facets of luxury destination designs, providing bespoke accents customized specifically for your guest list.
            </p>
          </motion.div>
 
          {/* Fanned service row */}
          <motion.div 
            className="fanned-services-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {services.map((service, idx) => (
              <LuxuryServiceCard
                key={service.id}
                service={service}
                isActive={idx === activeCard}
                onCardClick={() => setActiveCard(idx)}
                onBookClick={() => setModalOpen(true)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIAL PREVIEW */}
      <section className="home-section container" style={{ padding: '80px 0' }}>
        <motion.div 
          className="section-header centered"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Testimonials</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Loved by Our Clients</h2>
        </motion.div>
        {testimonials.length === 0 ? (
          <p className="no-data">No approved reviews yet.</p>
        ) : (
          <motion.div 
            className="testimonials-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            {testimonials.map((t) => (
              <motion.div 
                key={t._id} 
                className="testimonial-card" 
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '12px' }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
              >
                <p style={{ fontStyle: 'italic', color: 'var(--lux-text-dim)' }}>"{t.message}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--lux-gold)', color: '#000', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold' }}>
                    {t.customerName.charAt(0)}
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '14px' }}>{t.customerName}</h5>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verified Customer</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* CTA BANNER */}
      <motion.section 
        className="cta-section container" 
        style={{ background: 'linear-gradient(135deg, #181818 0%, #0a0a0a 100%)', border: '1px solid var(--lux-gold)' }}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="cta-content">
          <h2 style={{ fontFamily: 'var(--font-serif)' }}>Plan Your Royal Destination Experience</h2>
          <p style={{ color: 'var(--lux-text-dim)' }}>Schedule a personal consultation with our master planners today.</p>
          <Link to="/book" className="btn-luxury-solid btn-lg" style={{ marginTop: '12px', display: 'inline-flex' }}>
            Book Event Now
          </Link>
        </div>
      </motion.section>

      {/* BOOKING MODAL */}
      <BookingModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
};

export default HomePage;
