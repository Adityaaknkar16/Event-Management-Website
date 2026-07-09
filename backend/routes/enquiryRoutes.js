const express = require('express');
const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', createEnquiry);

// Admin-only routes
router.get('/', protect, adminOnly, getAllEnquiries);
router.put('/:id', protect, adminOnly, updateEnquiryStatus);
router.delete('/:id', protect, adminOnly, deleteEnquiry);

module.exports = router;
