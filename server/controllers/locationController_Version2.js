const Location = require('../models/Location');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
exports.getAllLocations = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const locations = await Location.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: error.message
    });
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Public
exports.getLocationById = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching location',
      error: error.message
    });
  }
};

// @desc    Create location
// @route   POST /api/locations
// @access  Private (Admin)
exports.createLocation = async (req, res, next) => {
  try {
    const location = await Location.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: location
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating location',
      error: error.message
    });
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private (Admin)
exports.updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: location
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating location',
      error: error.message
    });
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private (Admin)
exports.deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting location',
      error: error.message
    });
  }
};