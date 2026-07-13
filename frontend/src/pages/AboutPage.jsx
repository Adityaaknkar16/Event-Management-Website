import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, ShieldCheck, Heart } from 'lucide-react';
import Button from '../components/shared/Button';

const AboutPage = () => {
  const values = [
    {
      title: "Royal Luxury",
      description: "Providing heritage-inspired setups with attention to royal traditional designs.",
      icon: <Sparkles size={24} style={{ color: 'var(--lux-gold)' }} />
    },
    {
      title: "Master Planning",
      description: "Dedicated coordinators overseeing schedules, florals, audio, and logistics.",
      icon: <Award size={24} style={{ color: 'var(--lux-gold)' }} />
    },
    {
      title: "Stress-Free Promise",
      description: "We handle all details, leaving you free to celebrate your precious moments.",
      icon: <ShieldCheck size={24} style={{ color: 'var(--lux-gold)' }} />
    }
  ];

  const team = [
    {
      name: "Rohan Singhania",
      role: "Founder & Creative Director",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    {
      name: "Priya Sharma",
      role: "Lead Floral Designer",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
    },
    {
      name: "Devendra Mehta",
      role: "Operations Logistics Manager",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
    }
  ];

  return (
    <div className="luxury-theme-wrapper" style={{ paddingBottom: '60px' }}>
      {/* Hero Banner */}
      <section className="page-header">
        <div className="container">
          <span className="section-subtitle">CONCIERGE STORY</span>
          <h1>Our Process & Heritage</h1>
          <p>Crafting majestic destination weddings and traditional celebrations.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-section container" style={{ padding: '60px 0' }}>
        <div className="about-grid" style={{ gap: '60px', alignItems: 'center' }}>
          <div className="about-content">
            <span className="section-subtitle">Heritage Legacy</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '36px', marginBottom: '24px' }}>
              We bring your dream celebrations to life.
            </h2>
            <p style={{ color: 'var(--lux-text-dim)', marginBottom: '16px' }}>
              Established in Jaipur, Event Luxe Paradise specializes in translating traditional Indian celebration elements into breathtaking destination events. We combine structural palace aesthetics, state-of-the-art staging, and tailored multi-cuisine catering.
            </p>
            <p style={{ color: 'var(--lux-text-dim)' }}>
              From initial design mockups to the final mandap installation, our focus remains on providing a seamless, stress-free hospitality layout for hosts and guests.
            </p>
          </div>
          <div className="about-image-wrapper" style={{ height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--lux-gold)' }}>
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800" alt="Indian Palace Event Setup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Mission/Values */}
      <section className="values-section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-header centered">
            <span className="section-subtitle">Philosophy</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Our Core Values</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '40px 30px', borderRadius: '12px' }}>
                <div style={{ marginBottom: '20px' }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '20px', marginBottom: '12px' }}>{v.title}</h3>
                <p style={{ color: 'var(--lux-text-dim)', fontSize: '14px' }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section container" style={{ padding: '80px 0' }}>
        <div className="section-header centered">
          <span className="section-subtitle">Our Team</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>The Master Planners</h2>
        </div>
        <div className="team-grid">
          {team.map((m, i) => (
            <div key={i} className="team-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
              <img src={m.photo} alt={m.name} style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
              <div className="team-card-info" style={{ padding: '24px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)', fontSize: '18px' }}>{m.name}</h3>
                <p style={{ color: 'var(--lux-gold)', fontSize: '13px', textTransform: 'uppercase', marginTop: '4px' }}>{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA linking to Booking */}
      <section className="cta-section container" style={{ background: 'linear-gradient(135deg, #181818 0%, #0a0a0a 100%)', border: '1px solid var(--lux-gold)' }}>
        <div className="cta-content">
          <h2 style={{ fontFamily: 'var(--font-serif)' }}>Ready to Coordinate Your Bespoke Event?</h2>
          <p style={{ color: 'var(--lux-text-dim)' }}>Select from our list of services or build a custom package.</p>
          <Link to="/book" style={{ textDecoration: 'none' }}>
            <Button variant="solid" size="lg" style={{ marginTop: '16px' }}>
              Plan Your Event
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
