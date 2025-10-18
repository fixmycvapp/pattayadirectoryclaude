const express = require('express');
const router = express.Router();
const NewsArticle = require('../models/NewsArticle');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      featured,
      priority,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'published' };

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (priority) query.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [articles, total] = await Promise.all([
      NewsArticle.find(query)
        .sort({ publishedAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      NewsArticle.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: articles,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message,
    });
  }
});

// @desc    Get news article by ID or slug
// @route   GET /api/news/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const article = await NewsArticle.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      status: 'published',
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article',
      error: error.message,
    });
  }
});

// Admin routes
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const article = await NewsArticle.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating article',
      error: error.message,
    });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const article = await NewsArticle.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastUpdatedBy: req.user.id,
      },
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: article,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating article',
      error: error.message,
    });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const article = await NewsArticle.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting article',
      error: error.message,
    });
  }
});

module.exports = router;