const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventService',
      required: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Please add a guest count'],
      min: [1, 'Guest count must be at least 1'],
    },
    location: {
      type: String,
      required: [true, 'Please add an event location'],
      trim: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
