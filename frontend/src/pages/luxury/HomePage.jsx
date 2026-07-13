import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, CalendarCheck, Sparkles, ChevronRight, Menu } from 'lucide-react';
import './HomePage.css';
import LuxuryServiceCard from '../../components/luxury/LuxuryServiceCard';
import BookingModal from '../../components/luxury/BookingModal';

const HomePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCard, setActiveCard] = useState(1); // Default to middle card active

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

  // Auto rotate carousel slide
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

  return (
    <div className="luxury-theme-wrapper">
      {/* Sparkle decors */}
      <Sparkles className="sparkle-icon-decor" size={16} style={{ top: '15%', right: '15%' }} />
      <Sparkles className="sparkle-icon-decor" size={24} style={{ bottom: '25%', left: '8%' }} />
      <Sparkles className="sparkle-icon-decor" size={14} style={{ bottom: '15%', right: '35%' }} />

      {/* TOP UTILITY BAR */}
      <div className="luxury-utility-bar">
        <div className="container utility-container">
          <div className="utility-tagline">
            Luxury | Destination Management
          </div>
          <div className="utility-right">
            <a href="tel:+15550192834" className="phone-link">
              <Phone size={12} /> <span>+1 (555) 019-2834</span>
            </a>
            <Link to="/login" className="login-link">Log In</Link>
            <button onClick={() => setModalOpen(true)} className="btn-util-book">
              Book Event
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <nav className="luxury-navbar">
        <div className="container luxury-nav-container">
          <Link to="/luxury" className="luxury-nav-logo">
            <div className="logo-monogram">E</div>
            <div className="logo-wordmark">
              <h2>EVENT LUXE</h2>
              <span>PARADISE</span>
            </div>
          </Link>

          <div className="luxury-nav-menu">
            <Link to="/" className="luxury-nav-item">Home</Link>
            <Link to="/services" className="luxury-nav-item">Packages</Link>
            <Link to="/about" className="luxury-nav-item">Process</Link>
            <Link to="/gallery" className="luxury-nav-item">Locations</Link>
            <Link to="/testimonials" className="luxury-nav-item">Gallery</Link>
          </div>

          <div className="nav-dropdown-btn">
            <button onClick={() => setModalOpen(true)} className="btn-luxury-ghost">
              Book Event <ChevronRight size={14} style={{ display: 'inline', marginLeft: '4px' }} />
            </button>
          </div>

          <button className="mobile-luxury-menu-toggle">
            <Menu size={24} />
          </button>
        </div>
      </nav>

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
              <div className="hero-slide-content">
                <h1 dangerouslySetInnerHTML={{ __html: slide.title }}></h1>
                <p>{slide.subtitle}</p>
                <div className="hero-slide-actions">
                  <button onClick={() => setModalOpen(true)} className="btn-luxury-solid btn-lg">
                    Plan Your Event
                  </button>
                  <button onClick={() => setModalOpen(true)} className="btn-luxury-ghost btn-lg">
                    Book Event
                  </button>
                </div>
              </div>
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
          <div className="centered-header">
            <span className="section-subtitle">Handpicked Events</span>
            <h2>Our Services</h2>
            <p>
              We coordinate all facets of luxury destination designs, providing bespoke accents customized specifically for your guest list.
            </p>
          </div>

          {/* Fanned service row */}
          <div className="fanned-services-wrapper">
            {services.map((service, idx) => (
              <LuxuryServiceCard
                key={service.id}
                service={service}
                isActive={idx === activeCard}
                onCardClick={() => setActiveCard(idx)}
                onBookClick={() => setModalOpen(true)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING MODAL */}
      <BookingModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
};

export default HomePage;
