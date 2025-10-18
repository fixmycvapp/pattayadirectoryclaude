# Live Events Integration

## Overview
Automatic synchronization of real events from Eventbrite and Facebook Events API into the Pattaya Directory system.

## Supported Platforms

### ✅ Eventbrite
- Public events search in Pattaya area
- Organization-specific events
- Full event details including tickets
- Automatic price detection

### ✅ Facebook Events
- Page-specific events
- Location-based search
- Public events near Pattaya
- Attendance statistics

## Setup Instructions

### 1. Eventbrite Configuration

**Get API Key:**
1. Go to https://www.eventbrite.com/platform/api
2. Create an account or sign in
3. Generate a Private Token
4. Copy token to `.env`:
   ```env
   EVENTBRITE_API_KEY=YOUR_PRIVATE_TOKEN
   EVENTBRITE_ORG_ID=YOUR_ORG_ID (optional)