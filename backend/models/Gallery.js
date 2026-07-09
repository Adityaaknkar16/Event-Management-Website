const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a gallery title'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Gallery', gallerySchema);
