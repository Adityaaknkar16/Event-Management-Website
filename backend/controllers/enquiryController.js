const Enquiry = require('../models/Enquiry');

// @desc    Submit contact/enquiry form
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Please provide all required fields: name, email, phone, message' });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
      isResolved: false, // Default state
    });

    res.status(201).json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all enquiries (Admin Only)
// @route   GET /api/enquiries
// @access  Private/Admin
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }); // Newest first
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark enquiry as resolved or unresolved (Admin Only)
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
const updateEnquiryStatus = async (req, res) => {
  try {
    const { isResolved } = req.body;

    if (isResolved === undefined) {
      return res.status(400).json({ message: 'Please provide isResolved status' });
    }

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    enquiry.isResolved = isResolved;
    const updatedEnquiry = await enquiry.save();

    res.status(200).json(updatedEnquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an enquiry (Admin Only)
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    await enquiry.deleteOne();
    res.status(200).json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};
