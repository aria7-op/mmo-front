# MMO Backend API Documentation

**Version:** 1.0.0  
**Base URL:** `https://backend.mmo.org.af/bck` or `http://localhost:5000/bck` (development)  
**API Prefix:** `/bck`

---

## Table of Contents

1. [Authentication](#authentication)
2. [General Information](#general-information)
3. [Request/Response Format](#requestresponse-format)
4. [Error Handling](#error-handling)
5. [Content Types](#content-types)
6. [API Endpoints](#api-endpoints)
   - [News](#news)
   - [Events](#events)
   - [Articles](#articles)
   - [Programs](#programs)
   - [Focus Areas](#focus-areas)
   - [Provinces](#provinces)
   - [Success Stories](#success-stories)
   - [Case Studies](#case-studies)
   - [Annual Reports](#annual-reports)
   - [Policies](#policies)
   - [RFQs](#rfqs)
   - [Team Members](#team-members)
   - [Volunteers](#volunteers)
   - [Complaints & Feedback](#complaints--feedback)
   - [Contact](#contact)
   - [Donations](#donations)
   - [Gallery](#gallery)
   - [FAQs](#faqs)
   - [Opportunities](#opportunities)
   - [Job Applications](#job-applications)
   - [Newsletter](#newsletter)
   - [Organization Profile](#organization-profile)
   - [Statistics](#statistics)
   - [About](#about)
   - [Admin](#admin)

---

## Authentication

### Admin Authentication

Most write operations (POST, PUT, DELETE) require admin authentication.

**Login Endpoint:**
```http
POST /bck/admin/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@mmo.org.af",
    "role": "admin"
  }
}
```

**Using the Token:**
Include the token in the Authorization header for protected endpoints:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## General Information

### Base URL
- **Production:** `https://backend.mmo.org.af/bck`
- **Development:** `http://localhost:5000/bck`

### Supported HTTP Methods
- `GET` - Retrieve data (public, no auth required)
- `POST` - Create new resources (requires auth for most)
- `PUT` - Update existing resources (requires auth)
- `PATCH` - Partial update (requires auth)
- `DELETE` - Delete resources (requires auth)

### Multilingual Support
All content endpoints support three languages:
- `en` - English
- `per` - Persian/Dari
- `ps` - Pashto

Fields that support multilingual content are structured as:
```json
{
  "title": {
    "en": "English Title",
    "per": "عنوان فارسی",
    "ps": "پښتو سرلیک"
  }
}
```

---

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

### Status Codes
- `200` - Success (GET, PUT, PATCH)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Error Handling

### Common Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "error": "Field 'title.en' is required"
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Unauthorized. Please login."
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

## Content Types

### JSON Requests
For simple data without file uploads:
```http
Content-Type: application/json
```

### Multipart/Form-Data
For requests with file uploads (images, PDFs, etc.):
```http
Content-Type: multipart/form-data
```

**Important:** When using `multipart/form-data`, send JSON data in a `data` field:
```javascript
const formData = new FormData();
formData.append('data', JSON.stringify({
  title: { en: "Title" },
  content: { en: "Content" }
}));
formData.append('image', fileInput.files[0]);
```

---

## API Endpoints

---

## News

### Get All News
```http
GET /bck/news
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `status` (optional) - Filter by status: `Published`, `Draft`, `Archived`
- `search` (optional) - Search in title and content
- `category` (optional) - Filter by category
- `featured` (optional) - Filter featured news: `true`/`false`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": {
        "en": "News Title",
        "per": "عنوان خبر",
        "ps": "د خبر سرلیک"
      },
      "content": {
        "en": "News content...",
        "per": "محتوا...",
        "ps": "منځپانګه..."
      },
      "status": "Published",
      "image": {
        "url": "/includes/images/news/2024/12/image.jpg"
      },
      "views": 0,
      "likes": 0,
      "shares": 0,
      "createdAt": "2024-12-10T...",
      "updatedAt": "2024-12-10T..."
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50
  }
}
```

### Get Single News
```http
GET /bck/news/:id
```
or
```http
GET /bck/news/:slug
```

**Response:** Single news object

### Create News (Admin Only)
```http
POST /bck/news
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
data: {
  "title": {
    "en": "News Title",
    "per": "عنوان خبر",
    "ps": "د خبر سرلیک"
  },
  "content": {
    "en": "Content...",
    "per": "محتوا...",
    "ps": "منځپانګه..."
  },
  "summary": {
    "en": "Summary...",
    "per": "خلاصه...",
    "ps": "خلاصه..."
  },
  "category": {
    "en": "General",
    "per": "عمومی",
    "ps": "عمومي"
  },
  "status": "Published"
}
image: <file>
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "News created successfully"
}
```

### Update News (Admin Only)
```http
PUT /bck/news/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:** Same as Create News

### Delete News (Admin Only)
```http
DELETE /bck/news/:id
Authorization: Bearer <token>
```

### Increment Views
```http
POST /bck/news/:id/view
```

### Increment Likes
```http
POST /bck/news/:id/like
```

### Increment Shares
```http
POST /bck/news/:id/share
```

---

## Events

### Get All Events
```http
GET /bck/events
```

**Query Parameters:**
- `page`, `limit`, `status`, `search` - Same as News
- `upcoming` (optional) - Filter upcoming events: `true`/`false`
- `past` (optional) - Filter past events: `true`/`false`

**Response:** Array of event objects

**Event Object Structure:**
```json
{
  "_id": "...",
  "title": {
    "en": "Event Title",
    "per": "عنوان رویداد",
    "ps": "د پیښې سرلیک"
  },
  "description": {
    "en": "Event description...",
    "per": "توضیحات...",
    "ps": "تشریح..."
  },
  "eventDate": "2024-12-15T10:00:00Z",
  "location": {
    "en": "Kabul, Afghanistan",
    "per": "کابل، افغانستان",
    "ps": "کابل، افغانستان"
  },
  "status": "upcoming",
  "image": {
    "url": "/includes/images/events/2024/12/image.jpg"
  },
  "views": 0,
  "likes": 0,
  "shares": 0
}
```

### Get Single Event
```http
GET /bck/events/:id
```

### Create Event (Admin Only)
```http
POST /bck/events
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "title": { "en": "...", "per": "...", "ps": "..." },
  "description": { "en": "...", "per": "...", "ps": "..." },
  "eventDate": "2024-12-15T10:00:00Z",
  "location": { "en": "...", "per": "...", "ps": "..." },
  "status": "upcoming"
}
imageFile: <file>
```

### Update Event (Admin Only)
```http
PUT /bck/events/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Event (Admin Only)
```http
DELETE /bck/events/:id
Authorization: Bearer <token>
```

### Increment Event Views/Likes/Shares
```http
POST /bck/events/:id/view
POST /bck/events/:id/like
POST /bck/events/:id/share
```

---

## Articles

### Get All Articles
```http
GET /bck/articles
```

**Query Parameters:** Same as News

**Response:** Array of article objects

**Article Object Structure:**
```json
{
  "_id": "...",
  "title": {
    "en": "Article Title",
    "per": "عنوان مقاله",
    "ps": "د مقالې سرلیک"
  },
  "content": {
    "en": "Article content...",
    "per": "محتوا...",
    "ps": "منځپانګه..."
  },
  "reportType": {
    "en": "Progress Report",
    "per": "گزارش پیشرفت",
    "ps": "پرمختګ راپور"
  },
  "status": "published",
  "image": {
    "url": "/includes/images/articles/2024/12/image.jpg"
  }
}
```

### Get Single Article
```http
GET /bck/articles/:id
```

### Create Article (Admin Only)
```http
POST /bck/articles
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "title": { "en": "...", "per": "...", "ps": "..." },
  "content": { "en": "...", "per": "...", "ps": "..." },
  "reportType": { "en": "...", "per": "...", "ps": "..." },
  "status": "published"
}
image: <file>
```

### Update Article (Admin Only)
```http
PUT /bck/articles/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Article (Admin Only)
```http
DELETE /bck/articles/:id
Authorization: Bearer <token>
```

---

## Programs

### Get All Programs
```http
GET /bck/programs
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": {
        "en": "Education Program",
        "per": "برنامه آموزش",
        "ps": "د زده کړو پروګرام"
      },
      "description": {
        "en": "Program description...",
        "per": "توضیحات...",
        "ps": "تشریح..."
      },
      "startDate": "2024-01-01",
      "status": "active",
      "heroImage": {
        "url": "/includes/images/programs/2024/12/image.jpg"
      },
      "focusAreas": [...],
      "provinces": [...]
    }
  ]
}
```

### Get Single Program
```http
GET /bck/programs/:id
```

### Create Program (Admin Only)
```http
POST /bck/programs
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "name": { "en": "...", "per": "...", "ps": "..." },
  "description": { "en": "...", "per": "...", "ps": "..." },
  "startDate": "2024-01-01",
  "status": "active",
  "focusAreas": ["<focusAreaId1>", "<focusAreaId2>"],
  "provinces": ["<provinceId1>", "<provinceId2>"]
}
image: <file>
```

### Update Program (Admin Only)
```http
PUT /bck/programs/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Program (Admin Only)
```http
DELETE /bck/programs/:id
Authorization: Bearer <token>
```

---

## Focus Areas

### Get All Focus Areas
```http
GET /bck/focus-areas
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": {
        "en": "Education",
        "per": "آموزش",
        "ps": "زده کړه"
      },
      "description": {
        "en": "Focus area description...",
        "per": "توضیحات...",
        "ps": "تشریح..."
      },
      "status": "active",
      "image": {
        "url": "/includes/images/focus_areas/2024/12/image.jpg"
      }
    }
  ]
}
```

### Get Single Focus Area
```http
GET /bck/focus-areas/:id
```

### Create Focus Area (Admin Only)
```http
POST /bck/focus-areas
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "name": { "en": "...", "per": "...", "ps": "..." },
  "description": { "en": "...", "per": "...", "ps": "..." },
  "status": "active"
}
image: <file>
```

### Update Focus Area (Admin Only)
```http
PUT /bck/focus-areas/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Focus Area (Admin Only)
```http
DELETE /bck/focus-areas/:id
Authorization: Bearer <token>
```

---

## Provinces

### Get All Provinces
```http
GET /bck/provinces
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": {
        "en": "Kabul",
        "per": "کابل",
        "ps": "کابل"
      },
      "code": "KBL",
      "programs": [...],
      "focusAreas": [...]
    }
  ]
}
```

### Get Single Province
```http
GET /bck/provinces/:id
```

### Create Province (Admin Only)
```http
POST /bck/provinces
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": {
    "en": "Kabul",
    "per": "کابل",
    "ps": "کابل"
  },
  "code": "KBL"
}
```

**Note:** Provinces don't require file uploads, use `application/json` directly.

### Update Province (Admin Only)
```http
PUT /bck/provinces/:id
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete Province (Admin Only)
```http
DELETE /bck/provinces/:id
Authorization: Bearer <token>
```

---

## Success Stories

### Get All Success Stories
```http
GET /bck/success-stories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": {
        "en": "Success Story Title",
        "per": "عنوان داستان موفقیت",
        "ps": "د بریالیتوب کیسه"
      },
      "content": {
        "en": "Story content...",
        "per": "محتوا...",
        "ps": "منځپانګه..."
      },
      "status": "Published",
      "image": {
        "url": "/includes/images/success_stories/2024/12/image.jpg"
      },
      "program": "<programId>",
      "focusArea": "<focusAreaId>",
      "province": "<provinceId>"
    }
  ]
}
```

### Get Single Success Story
```http
GET /bck/success-stories/:id
```

### Create Success Story (Admin Only)
```http
POST /bck/success-stories
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "title": { "en": "...", "per": "...", "ps": "..." },
  "content": { "en": "...", "per": "...", "ps": "..." },
  "status": "Published",
  "program": "<programId>",
  "focusArea": "<focusAreaId>",
  "province": "<provinceId>"
}
image: <file>
```

### Update Success Story (Admin Only)
```http
PUT /bck/success-stories/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Success Story (Admin Only)
```http
DELETE /bck/success-stories/:id
Authorization: Bearer <token>
```

---

## Case Studies

### Get All Case Studies
```http
GET /bck/case-studies
```

**Response:** Similar structure to Success Stories

### Get Single Case Study
```http
GET /bck/case-studies/:id
```

### Create Case Study (Admin Only)
```http
POST /bck/case-studies
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:** Same format as Success Stories

### Update Case Study (Admin Only)
```http
PUT /bck/case-studies/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Case Study (Admin Only)
```http
DELETE /bck/case-studies/:id
Authorization: Bearer <token>
```

---

## Annual Reports

### Get All Annual Reports
```http
GET /bck/annual-reports
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "year": 2024,
      "title": {
        "en": "Annual Report 2024",
        "per": "گزارش سالانه 2024",
        "ps": "کلنی راپور 2024"
      },
      "description": {
        "en": "Report description...",
        "per": "توضیحات...",
        "ps": "تشریح..."
      },
      "file": {
        "url": "/includes/images/annual_reports/2024/12/report.pdf",
        "filename": "report.pdf"
      },
      "coverImage": {
        "url": "/includes/images/annual_reports/2024/12/cover.jpg"
      }
    }
  ]
}
```

**Note:** `year` field is unique - only one report per year.

### Get Single Annual Report
```http
GET /bck/annual-reports/:id
```

### Create Annual Report (Admin Only)
```http
POST /bck/annual-reports
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "year": 2024,
  "title": { "en": "...", "per": "...", "ps": "..." },
  "description": { "en": "...", "per": "...", "ps": "..." }
}
file: <PDF file>
coverImage: <image file> (optional)
```

### Update Annual Report (Admin Only)
```http
PUT /bck/annual-reports/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Annual Report (Admin Only)
```http
DELETE /bck/annual-reports/:id
Authorization: Bearer <token>
```

---

## Policies

### Get All Policies
```http
GET /bck/policies
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": {
        "en": "Policy Title",
        "per": "عنوان سیاست",
        "ps": "د پالیسۍ سرلیک"
      },
      "content": {
        "en": "Policy content...",
        "per": "محتوا...",
        "ps": "منځپانګه..."
      },
      "category": {
        "en": "HR Policy",
        "per": "سیاست منابع انسانی",
        "ps": "د بشري سرچینو پالیسي"
      },
      "status": "Published",
      "file": {
        "url": "/includes/images/policies/2024/12/policy.pdf"
      }
    }
  ]
}
```

### Get Single Policy
```http
GET /bck/policies/:id
```

### Create Policy (Admin Only)
```http
POST /bck/policies
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "title": { "en": "...", "per": "...", "ps": "..." },
  "content": { "en": "...", "per": "...", "ps": "..." },
  "category": { "en": "...", "per": "...", "ps": "..." },
  "status": "Published"
}
file: <PDF file> (optional)
```

### Update Policy (Admin Only)
```http
PUT /bck/policies/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Policy (Admin Only)
```http
DELETE /bck/policies/:id
Authorization: Bearer <token>
```

---

## RFQs

### Get All RFQs
```http
GET /bck/rfqs
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": {
        "en": "RFQ Title",
        "per": "عنوان درخواست قیمت",
        "ps": "د قیمت غوښتنه"
      },
      "description": {
        "en": "RFQ description...",
        "per": "توضیحات...",
        "ps": "تشریح..."
      },
      "type": "RFQ",
      "deadline": "2024-12-31T23:59:59Z",
      "status": "open",
      "file": {
        "url": "/includes/images/rfqs/2024/12/rfq.pdf"
      }
    }
  ]
}
```

### Get Single RFQ
```http
GET /bck/rfqs/:id
```

### Create RFQ (Admin Only)
```http
POST /bck/rfqs
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "title": { "en": "...", "per": "...", "ps": "..." },
  "description": { "en": "...", "per": "...", "ps": "..." },
  "type": "RFQ",
  "deadline": "2024-12-31T23:59:59Z",
  "status": "open"
}
file: <PDF file> (optional)
```

### Update RFQ (Admin Only)
```http
PUT /bck/rfqs/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete RFQ (Admin Only)
```http
DELETE /bck/rfqs/:id
Authorization: Bearer <token>
```

---

## Team Members

### Get All Team Members
```http
GET /bck/team-members
```

**Query Parameters:**
- `role` (optional) - Filter by role: `Board`, `Executive`, `Management`, `Staff`, `Volunteer`
- `position` (optional) - Filter by position (multilingual)
- `active` (optional) - Filter active members: `true`/`false`
- `featured` (optional) - Filter featured members: `true`/`false`
- `department` (optional) - Filter by department
- `search` (optional) - Search in name, position, department

**Examples:**
```http
GET /bck/team-members?role=Board
GET /bck/team-members?role=Executive
GET /bck/team-members?active=true&featured=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": {
        "en": "John Smith",
        "per": "جان اسمیت",
        "ps": "جان اسمیت"
      },
      "position": {
        "en": "Executive Director",
        "per": "مدیر اجرایی",
        "ps": "اجرایوي مدیر"
      },
      "role": "Executive",
      "email": "john@mmo.org.af",
      "phone": "+93779752121",
      "bio": {
        "en": "Bio text...",
        "per": "بیوگرافی...",
        "ps": "ژوندلیک..."
      },
      "image": {
        "url": "/includes/images/team/2024/12/image.jpg"
      },
      "status": "Published",
      "active": true,
      "featured": false
    }
  ],
  "count": 10
}
```

### Get Single Team Member
```http
GET /bck/team-members/:id
```

### Create Team Member (Admin Only)
```http
POST /bck/team-members
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "name": { "en": "...", "per": "...", "ps": "..." },
  "position": { "en": "Executive Director", "per": "...", "ps": "..." },
  "role": "Executive",
  "email": "email@mmo.org.af",
  "phone": "+93779752121",
  "bio": { "en": "...", "per": "...", "ps": "..." },
  "status": "Published",
  "active": true,
  "featured": false
}
image: <file>
```

**Position Enum Values (English):**
- `Board Member`
- `Executive Director`
- `Program Manager`
- `Finance Manager`
- `Operations Manager`
- `Communication Manager`
- `Field Coordinator`
- `Other`

**Role Enum Values:**
- `Board`
- `Executive`
- `Management`
- `Staff`
- `Volunteer`

### Update Team Member (Admin Only)
```http
PUT /bck/team-members/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Team Member (Admin Only)
```http
DELETE /bck/team-members/:id
Authorization: Bearer <token>
```

---

## Volunteers

### Get All Volunteers (Admin Only)
```http
GET /bck/volunteers
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+93779752121",
      "address": "Kabul",
      "skills": ["Teaching", "Translation"],
      "availability": "Part-time",
      "status": "pending",
      "applicationDate": "2024-12-10T..."
    }
  ]
}
```

### Get Single Volunteer (Admin Only)
```http
GET /bck/volunteers/:id
Authorization: Bearer <token>
```

### Submit Volunteer Application (Public)
```http
POST /bck/volunteers
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "city": "Kabul",
  "phone": "+93779752121",
  "skills": ["Teaching", "Translation"],
  "availability": "Part-time",
  "interests": ["Education", "Community Development"]
}
```

**Note:** Frontend sends `firstName` and `lastName`, backend combines them to `name`. Frontend sends `city`, backend maps it to `address`.

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Thanks for your interest! We will contact you soon."
}
```

### Update Volunteer (Admin Only)
```http
PUT /bck/volunteers/:id
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete Volunteer (Admin Only)
```http
DELETE /bck/volunteers/:id
Authorization: Bearer <token>
```

---

## Complaints & Feedback

### Get All Complaints (Admin Only)
```http
GET /bck/complaints
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "type": "feedback",
      "subject": "Subject line",
      "description": "Complaint/feedback description...",
      "complainantName": "John Doe",
      "email": "john@example.com",
      "phone": "+93779752121",
      "status": "new",
      "priority": "medium",
      "createdAt": "2024-12-10T..."
    }
  ]
}
```

### Get Single Complaint (Admin Only)
```http
GET /bck/complaints/:id
Authorization: Bearer <token>
```

### Submit Complaint/Feedback (Public)
```http
POST /bck/complaints
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "type": "feedback",
  "subject": "Subject line",
  "message": "Your complaint or feedback message here..."
}
```

**Type Values:**
- `feedback`
- `complaint`
- `suggestion` (mapped to `feedback` in backend)
- `other` (mapped to `feedback` in backend)

**Note:** Frontend sends `name` and `message`, backend maps to `complainantName` and `description`.

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Thank you for your feedback. We will review and respond soon."
}
```

### Update Complaint (Admin Only)
```http
PUT /bck/complaints/:id
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete Complaint (Admin Only)
```http
DELETE /bck/complaints/:id
Authorization: Bearer <token>
```

---

## Contact

### Submit Contact Form (Public)
```http
POST /bck/contact
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "Your message here...",
  "phone": "+93779752121"
}
```

**Note:** `subject` is optional, defaults to "General Inquiry" if not provided.

**Response:**
```json
{
  "success": true,
  "message": "Contact message sent successfully",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "General Inquiry",
    "status": "new",
    "createdAt": "2024-12-10T..."
  }
}
```

### Get All Contacts (Admin Only)
```http
GET /bck/contact
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional) - Page number
- `limit` (optional) - Items per page
- `status` (optional) - Filter by status
- `department` (optional) - Filter by department
- `search` (optional) - Search in name, email, subject, message

### Get Single Contact (Admin Only)
```http
GET /bck/contact/:id
Authorization: Bearer <token>
```

### Update Contact Status (Admin Only)
```http
PUT /bck/contact/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "read"
}
```

### Add Contact Response (Admin Only)
```http
PUT /bck/contact/:id/response
Authorization: Bearer <token>
Content-Type: application/json

{
  "response": "Response message here..."
}
```

### Delete Contact (Admin Only)
```http
DELETE /bck/contact/:id
Authorization: Bearer <token>
```

---

## Donations

### Submit Donation (Public)
```http
POST /bck/donate
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "city": "Kabul",
  "zipCode": "1001",
  "amount": 100,
  "currency": "USD",
  "payment-method": "pp",
  "period": "one_time"
}
```

**Payment Method Values:**
- `dbt` - Direct Bank Transfer (mapped to `bank-transfer`)
- `cp` - Cheque Payment (mapped to `bank-transfer`)
- `pp` - PayPal Payment (mapped to `paypal`)

**Period Values:**
- `one_time` - One-time donation
- `two_time` - Two-time donation
- `three_time` - Three-time donation

**Note:** Frontend sends `firstName` and `lastName`, backend combines to `donorName`. Frontend sends `city`, backend maps to `city` field.

**Response:**
```json
{
  "success": true,
  "message": "Donation submitted successfully. Thank you for your support!",
  "data": {
    "_id": "...",
    "donorName": "John Doe",
    "donorEmail": "john@example.com",
    "amount": 100,
    "currency": "USD",
    "paymentMethod": "paypal",
    "period": "one_time",
    "paymentStatus": "pending"
  }
}
```

### Get All Donations (Admin Only)
```http
GET /bck/donate
Authorization: Bearer <token>
```

### Get Single Donation (Admin Only)
```http
GET /bck/donate/:id
Authorization: Bearer <token>
```

### Create Stripe Payment Intent
```http
POST /bck/stripe/create-payment-intent
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 10000,
  "currency": "usd",
  "donorName": "John Doe",
  "donorEmail": "john@example.com"
}
```

**Note:** Amount is in cents (10000 = $100.00)

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx"
}
```

---

## Gallery

### Get All Gallery Items
```http
GET /bck/gallery
```

**Query Parameters:**
- `page`, `limit`, `search` - Standard pagination
- `category` (optional) - Filter by category
- `featured` (optional) - Filter featured items

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": {
        "en": "Gallery Item Title",
        "per": "عنوان گالری",
        "ps": "د ګالري سرلیک"
      },
      "description": {
        "en": "Description...",
        "per": "توضیحات...",
        "ps": "تشریح..."
      },
      "image": {
        "url": "/includes/images/gallery/2024/12/image.jpg"
      },
      "category": {
        "en": "Events",
        "per": "رویدادها",
        "ps": "پیښې"
      }
    }
  ]
}
```

### Get Single Gallery Item
```http
GET /bck/gallery/:id
```

### Create Gallery Item (Admin Only)
```http
POST /bck/gallery
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "title": { "en": "...", "per": "...", "ps": "..." },
  "description": { "en": "...", "per": "...", "ps": "..." },
  "category": { "en": "...", "per": "...", "ps": "..." }
}
image: <file>
```

### Update Gallery Item (Admin Only)
```http
PUT /bck/gallery/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Gallery Item (Admin Only)
```http
DELETE /bck/gallery/:id
Authorization: Bearer <token>
```

---

## FAQs

### Get All FAQs
```http
GET /bck/faqs
```

**Query Parameters:**
- `category` (optional) - Filter by category
- `status` (optional) - Filter by status: `Published`, `Draft`
- `search` (optional) - Search in question and answer

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "question": {
        "en": "What is MMO?",
        "per": "MMO چیست؟",
        "ps": "MMO څه دی؟"
      },
      "answer": {
        "en": "MMO is an NGO...",
        "per": "MMO یک سازمان غیردولتی است...",
        "ps": "MMO یو غیر دولتي سازمان دی..."
      },
      "category": "general",
      "status": "Published"
    }
  ]
}
```

### Get Single FAQ
```http
GET /bck/faqs/:id
```

### Create FAQ (Admin Only)
```http
POST /bck/faqs
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": {
    "en": "Question?",
    "per": "سوال؟",
    "ps": "پوښتنه؟"
  },
  "answer": {
    "en": "Answer...",
    "per": "جواب...",
    "ps": "ځواب..."
  },
  "category": "general",
  "status": "Published"
}
```

### Update FAQ (Admin Only)
```http
PUT /bck/faqs/:id
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete FAQ (Admin Only)
```http
DELETE /bck/faqs/:id
Authorization: Bearer <token>
```

---

## Opportunities

### Get All Opportunities
```http
GET /bck/opportunities
```

**Query Parameters:**
- `type` (optional) - Filter by type: `job`, `volunteer`, `internship`, `consultant`
- `status` (optional) - Filter by status: `Active`, `Closed`, `Draft`
- `search` (optional) - Search in title and description

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": {
        "en": "Program Manager Position",
        "per": "موقعیت مدیر برنامه",
        "ps": "د پروګرام مدیر مقام"
      },
      "type": "job",
      "description": {
        "en": "Job description...",
        "per": "توضیحات شغل...",
        "ps": "د دندې تشریح..."
      },
      "requirements": {
        "en": "Requirements...",
        "per": "نیازمندی‌ها...",
        "ps": "اړتیاوې..."
      },
      "deadline": "2024-12-31T23:59:59Z",
      "status": "Active"
    }
  ]
}
```

### Get Single Opportunity
```http
GET /bck/opportunities/:id
```

### Create Opportunity (Admin Only)
```http
POST /bck/opportunities
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": { "en": "...", "per": "...", "ps": "..." },
  "type": "job",
  "description": { "en": "...", "per": "...", "ps": "..." },
  "requirements": { "en": "...", "per": "...", "ps": "..." },
  "deadline": "2024-12-31T23:59:59Z",
  "status": "Active"
}
```

### Update Opportunity (Admin Only)
```http
PUT /bck/opportunities/:id
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete Opportunity (Admin Only)
```http
DELETE /bck/opportunities/:id
Authorization: Bearer <token>
```

---

## Job Applications

### Apply to Specific Opportunity
```http
POST /bck/opportunity/:id/apply
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+93779752121",
  "coverLetter": "Cover letter text...",
  "position": "Program Manager"
}
resume: <file> (PDF, DOC, DOCX)
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Application submitted successfully! We will contact you soon."
}
```

### General Job Application (No Specific Opportunity)
```http
POST /bck/jobs/apply
Content-Type: multipart/form-data
```

**Request Body:** Same as above (opportunityId will be null)

### Get All Applications (Admin Only)
```http
GET /bck/opportunity-applications
Authorization: Bearer <token>
```

**Query Parameters:**
- `opportunityId` (optional) - Filter by opportunity ID

---

## Newsletter

### Subscribe to Newsletter (Public)
```http
POST /bck/newsletter/subscribe
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "subscriber@example.com",
  "preferences": {
    "events": true,
    "news": true,
    "programs": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

### Unsubscribe from Newsletter (Public)
```http
POST /bck/newsletter/unsubscribe
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "subscriber@example.com"
}
```

### Get All Subscribers (Admin Only)
```http
GET /bck/newsletter
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `status` (optional) - Filter by status: `active`, `unsubscribed`, `all`

---

## Organization Profile

### Get Organization Profile
```http
GET /bck/organization-profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "organizationName": {
      "en": "Mission Mind Organization (MMO)",
      "per": "سازمان ماموریت ذهن",
      "ps": "د ذهن ماموریت سازمان"
    },
    "registrationNumber": "5249",
    "registrationDate": "2021-07-13T00:00:00Z",
    "registeredWith": {
      "en": "Ministry of Commerce & Industries, Afghanistan",
      "per": "وزارت تجارت و صنایع، افغانستان",
      "ps": "د سوداګرۍ او صنایعو وزارت، افغانستان"
    },
    "address": {
      "en": "15th House, 4th St, Qalai Fatullah, Kabul, Afghanistan",
      "per": "خانه پانزدهم، خیابان چهارم، قلعه فتح‌الله، کابل، افغانستان",
      "ps": "پنځلسم کور، څلورم سړک، قلعه فتح‌الله، کابل، افغانستان"
    },
    "approach": {
      "en": "Our approach...",
      "per": "رویکرد ما...",
      "ps": "زموږ لیدلوری..."
    },
    "profile": {
      "en": "Organization profile...",
      "per": "پروفایل سازمان...",
      "ps": "د سازمان پروفایل..."
    }
  }
}
```

### Create Organization Profile (Admin Only)
```http
POST /bck/organization-profile
Authorization: Bearer <token>
Content-Type: application/json
```

### Update Organization Profile (Admin Only)
```http
PUT /bck/organization-profile/:id
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Statistics

### Get Public Statistics
```http
GET /bck/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPrograms": 15,
    "totalFocusAreas": 8,
    "totalProvinces": 15,
    "totalEvents": 25,
    "totalArticles": 30,
    "totalNews": 45,
    "totalSuccessStories": 20,
    "totalCaseStudies": 12,
    "totalVolunteers": 150,
    "totalApplications": 75,
    "totalBeneficiaries": 224780,
    "totalProjects": 23,
    "totalResources": 107
  },
  "message": "Statistics fetched successfully"
}
```

**Note:** This endpoint is public and doesn't require authentication. Use it for homepage counters.

---

## About

### Get About Page Content
```http
GET /bck/about
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "content": {
      "en": "About content...",
      "per": "محتوا درباره...",
      "ps": "د اړه منځپانګه..."
    },
    "mission": {
      "en": "Mission statement...",
      "per": "بیانیه ماموریت...",
      "ps": "د ماموریت بیان..."
    },
    "vision": {
      "en": "Vision statement...",
      "per": "بیانیه چشم‌انداز...",
      "ps": "د لیدلوري بیان..."
    }
  }
}
```

### Update About (Admin Only)
```http
PUT /bck/about/:id
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Admin

### Login
```http
POST /bck/admin/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@mmo.org.af",
    "role": "admin"
  }
}
```

### Get Current User
```http
GET /bck/admin/auth/me
Authorization: Bearer <token>
```

### Logout
```http
POST /bck/admin/auth/logout
Authorization: Bearer <token>
```

### Dashboard Statistics
```http
GET /bck/dashboard/stats
Authorization: Bearer <token>
```

---

## Frontend Integration Examples

### Example: Fetching News with React

```javascript
// Fetch all published news
const fetchNews = async () => {
  try {
    const response = await fetch('https://backend.mmo.org.af/bck/news?status=Published&limit=10');
    const result = await response.json();
    
    if (result.success) {
      console.log('News:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching news:', error);
  }
};
```

### Example: Submitting Contact Form

```javascript
const submitContact = async (formData) => {
  try {
    const response = await fetch('https://backend.mmo.org.af/bck/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        phone: formData.phone
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Message sent successfully!');
      return result.data;
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error submitting contact:', error);
  }
};
```

### Example: Creating News with File Upload

```javascript
const createNews = async (newsData, imageFile, token) => {
  const formData = new FormData();
  
  // Add JSON data
  formData.append('data', JSON.stringify({
    title: {
      en: newsData.titleEn,
      per: newsData.titlePer,
      ps: newsData.titlePs
    },
    content: {
      en: newsData.contentEn,
      per: newsData.contentPer,
      ps: newsData.contentPs
    },
    status: 'Published'
  }));
  
  // Add image file
  formData.append('image', imageFile);
  
  try {
    const response = await fetch('https://backend.mmo.org.af/bck/news', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type header - browser will set it with boundary
      },
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('News created:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error creating news:', error);
  }
};
```

### Example: Submitting Volunteer Application

```javascript
const submitVolunteerApplication = async (formData) => {
  try {
    const response = await fetch('https://backend.mmo.org.af/bck/volunteers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        city: formData.city,
        phone: formData.phone,
        skills: formData.skills || [],
        availability: formData.availability,
        interests: formData.interests || []
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert(result.message || 'Application submitted successfully!');
      return result.data;
    }
  } catch (error) {
    console.error('Error submitting application:', error);
  }
};
```

### Example: Submitting Job Application with File Upload

```javascript
const submitJobApplication = async (formData, resumeFile) => {
  const formDataObj = new FormData();
  
  formDataObj.append('data', JSON.stringify({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    coverLetter: formData.coverLetter,
    position: formData.position
  }));
  
  formDataObj.append('resume', resumeFile);
  
  try {
    const response = await fetch('https://backend.mmo.org.af/bck/jobs/apply', {
      method: 'POST',
      body: formDataObj
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert(result.message || 'Application submitted successfully!');
      return result.data;
    }
  } catch (error) {
    console.error('Error submitting job application:', error);
  }
};
```

### Example: Submitting Donation

```javascript
const submitDonation = async (donationData) => {
  try {
    const response = await fetch('https://backend.mmo.org.af/bck/donate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: donationData.firstName,
        lastName: donationData.lastName,
        email: donationData.email,
        city: donationData.city,
        zipCode: donationData.zipCode,
        amount: donationData.amount,
        currency: donationData.currency || 'USD',
        'payment-method': donationData.paymentMethod, // 'dbt', 'cp', or 'pp'
        period: donationData.period || 'one_time' // 'one_time', 'two_time', 'three_time'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert(result.message || 'Donation submitted successfully!');
      return result.data;
    }
  } catch (error) {
    console.error('Error submitting donation:', error);
  }
};
```

### Example: Fetching Team Members by Role

```javascript
// Fetch Board Directors
const fetchBoardMembers = async () => {
  try {
    const response = await fetch('https://backend.mmo.org.af/bck/team-members?role=Board&active=true&status=Published');
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching board members:', error);
  }
};

// Fetch Executive Team
const fetchExecutiveTeam = async () => {
  try {
    const response = await fetch('https://backend.mmo.org.af/bck/team-members?role=Executive&active=true&status=Published');
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching executive team:', error);
  }
};
```

### Example: Fetching Statistics for Counter

```javascript
const fetchStatistics = async () => {
  try {
    const response = await fetch('https://backend.mmo.org.af/bck/statistics');
    const result = await response.json();
    
    if (result.success) {
      return result.data;
      // Use: result.data.totalPrograms, result.data.totalBeneficiaries, etc.
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
  }
};
```

---

## Important Notes for Frontend Developers

### 1. CORS Configuration
The backend allows requests from:
- `https://mmo.org.af`
- `http://mmo.org.af`
- `https://mmo.arg.af`
- `http://mmo.arg.af`
- `http://localhost:3000` (development)
- `http://localhost:3001` (development)

### 2. File Uploads
- **Image formats:** JPG, JPEG, PNG, GIF, WebP
- **Document formats:** PDF, DOC, DOCX
- **Max file size:** 10MB (configurable)
- **Field names:** Use `image`, `file`, `resume`, `coverImage` as specified in each endpoint

### 3. Multilingual Fields
Always provide all three languages (`en`, `per`, `ps`) when creating/updating content. At minimum, provide `en`.

### 4. Date Formats
- Use ISO 8601 format: `2024-12-10T10:00:00Z`
- Or simple date: `2024-12-10`

### 5. Authentication
- Store JWT token securely (localStorage or httpOnly cookies)
- Include token in `Authorization: Bearer <token>` header
- Token expires after 24 hours (default)

### 6. Error Handling
Always check `result.success` before using `result.data`:
```javascript
if (result.success) {
  // Use result.data
} else {
  // Handle error: result.message
}
```

### 7. Pagination
Most list endpoints support pagination:
```javascript
const response = await fetch('/bck/news?page=1&limit=10');
const result = await response.json();
// result.pagination contains: current, pages, total
```

### 8. Static Files
Images are served from:
- `https://backend.mmo.org.af/includes/images/{collection}/{year}/{month}/{filename}`
- Example: `/includes/images/news/2024/12/image.jpg`

### 9. Rate Limiting
- Contact form: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP
- Authentication: 5 login attempts per 15 minutes per IP

### 10. Status Values
Common status values:
- **News/Articles/Events:** `Published`, `Draft`, `Archived`
- **Team Members:** `Published`, `Draft`, `Archived`
- **Opportunities:** `Active`, `Closed`, `Draft`
- **Applications:** `pending`, `reviewed`, `shortlisted`, `accepted`, `rejected`
- **Complaints:** `new`, `in-progress`, `resolved`, `closed`

---

## Stripe Payment Integration

### Create Payment Intent (Public)
```http
POST /bck/stripe/create-payment-intent
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 10000,
  "currency": "usd",
  "donorName": "John Doe",
  "donorEmail": "john@example.com"
}
```

**Note:** Amount is in cents (10000 = $100.00)

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx"
}
```

### Get Payment Status (Public)
```http
GET /bck/stripe/payment-status/:paymentIntentId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "succeeded",
    "amount": 10000,
    "currency": "usd"
  }
}
```

### Get Stripe Events (Admin Only)
```http
GET /bck/stripe/events
Authorization: Bearer <token>
```

### Sync Stripe Events (Admin Only)
```http
POST /bck/stripe/events/sync
Authorization: Bearer <token>
```

---

## Donation Configuration

### Get Donation Configuration (Public)
```http
GET /bck/donation-config
```

**Response:**
```json
{
  "success": true,
  "data": {
    "minAmount": 10,
    "maxAmount": 10000,
    "defaultAmounts": [20, 50, 100, 200],
    "currency": "USD",
    "paymentMethods": ["credit-card", "paypal", "bank-transfer"]
  }
}
```

### Update Donation Configuration (Admin Only)
```http
PUT /bck/donation-config
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Page Settings

### Get All Page Settings (Public)
```http
GET /bck/page-settings
```

### Get Page Settings by Name (Public)
```http
GET /bck/page-settings/:pageName
```

**Example:**
```http
GET /bck/page-settings/home
GET /bck/page-settings/about
GET /bck/page-settings/contact
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pageName": "home",
    "title": {
      "en": "Home Page Title",
      "per": "عنوان صفحه اصلی",
      "ps": "د کور پاڼې سرلیک"
    },
    "heroImage": {
      "url": "/includes/images/page_settings/2024/12/hero.jpg"
    },
    "bodyImage": {
      "url": "/includes/images/page_settings/2024/12/body.jpg"
    },
    "metadata": { ... }
  }
}
```

### Create or Update Page Settings (Admin Only)
```http
POST /bck/page-settings
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
data: {
  "pageName": "home",
  "title": { "en": "...", "per": "...", "ps": "..." },
  "metadata": { ... }
}
images: <files> (multiple images, max 10)
```

### Update Hero Image (Admin Only)
```http
PUT /bck/page-settings/:pageName/hero-image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Update Body Image (Admin Only)
```http
PUT /bck/page-settings/:pageName/body-image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Page Settings (Admin Only)
```http
DELETE /bck/page-settings/:pageName
Authorization: Bearer <token>
```

---

## Support & Contact

For API support or questions:
- Email: admin@mmo.org.af
- Backend API: https://backend.mmo.org.af/bck
- Health Check: `GET /bck/health`

---

**Last Updated:** December 10, 2025  
**API Version:** 1.0.0

