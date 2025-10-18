const Parser = require('rss-parser');
const NewsArticle = require('../models/NewsArticle');
const cron = require('node-cron');

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

// RSS Feed sources
const NEWS_SOURCES = [
  {
    name: 'The Pattaya News',
    url: 'https://thepattayanews.com/feed/',
    category: 'local-news',
    priority: 'normal',
    language: 'en',
  },
  {
    name: 'Pattaya Mail',
    url: 'https://www.pattayamail.com/feed',
    category: 'local-news',
    priority: 'normal',
    language: 'en',
  },
  {
    name: 'Tourism Authority of Thailand',
    url: 'https://www.tatnews.org/feed/',
    category: 'tourism',
    priority: 'normal',
    language: 'en',
  },
  {
    name: 'Bangkok Post - Pattaya',
    url: 'https://www.bangkokpost.com/search/result?q=pattaya&type=article&format=rss',
    category: 'local-news',
    priority: 'high',
    language: 'en',
  },
  {
    name: 'Thailand Weather',
    url: 'https://weather.tmd.go.th/rss/weather_forecast_pattaya.xml',
    category: 'weather',
    priority: 'normal',
    language: 'en',
  },
];

/**
 * Fetch and parse RSS feed
 */
async function fetchRSSFeed(source) {
  try {
    console.log(`📡 Fetching feed from ${source.name}...`);
    const feed = await parser.parseURL(source.url);
    
    const articles = [];
    
    for (const item of feed.items) {
      // Skip if article already exists
      const exists = await NewsArticle.findOne({
        'source.url': item.link,
      });

      if (exists) {
        console.log(`⏭️  Skipping existing article: ${item.title}`);
        continue;
      }

      // Extract image from various possible locations
      let imageUrl = extractImageUrl(item, feed);

      // Generate article data
      const articleData = {
        title: cleanTitle(item.title),
        summary: cleanSummary(item.contentSnippet || item.description || ''),
        content: cleanContent(item.contentEncoded || item.content || item.description || ''),
        category: determineCategoryFromContent(item.title + ' ' + item.description, source.category),
        imageUrl: imageUrl || getPlaceholderImage(source.category),
        author: {
          name: item.creator || source.name,
          role: 'External Source',
        },
        source: {
          name: source.name,
          url: item.link,
        },
        publishedAt: new Date(item.pubDate || item.isoDate || Date.now()),
        tags: extractTags(item.title + ' ' + item.description),
        status: 'published',
        featured: source.priority === 'high' && Math.random() < 0.2, // 20% chance for high priority
        priority: determinePriority(item.title, item.description),
      };

      articles.push(articleData);
    }

    return articles;
  } catch (error) {
    console.error(`❌ Error fetching feed from ${source.name}:`, error.message);
    return [];
  }
}

/**
 * Extract image URL from RSS item
 */
function extractImageUrl(item, feed) {
  // Try various common image fields
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  if (item.mediaContent?.$ && item.mediaContent.$.url) {
    return item.mediaContent.$.url;
  }

  if (item.mediaThumbnail?.$ && item.mediaThumbnail.$.url) {
    return item.mediaThumbnail.$.url;
  }

  // Try to extract from content
  if (item.content || item.contentEncoded) {
    const content = item.content || item.contentEncoded;
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }

  // Try feed image
  if (feed.image?.url) {
    return feed.image.url;
  }

  return null;
}

/**
 * Get placeholder image based on category
 */
function getPlaceholderImage(category) {
  const placeholders = {
    'events': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    'tourism': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
    'safety': 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa',
    'transportation': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    'weather': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b',
    'local-news': 'https://images.unsplash.com/photo-1495020689067-958852a7765e',
    'development': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    'culture': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
  };

  return placeholders[category] || placeholders['local-news'];
}

/**
 * Clean and truncate title
 */
function cleanTitle(title) {
  return title
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .trim()
    .substring(0, 300);
}

/**
 * Clean and create summary
 */
function cleanSummary(text) {
  const cleaned = text
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.substring(0, 500);
}

/**
 * Clean content and preserve formatting
 */
function cleanContent(html) {
  // Basic HTML cleaning - preserve paragraphs and links
  let cleaned = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

  // If content is too short, return as is
  if (cleaned.length < 100) {
    return cleaned.replace(/<[^>]*>/g, '').trim();
  }

  return cleaned;
}

/**
 * Determine category from content keywords
 */
function determineCategoryFromContent(text, defaultCategory) {
  const lowerText = text.toLowerCase();

  const categoryKeywords = {
    'events': ['festival', 'concert', 'event', 'show', 'performance', 'exhibition'],
    'tourism': ['tourist', 'travel', 'visitor', 'attraction', 'hotel', 'resort'],
    'safety': ['police', 'crime', 'safety', 'warning', 'alert', 'accident'],
    'transportation': ['road', 'traffic', 'transport', 'bus', 'taxi', 'airport'],
    'weather': ['weather', 'rain', 'storm', 'forecast', 'temperature', 'tropical'],
    'development': ['construction', 'development', 'project', 'infrastructure', 'building'],
    'culture': ['temple', 'culture', 'tradition', 'festival', 'ceremony', 'heritage'],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }

  return defaultCategory;
}

/**
 * Determine priority from content
 */
function determinePriority(title, description) {
  const text = (title + ' ' + description).toLowerCase();

  const urgentKeywords = ['breaking', 'urgent', 'alert', 'warning', 'emergency', 'critical'];
  const highKeywords = ['important', 'major', 'significant', 'announcement'];

  if (urgentKeywords.some(keyword => text.includes(keyword))) {
    return 'urgent';
  }

  if (highKeywords.some(keyword => text.includes(keyword))) {
    return 'high';
  }

  return 'normal';
}

/**
 * Extract relevant tags from content
 */
function extractTags(text) {
  const tags = [];
  const lowerText = text.toLowerCase();

  const commonTags = {
    'pattaya': ['pattaya'],
    'jomtien': ['jomtien'],
    'walking street': ['walking-street', 'nightlife'],
    'beach': ['beach'],
    'tourist': ['tourism'],
    'hotel': ['accommodation'],
    'restaurant': ['dining'],
    'event': ['events'],
    'festival': ['festival'],
    'traffic': ['traffic'],
    'weather': ['weather'],
  };

  for (const [keyword, tagList] of Object.entries(commonTags)) {
    if (lowerText.includes(keyword)) {
      tags.push(...tagList);
    }
  }

  // Remove duplicates
  return [...new Set(tags)];
}

/**
 * Main fetch function
 */
async function fetchAllNews() {
  console.log('\n🔄 Starting news fetch cycle...');
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  let totalFetched = 0;
  let totalCreated = 0;

  for (const source of NEWS_SOURCES) {
    try {
      const articles = await fetchRSSFeed(source);
      totalFetched += articles.length;

      if (articles.length > 0) {
        console.log(`📝 Creating ${articles.length} new articles from ${source.name}...`);

        for (const article of articles) {
          try {
            await NewsArticle.create(article);
            totalCreated++;
            console.log(`  ✅ Created: ${article.title.substring(0, 60)}...`);
          } catch (error) {
            console.error(`  ❌ Failed to create article: ${error.message}`);
          }
        }
      } else {
        console.log(`  ℹ️  No new articles from ${source.name}`);
      }

      // Small delay between sources to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Error processing ${source.name}:`, error.message);
    }
  }

  console.log(`\n✅ News fetch completed!`);
  console.log(`   Total articles fetched: ${totalFetched}`);
  console.log(`   Total articles created: ${totalCreated}`);
  console.log(`   Next run: ${getNextRunTime()}\n`);

  // Clean up old articles (optional)
  await cleanupOldArticles();

  return { fetched: totalFetched, created: totalCreated };
}

/**
 * Clean up articles older than 90 days
 */
async function cleanupOldArticles() {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await NewsArticle.updateMany(
      {
        publishedAt: { $lt: ninetyDaysAgo },
        status: 'published',
      },
      {
        $set: { status: 'archived' },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`🗄️  Archived ${result.modifiedCount} old articles`);
    }
  } catch (error) {
    console.error('❌ Error cleaning up old articles:', error.message);
  }
}

/**
 * Get next scheduled run time
 */
function getNextRunTime() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(next.getHours() + 6);
  return next.toLocaleString();
}

/**
 * Schedule the cron job
 */
function scheduleNewsFetcher() {
  // Run every 6 hours: 0 */6 * * *
  // For testing, use: */5 * * * * (every 5 minutes)
  
  cron.schedule('0 */6 * * *', async () => {
    console.log('\n🤖 Cron job triggered: Fetching news...');
    await fetchAllNews();
  });

  console.log('✅ News fetcher cron job scheduled');
  console.log('   Schedule: Every 6 hours');
  console.log('   Next run: ' + getNextRunTime());

  // Run immediately on startup
  setTimeout(() => {
    console.log('\n🚀 Running initial news fetch...');
    fetchAllNews();
  }, 5000); // Wait 5 seconds after startup
}

/**
 * Manual trigger function for API endpoint
 */
async function manualFetch() {
  console.log('🔄 Manual news fetch triggered');
  return await fetchAllNews();
}

module.exports = {
  scheduleNewsFetcher,
  fetchAllNews,
  manualFetch,
};