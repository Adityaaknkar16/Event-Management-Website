require('dotenv').config();
const mongoose = require('mongoose');
const EventService = require('./models/EventService');
const Gallery = require('./models/Gallery');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management');
    console.log('MongoDB Connected for seeding.');

    // Clear existing
    await EventService.deleteMany({});
    await Gallery.deleteMany({});

    // Seed Services
    const services = [
      {
        title: 'Royal Palace Wedding',
        description: 'Experience a fairytale wedding in a historic royal palace with grand decorations, floral paths, and majestic lighting.',
        category: 'Weddings',
        price: 15000,
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        isActive: true,
      },
      {
        title: 'Heritage Sangeet Night',
        description: 'A vibrant musical night with traditional folk dancers, custom stage lighting, live audio setup, and royal catering.',
        category: 'Pre-Weddings',
        price: 8000,
        imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
        isActive: true,
      },
      {
        title: 'Imperial Corporate Gala',
        description: 'Host your corporate guests at premium fortresses with modern audiovisual systems, luxury seating, and premium hospitality.',
        category: 'Corporate',
        price: 12000,
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        isActive: true,
      }
    ];

    await EventService.create(services);
    console.log('Services seeded successfully.');

    // Seed Gallery
    const galleryItems = [
      {
        title: 'Palace Courtyard Banquet',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        category: 'Weddings',
      },
      {
        title: 'Royal Mandap Lighting',
        imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
        category: 'Pre-Weddings',
      },
      {
        title: 'Fortress Grand Hall',
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        category: 'Corporate',
      }
    ];

    await Gallery.create(galleryItems);
    console.log('Gallery seeded successfully.');

    await mongoose.connection.close();
    console.log('Database seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seed();
