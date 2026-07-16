require('dotenv').config();
const mongoose = require('mongoose');
const EventService = require('./models/EventService');
const Gallery = require('./models/Gallery');

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management');
  const services = await EventService.find({});
  const gallery = await Gallery.find({});
  console.log('Services count:', services.length);
  console.log('Gallery count:', gallery.length);
  console.log('Services:', services);
  console.log('Gallery:', gallery);
  await mongoose.connection.close();
};
check();
