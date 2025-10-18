/**
 * Manual API Testing for Ads
 */

// CREATE AD
/*
curl -X POST http://localhost:5000/api/ads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "title": "Pattaya Beach Resort - Summer Special",
    "description": "Book now and save 30%",
    "position": "header",
    "type": "image",
    "imageUrl": "https://example.com/ad-banner.jpg",
    "targetUrl": "https://pattayaresort.com/summer-special",
    "startDate": "2025-10-17T00:00:00.000Z",
    "endDate": "2025-12-31T23:59:59.000Z",
    "advertiser": {
      "name": "Pattaya Beach Resort",
      "email": "marketing@pattayaresort.com",
      "company": "Pattaya Beach Resort Co.",
      "website": "https://pattayaresort.com"
    },
    "pricing": {
      "type": "fixed",
      "amount": 5000,
      "currency": "THB"
    },
    "priority": 8,
    "weight": 10
  }'
*/

// GET ADS BY POSITION
/*
curl http://localhost:5000/api/ads/position/header?page=home
*/

// RECORD IMPRESSION
/*
curl -X POST http://localhost:5000/api/ads/AD_ID/impression
*/

// RECORD CLICK
/*
curl -X POST http://localhost:5000/api/ads/AD_ID/click
*/

// GET AD ANALYTICS
/*
curl http://localhost:5000/api/ads/AD_ID/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
*/

// GET ALL ADS
/*
curl http://localhost:5000/api/ads \
  -H "Authorization: Bearer ADMIN_TOKEN"
*/

// APPROVE AD
/*
curl -X PATCH http://localhost:5000/api/ads/AD_ID/approve \
  -H "Authorization: Bearer ADMIN_TOKEN"
*/