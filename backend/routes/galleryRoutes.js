const express = require('express');
const {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getGalleryItems);

// Admin-only routes
router.post('/', protect, adminOnly, createGalleryItem);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

module.exports = router;
