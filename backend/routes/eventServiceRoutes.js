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

// Public routes
router.get('/', getActiveServices);
router.get('/:id', getServiceById);

// Admin-only routes
router.get('/admin/all', protect, adminOnly, getAllServices);
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
