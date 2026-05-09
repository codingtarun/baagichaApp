# Baagicha — API Reference

> Extracted from: `/home/tarun-chauhan/Desktop/Apps/web_baagicha/public/js/script.js`
> All API endpoints used by the mobile app frontend.

---

## Base URL

```
https://api.baagicha.app
```

All requests must include:
```
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: <csrf_token_from_meta>
```

---

## 1. Actions

### Like / Unlike
```
POST /actions/like
```
**Body:**
```json
{
  "type": "Variety | Rootstock | BlogPost | Chemical",
  "id": "123"
}
```
**Response:**
```json
{
  "success": true,
  "count": 145,
  "liked": true
}
```

### Save / Bookmark
```
POST /actions/save
```
**Body:**
```json
{
  "type": "Variety | Rootstock | BlogPost | Chemical",
  "id": "123"
}
```

### Report / Seen Here
```
POST /actions/like
```
**Body:**
```json
{
  "type": "Disease",
  "id": "123",
  "sub": "report"
}
```

### Mark Task Done
```
POST /actions/task-done
```
**Body:**
```json
{
  "task_key": "spray_0"
}
```

---

## 2. Weather

### Select Weather Source
```
POST /weather/select-source
```
**Body (Orchard):**
```json
{
  "source": "orchard",
  "orchard_id": 5
}
```
**Body (Device GPS):**
```json
{
  "source": "device"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Location updated"
}
```

### Get Forecast
```
GET /weather/forecast
```
**Response:** Array of `ForecastDay` objects.

---

## 3. Notifications

### Get Recent Notifications
```
GET /notifications/recent
```
**Headers:** `Accept: application/json`

**Response:**
```json
{
  "count": 3,
  "notifications": [
    {
      "id": 1,
      "title": "Spray reminder: Mancozeb",
      "time": "2 hours ago",
      "type_label": "Spray",
      "icon": "fas fa-spray-can",
      "icon_class": "spray",
      "url": "/spray-schedule",
      "is_read": false
    }
  ]
}
```

### Get Unread Count
```
GET /notifications/unread-count
```
**Headers:** `Accept: application/json`

**Response:**
```json
{
  "count": 3
}
```

---

## 4. Authentication

### Login
```
POST /login
```
**Body:**
```json
{
  "email": "farmer@example.com",
  "password": "password",
  "remember": true
}
```

### Register
```
POST /register
```
**Body:**
```json
{
  "name": "Ramesh Negi",
  "email": "farmer@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

### Logout
```
POST /logout
```
**Headers:** `X-CSRF-TOKEN: <token>`

---

## 5. Pages / Routes

| Route | Method | Description |
|-------|--------|-------------|
| `GET /` | — | Home page |
| `GET /spray-schedule` | — | Spray schedule |
| `GET /disease` | — | Disease library |
| `GET /diseases/{slug}` | — | Disease detail |
| `GET /chemicals` | — | Chemical index |
| `GET /chemicals/{slug}` | — | Chemical detail |
| `GET /chemicals/{slug}/{brand}` | — | Brand detail |
| `GET /variety` | — | Variety guide |
| `GET /rootstock` | — | Rootstock guide |
| `GET /blog` | — | Blog home |
| `GET /weather/forecast` | — | Weather forecast |
| `GET /orchards` | — | My orchards |
| `GET /disease-reporter` | — | Disease reporter |
| `GET /profile` | — | Profile dashboard |
| `GET /notifications` | — | Notifications |
| `GET /saved` | — | Saved items |

---

## 6. Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| `200` | Success | — |
| `401` | Unauthorized | Show "Please login" toast, redirect to login |
| `422` | Validation Error | Show field errors |
| `500` | Server Error | Show generic error toast |

---

## 7. Toast Notification Types

Used for in-app feedback (not API endpoints):

| Type | Icon | Use Case |
|------|------|----------|
| `success` | `fas fa-check` | Action completed |
| `saved` | `fas fa-bookmark` | Item saved |
| `liked` | `fas fa-heart` | Item liked |
| `report` | `fas fa-flag` | Report submitted |
| `done` | `fas fa-circle-check` | Task marked done |
| `pinned` | `fas fa-thumbtack` | Task pinned |
| `info` | `fas fa-circle-info` | General info |
| `warn` | `fas fa-triangle-exclamation` | Warning |
| `error` | `fas fa-xmark` | Error occurred |

---

*All endpoints require CSRF token for POST requests. The token is available from the `<meta name="csrf-token">` tag or from the React Native app's auth storage.*
