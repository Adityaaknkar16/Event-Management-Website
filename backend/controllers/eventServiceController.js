const EventService = require('../models/EventService');

// @desc    Get all active event services
// @route   GET /api/services
// @access  Public
const getActiveServices = async (req, res) => {
  try {
    const services = await EventService.find({ isActive: true });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all event services (including inactive ones) - primarily for Admin dashboard usage or general list
// @route   GET /api/services/admin
// @access  Private/Admin
const getAllServices = async (req, res) => {
  try {
    const services = await EventService.find({});
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get service by id
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await EventService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { title, description, category, price, imageUrl, isActive } = req.body;

    if (!title || !description || !category || price === undefined || !imageUrl) {
      return res.status(400).json({ message: 'Please provide all required fields: title, description, category, price, imageUrl' });
    }

    const newService = await EventService.create({
      title,
      description,
      category,
      price,
      imageUrl,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an event service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const { title, description, category, price, imageUrl, isActive } = req.body;

    const service = await EventService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.category = category || service.category;
    service.price = price !== undefined ? price : service.price;
    service.imageUrl = imageUrl || service.imageUrl;
    if (isActive !== undefined) {
      service.isActive = isActive;
    }

    const updatedService = await service.save();
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an event service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await EventService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Service removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActiveServices,
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
