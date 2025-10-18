/**
 * Manual API Testing Guide for Favorites
 * 
 * Prerequisites:
 * - Server running on http://localhost:5000
 * - User authenticated (get JWT token from login)
 * - At least one event exists in database
 */

// ============================================
// 1. GET ALL FAVORITES
// ============================================
/*
curl -X GET http://localhost:5000/api/users/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

Expected Response:
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "event123",
      "title": "Beach Music Festival",
      "date": "2025-12-15T18:00:00.000Z",
      ...
    }
  ]
}
*/

// ============================================
// 2. ADD EVENT TO FAVORITES
// ============================================
/*
curl -X POST http://localhost:5000/api/users/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"eventId": "67301a2f4b8c9d001e5f2a3b"}'

Expected Response:
{
  "success": true,
  "message": "Event added to favorites",
  "data": {
    "eventId": "67301a2f4b8c9d001e5f2a3b",
    "totalFavorites": 3
  }
}
*/

// ============================================
// 3. CHECK IF EVENT IS FAVORITED
// ============================================
/*
curl -X GET http://localhost:5000/api/users/favorites/67301a2f4b8c9d001e5f2a3b \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

Expected Response:
{
  "success": true,
  "data": {
    "eventId": "67301a2f4b8c9d001e5f2a3b",
    "isFavorite": true
  }
}
*/

// ============================================
// 4. REMOVE EVENT FROM FAVORITES
// ============================================
/*
curl -X DELETE http://localhost:5000/api/users/favorites/67301a2f4b8c9d001e5f2a3b \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

Expected Response:
{
  "success": true,
  "message": "Event removed from favorites",
  "data": {
    "eventId": "67301a2f4b8c9d001e5f2a3b",
    "totalFavorites": 2
  }
}
*/

// ============================================
// 5. CHECK USER INTERACTIONS
// ============================================
/*
curl -X GET http://localhost:5000/api/users/me/interactions/67301a2f4b8c9d001e5f2a3b \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

Expected Response:
{
  "success": true,
  "data": {
    "isFavorite": true,
    "hasReminder": false,
    "reminderDate": null
  }
}
*/

// ============================================
// 6. GET USER PROFILE WITH FAVORITES
// ============================================
/*
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

Expected Response:
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    ...
  },
  "favorites": [...],
  "reminders": [...],
  "stats": {
    "totalFavorites": 5,
    "totalReminders": 2
  }
}
*/

// ============================================
// 7. CLEAR ALL FAVORITES
// ============================================
/*
curl -X DELETE http://localhost:5000/api/users/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

Expected Response:
{
  "success": true,
  "message": "All favorites cleared",
  "data": {
    "clearedCount": 5
  }
}
*/

// ============================================
// 8. GET USER STATISTICS
// ============================================
/*
curl -X GET http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

Expected Response:
{
  "success": true,
  "data": {
    "totalFavorites": 5,
    "totalReminders": 2,
    "upcomingEvents": 3,
    "pastEvents": 2,
    "memberSince": "2025-10-01T00:00:00.000Z",
    "typeDistribution": {
      "concert": 3,
      "festival": 1,
      "nightlife": 1
    }
  }
}
*/