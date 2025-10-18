/**
 * Test script to manually run news fetcher
 * Usage: node server/scripts/testNewsFetch.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { fetchAllNews } = require('../cron/fetchNews');

async function testFetch() {
  try {
    console.log('🧪 Testing news fetcher...\n');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pattaya-directory');
    console.log('✅ Connected to database\n');

    // Run fetch
    const result = await fetchAllNews();

    console.log('\n📊 Test Results:');
    console.log(`   Articles fetched: ${result.fetched}`);
    console.log(`   Articles created: ${result.created}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testFetch();