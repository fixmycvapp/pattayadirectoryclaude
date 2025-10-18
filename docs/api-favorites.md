# Favorites API Documentation

## Base URL


## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:


---

## Endpoints

### 1. Get All Favorites
Get list of all favorited events for the authenticated user.

**Endpoint:** `GET /users/favorites`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "67301a2f4b8c9d001e5f2a3b",
      "title": "Pattaya Beach Music Festival 2025",
      "date": "2025-12-15T18:00:00.000Z",
      "location": "Beach Road",
      "price": 1500,
      "imageUrl": "https://..."
    }
  ]
}

// { "eventId": "67301a2f4b8c9d001e5f2a3b"}
// {  "success": true,
//  "message": "Event added to favorites",
//  "data": {
//    "eventId": "67301a2f4b8c9d001e5f2a3b",
//    "totalFavorites": 6
//  }
// }