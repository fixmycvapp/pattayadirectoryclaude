const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['events', 'tourism', 'safety', 'transportation', 'weather', 'local-news', 'development', 'culture'],
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    author: {
      name: {
        type: String,
        default: 'Pattaya Directory',
      },
      role: String,
    },
    source: {
      name: String,
      url: String,
    },
    publishedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
    },
    tags: [String],
    
    // SEO
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    metaDescription: String,
    
    // Status
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
      index: true,
    },
    
    // Engagement
    views: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    
    // Admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
newsArticleSchema.index({ status: 1, publishedAt: -1 });
newsArticleSchema.index({ category: 1, status: 1 });
newsArticleSchema.index({ featured: -1, publishedAt: -1 });

// Generate slug
newsArticleSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    const timestamp = Date.now().toString(36);
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 60) + '-' + timestamp;
  }
  next();
});

// Static method to get recent news
newsArticleSchema.statics.getRecent = function(limit = 10, category = null) {
  const query = { status: 'published' };
  if (category) query.category = category;

  return this.find(query)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
};

module.exports = mongoose.model('NewsArticle', newsArticleSchema);