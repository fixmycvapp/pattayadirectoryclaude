const Event = require('../models/Event');

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const { 
      type, 
      location, 
      priceCategory, 
      search, 
      sort, 
      limit = 50,
      page = 1
    } = req.query;

    // Build query
    let query = { status: 'published' };

    if (type) {
      query.type = type.toLowerCase();
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (priceCategory) {
      query.priceCategory = priceCategory;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    let sortOption = { date: 1 }; // Default: upcoming events first

    if (sort === 'popular') {
      sortOption = { views: -1 };
    } else if (sort === 'date') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    }

    // Execute query
    const events = await Event.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin)
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// @desc    Increment event views
// @route   POST /api/events/:id/view
// @access  Public
exports.incrementEventViews = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: { views: event.views }
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({
      success: false,
      message: 'Error incrementing views',
      error: error.message
    });
  }
};

// @desc    Get featured events
// @route   GET /api/events/featured/list
// @access  Public
exports.getFeaturedEvents = async (req, res) => {
  try {
    const events = await Event.find({ 
      featured: true, 
      status: 'published' 
    })
      .sort({ views: -1 })
      .limit(6);

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching featured events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured events',
      error: error.message
    });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming/list
// @access  Public
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.findUpcoming().limit(10);

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming events',
      error: error.message
    });
  }
};