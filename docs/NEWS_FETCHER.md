# News Fetcher System

## Overview
Automated RSS feed aggregator that fetches news from multiple sources and populates the NewsArticle collection.

## Features

### ✅ Multi-Source Aggregation
- The Pattaya News
- Pattaya Mail
- Tourism Authority of Thailand
- Bangkok Post (Pattaya section)
- Thailand Weather Service

### ✅ Smart Processing
- Automatic duplicate detection
- Category classification from keywords
- Priority assignment (urgent, high, normal)
- Image extraction from multiple sources
- Tag generation from content
- HTML content cleaning

### ✅ Scheduling
- Runs every 6 hours automatically
- Manual trigger via admin API
- Initial fetch 5 seconds after server start
- Auto-archives articles older than 90 days

## Configuration

### Cron Schedule
Default: `0 */6 * * *` (Every 6 hours)

To change frequency, edit `server/cron/fetchNews.js`:
```javascript
cron.schedule('0 */6 * * *', async () => { ... });

// Examples:
// Every hour:        '0 * * * *'
// Every 30 minutes:  '*/30 * * * *'
// Daily at 8am:      '0 8 * * *'
// Every 12 hours:    '0 */12 * * *'