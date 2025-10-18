// @desc    Get all events with filters, sorting, and pagination (INFINITE SCROLL SUPPORT)
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res, next) => {
  try {
    const { 
      type, 
      location, 
      priceCategory, 
      search, 
      sort = 'date',
      limit = 12,
      offset = 0,
      status = 'published',
      featured,
      category, 
      dateRange,
      venue,
      lat,
      lng,
      radius = 10
    } = req.query;

// @desc    Submit event (public - no auth required)
// @route   POST /api/events/submit
// @access  Public
exports.submitEvent = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Set status to draft for review
    req.body.status = 'draft';
    req.body.featured = false; // Public submissions are not featured by default

const event = await Event.create(req.body);

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to submitter

    res.status(201).json({
      success: true,
      message: 'Event submitted successfully. It will be reviewed by our team.',
      data: event
    });

  } catch (error) {
    console.error('Error in submitEvent:', error);
    res.status(400).json({
      success: false,
      message: 'Error submitting event',
      error: error.message
    });
  }
};


    // Build query
    let query = { status };

    // Category filter (maps to type)
    if (category && category !== 'all') {
      query.type = category.toLowerCase();
    }

    // Type filter
    if (type) {
      query.type = type.toLowerCase();
    }
// Date range filter
    if (dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (dateRange) {
        case 'today':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          query.date = { $gte: today, $lt: tomorrow };
          break;

        case 'this-weekend':
          const dayOfWeek = now.getDay();
          const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
          const friday = new Date(today);
          friday.setDate(friday.getDate() + daysUntilFriday);
          const monday = new Date(friday);
          monday.setDate(monday.getDate() + 3);
          query.date = { $gte: friday, $lt: monday };
          break;

        case 'this-week':
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          query.date = { $gte: today, $lt: weekEnd };
          break;
      }
    }
 // Venue filter
    if (venue) {
      query.venue = venue;
    }
        // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (priceCategory) {
      query.priceCategory = priceCategory;
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);
      
      const latDelta = radiusNum / 111;
      const lngDelta = radiusNum / (111 * Math.cos(latNum * Math.PI / 180));
      
      query.latitude = { $gte: latNum - latDelta, $lte: latNum + latDelta };
      query.longitude = { $gte: lngNum - lngDelta, $lte: lngNum + lngDelta };
    }

    // Build sort option
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { views: -1, attendees: -1 };
        break;
      case 'date':
        sortOption = { date: 1 }; // Upcoming events first
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      default:
        sortOption = { date: 1 };
    }

    // Convert to integers
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);

    // Execute query with pagination
    const events = await Event.find(query)
      .sort(sortOption)
      .limit(limitNum)
      .skip(offsetNum)
      .select('-__v')
      .lean();

    // Get total count
    const total = await Event.countDocuments(query);
    
    // Calculate hasMore
    const hasMore = offsetNum + events.length < total;

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      offset: offsetNum,
      limit: limitNum,
      hasMore,
      data: events
    });

  } catch (error) {
    console.error('Error in getAllEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};