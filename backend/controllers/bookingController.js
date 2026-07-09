const Booking = require('../models/Booking');
const EventService = require('../models/EventService');

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { eventService, eventDate, guestCount, location, notes } = req.body;

    if (!eventService || !eventDate || !guestCount || !location) {
      return res.status(400).json({ message: 'Please provide all required fields: eventService, eventDate, guestCount, location' });
    }

    // Verify service exists and is active
    const serviceExists = await EventService.findOne({ _id: eventService, isActive: true });
    if (!serviceExists) {
      return res.status(404).json({ message: 'Active Event Service not found' });
    }

    const booking = await Booking.create({
      customer: req.user.id, // Using user ID from protected route context (JWT payload)
      eventService,
      eventDate,
      guestCount,
      location,
      notes: notes || '',
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('eventService', 'title price category imageUrl');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin Only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('customer', 'name email')
      .populate('eventService', 'title price category');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Admin Only)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Please provide a booking status' });
    }

    const validStatuses = ['pending', 'confirmed', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status value' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    // Populate references before returning response
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('customer', 'name email')
      .populate('eventService', 'title price category');

    res.status(200).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a booking (Admin Only)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
};
