const Gallery = require('../models/Gallery');

// @desc    Get all gallery items or filter by category
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = { $regex: new RegExp(category, 'i') }; // Case-insensitive filter
    }

    const items = await Gallery.find(filter);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = async (req, res) => {
  try {
    const { title, imageUrl, category } = req.body;

    if (!title || !imageUrl || !category) {
      return res.status(400).json({ message: 'Please provide all required fields: title, imageUrl, category' });
    }

    const newItem = await Gallery.create({
      title,
      imageUrl,
      category,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Gallery item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
};
