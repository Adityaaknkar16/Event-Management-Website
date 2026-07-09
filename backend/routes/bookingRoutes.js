const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Customer protected routes
router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);

// Admin-only routes
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id', protect, adminOnly, updateBookingStatus);
router.delete('/:id', protect, adminOnly, deleteBooking);

module.exports = router;
