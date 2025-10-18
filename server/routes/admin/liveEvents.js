const express = require('express');
const router = express.Router();
const { manualSync } = require('../../cron/syncLiveEvents');
const Event = require('../../models/Event');
const { protect, authorize } = require('../../middleware/auth');

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// @desc    Manually trigger live events sync
// @route   POST /api/admin/live-events/sync
// @access  Private/Admin
router.post('/sync', async (req, res) => {
  try {
    const { source = 'all' } = req.body;

    console.log(`📡 Manual live events sync triggered by ${req.user.name}`);
    
    const results = await manualSync(source);

    res.status(200).json({
      success: true,
      message: 'Live events sync completed',
      data: results,
    });
  } catch (error) {
    console.error('Error in manual sync:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing live events',
      error: error.message,
    });
  }
});

// @desc    Get live events sync statistics
// @route   GET /api/admin/live-events/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const [
      totalEvents,
      eventbriteEvents,
      facebookEvents,
      manualEvents,
      recentSyncs,
      byType,
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ externalSource: 'eventbrite' }),
      Event.countDocuments({ externalSource: 'facebook' }),
      Event.countDocuments({ externalSource: 'manual' }),
      Event.countDocuments({
        lastSyncedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      Event.aggregate([
        { $match: { externalSource: { $in: ['eventbrite', 'facebook'] } } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        bySource: {
          eventbrite: eventbriteEvents,
          facebook: facebookEvents,
          manual: manualEvents,
        },
        recentSyncs,
        byType,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
});

// @desc    Get synced events from specific source
// @route   GET /api/admin/live-events/source/:source
// @access  Private/Admin
router.get('/source/:source', async (req, res) => {
  try {
    const { source } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [events, total] = await Promise.all([
      Event.find({ externalSource: source })
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      Event.countDocuments({ externalSource: source }),
    ]);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: events,
    });
  } catch (error) {
    console.error('Error fetching source events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
});

// @desc    Delete synced event by external ID
// @route   DELETE /api/admin/live-events/:externalId
// @access  Private/Admin
router.delete('/:externalId', async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      externalId: req.params.externalId,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
});

module.exports = router;