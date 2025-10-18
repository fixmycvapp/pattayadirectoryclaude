const express = require('express');
const router = express.Router();
const NewsArticle = require('../../models/NewsArticle');
const { manualFetch } = require('../../cron/fetchNews');
const { protect, authorize } = require('../../middleware/auth');

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// @desc    Manually trigger news fetch
// @route   POST /api/admin/news/fetch
// @access  Private/Admin
router.post('/fetch', async (req, res) => {
  try {
    console.log(`📡 Manual news fetch triggered by ${req.user.name}`);
    
    const result = await manualFetch();

    res.status(200).json({
      success: true,
      message: 'News fetch completed',
      data: result,
    });
  } catch (error) {
    console.error('Error in manual fetch:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message,
    });
  }
});

// @desc    Get news fetch statistics
// @route   GET /api/admin/news/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const [
      totalArticles,
      publishedArticles,
      archivedArticles,
      last24Hours,
      byCategory,
      bySource,
    ] = await Promise.all([
      NewsArticle.countDocuments(),
      NewsArticle.countDocuments({ status: 'published' }),
      NewsArticle.countDocuments({ status: 'archived' }),
      NewsArticle.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      NewsArticle.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      NewsArticle.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$source.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalArticles,
        publishedArticles,
        archivedArticles,
        last24Hours,
        byCategory,
        bySource,
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

// @desc    Bulk update article status
// @route   PATCH /api/admin/news/bulk-update
// @access  Private/Admin
router.patch('/bulk-update', async (req, res) => {
  try {
    const { articleIds, updates } = req.body;

    if (!articleIds || !Array.isArray(articleIds)) {
      return res.status(400).json({
        success: false,
        message: 'Article IDs array is required',
      });
    }

    const result = await NewsArticle.updateMany(
      { _id: { $in: articleIds } },
      { $set: updates }
    );

    res.status(200).json({
      success: true,
      message: `Updated ${result.modifiedCount} articles`,
      data: result,
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating articles',
      error: error.message,
    });
  }
});

// @desc    Delete old archived articles
// @route   DELETE /api/admin/news/cleanup
// @access  Private/Admin
router.delete('/cleanup', async (req, res) => {
  try {
    const { daysOld = 90 } = req.query;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysOld));

    const result = await NewsArticle.deleteMany({
      status: 'archived',
      publishedAt: { $lt: cutoffDate },
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} archived articles`,
      data: result,
    });
  } catch (error) {
    console.error('Error in cleanup:', error);
    res.status(500).json({
      success: false,
      message: 'Error cleaning up articles',
      error: error.message,
    });
  }
});

module.exports = router;