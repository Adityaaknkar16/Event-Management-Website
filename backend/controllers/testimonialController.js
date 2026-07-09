const Testimonial = require('../models/Testimonial');

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all testimonials (Admin Only)
// @route   GET /api/testimonials/admin
// @access  Private/Admin
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({});
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a new testimonial
// @route   POST /api/testimonials
// @access  Private
const submitTestimonial = async (req, res) => {
  try {
    const { message, rating } = req.body;

    if (!message || rating === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields: message, rating' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Default customerName to the logged in user's name from req.user
    const customerName = req.user && req.user.name ? req.user.name : 'Valued Customer';

    const testimonial = await Testimonial.create({
      customerName,
      message,
      rating,
      isApproved: false, // Always defaults to false for approval process
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Approve or reject a testimonial (Admin Only)
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateApprovalStatus = async (req, res) => {
  try {
    const { isApproved } = req.body;

    if (isApproved === undefined) {
      return res.status(400).json({ message: 'Please provide isApproved state' });
    }

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    testimonial.isApproved = isApproved;
    const updatedTestimonial = await testimonial.save();

    res.status(200).json(updatedTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a testimonial (Admin Only)
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await testimonial.deleteOne();
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApprovedTestimonials,
  getAllTestimonials,
  submitTestimonial,
  updateApprovalStatus,
  deleteTestimonial,
};
