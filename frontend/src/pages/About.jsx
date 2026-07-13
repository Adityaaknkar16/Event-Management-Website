import React from 'react';
import { Award, Users, ShieldCheck, HelpCircle } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'Aditya Kankar',
      role: 'Founder & Head Planner',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Creative Director',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500',
    },
    {
      name: 'Marcus Brody',
      role: 'Operations Coordinator',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    },
  ];

  return (
    <div className="about-page">
      {/* Banner */}
      <section className="page-header">
        <div className="container">
          <h1>About Vibe Events</h1>
          <p>We craft memories that stay in your hearts forever.</p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="about-section container">
        <div className="about-grid">
          <div className="about-content">
            <span className="section-subtitle">Our Philosophy</span>
            <h2>We believe every detail tells your unique story.</h2>
            <p>
              Vibe Events was founded with a single mission: to create beautiful, memorable events that reflect our client’s personality and aesthetic. We design and deliver seamless events, ensuring our hosts enjoy their parties as much as their guests.
            </p>
            <p>
              Our team consists of design experts, logistic managers, and catering specialists who manage everything from venue layout and florals to lighting, entertainment, and safety.
            </p>
          </div>
          <div className="about-image-wrapper">
            <img src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800" alt="Beautiful Event Setup" />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section dark-bg">
        <div className="container">
          <div className="section-header centered">
            <span className="section-subtitle">Our Values</span>
            <h2>What Drives Us</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <Award className="value-icon" />
              <h3>Excellence</h3>
              <p>We hold ourselves to the highest standards. Good enough is never enough.</p>
            </div>
            <div className="value-card">
              <Users className="value-icon" />
              <h3>Client Centric</h3>
              <p>Your goals, vision, and happiness are at the heart of every decision we make.</p>
            </div>
            <div className="value-card">
              <ShieldCheck className="value-icon" />
              <h3>Reliability</h3>
              <p>We are organized, on time, and handle every crisis with composure and grace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section container">
        <div className="section-header centered">
          <span className="section-subtitle">The Team</span>
          <h2>Meet the Visionaries</h2>
        </div>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.imageUrl} alt={member.name} />
              <div className="team-card-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
