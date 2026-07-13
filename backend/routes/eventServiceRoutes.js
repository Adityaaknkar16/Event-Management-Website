const express = require('express');
const {
  getActiveServices,
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/eventServiceController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Admin-only routes (placed before parameter routes to avoid collision)
router.get('/admin', protect, adminOnly, getAllServices);
router.get('/admin/all', protect, adminOnly, getAllServices); // support fallback

// Public routes
router.get('/', getActiveServices);
router.get('/:id', getServiceById);

// Other Admin-only routes
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
