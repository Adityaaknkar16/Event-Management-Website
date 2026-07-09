const express = require('express');
const {
  getApprovedTestimonials,
  getAllTestimonials,
  submitTestimonial,
  updateApprovalStatus,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getApprovedTestimonials);

// Customer route
router.post('/', protect, submitTestimonial);

// Admin-only routes
router.get('/admin', protect, adminOnly, getAllTestimonials);
router.put('/:id', protect, adminOnly, updateApprovalStatus);
router.delete('/:id', protect, adminOnly, deleteTestimonial);

module.exports = router;
