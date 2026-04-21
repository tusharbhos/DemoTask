# Admin Panel — React + Node.js + MySQL + Laravel

A full-stack admin panel with location management (States & Cities), JWT authentication, and a public REST API.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Bootstrap 5, Purple Dash Theme |
| Backend API | Node.js, Express.js, MySQL2, JWT |
| Database | MySQL 8.x |
| Public API | Laravel 11 (PHP) |

---

## Project Structure

```
demo1/
├── database/
│   └── schema.sql              ← MySQL database schema + seed data
├── backend/                    ← Node.js + Express REST API (Port 5000)
│   ├── config/
│   │   └── db.js               ← MySQL connection pool
│   ├── controllers/
│   │   ├── auth.controller.js  ← Login, get profile
│   │   ├── state.controller.js ← State CRUD
│   │   └── city.controller.js  ← City CRUD
│   ├── middleware/
│   │   ├── auth.js             ← JWT verification
│   │   └── validate.js         ← express-validator error handler
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── state.routes.js
│   │   └── city.routes.js
│   ├── utils/
│   │   └── responseHelper.js   ← Unified JSON responses
│   ├── server.js               ← Express app entry point
│   ├── package.json
│   └── .env                    ← DB credentials, JWT secret
├── frontend/                   ← React.js Admin Panel (Port 3000)
│   └── src/
│       ├── api/
│       │   └── axiosInstance.js   ← Axios + JWT interceptor
│       ├── assets/css/
│       │   └── purple-theme.css   ← Purple admin theme styles
│       ├── components/
│       │   ├── common/            ← Reusable: Spinner, Pagination, StatusBadge, etc.
│       │   └── layout/            ← Sidebar, Navbar, MainLayout
│       ├── context/
│       │   └── AuthContext.js     ← Global auth state
│       ├── hooks/
│       │   └── useDebounce.js     ← 400ms search debounce
│       ├── pages/
│       │   ├── auth/Login.js
│       │   ├── dashboard/Dashboard.js
│       │   ├── states/            ← StateList, StateFormPage
│       │   └── cities/            ← CityList, CityFormPage
│       └── App.js                 ← Routes setup
└── laravel-api/                ← Laravel Public API (Port 8000)
     ├── app/
     │   ├── Http/
     │   │   ├── Controllers/Api/
     │   │   │   └── LocationController.php
     │   │   └── Resources/
     │   │       ├── StateResource.php
     │   │       └── CityResource.php
     │   └── Models/
     │       ├── State.php
     │       └── City.php
     └── routes/
         └── api.php

```

---

## Prerequisites

Make sure the following are installed before proceeding:

| Requirement | Version | Download |
|-------------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | Included with Node.js |
| PHP | v8.2+ | https://www.php.net |
| Composer | v2+ | https://getcomposer.org |
| MySQL | v8.x | https://dev.mysql.com/downloads |
| Git | Any | https://git-scm.com |

---

## Step-by-Step Setup Guide

### Step 1 — Clone / Open the Project

```bash
# If cloning from GitHub
git clone <your-repo-url>
cd demo1

# Or just open the folder you already have
cd E:\tushar\demo1
```

---

### Step 2 — Set Up the Database

1. Open **MySQL Workbench** or **phpMyAdmin** or your MySQL CLI
2. Run the schema file to create the database, tables, and seed admin user:

```sql
-- In MySQL CLI:
mysql -u root -p < database/schema.sql

-- OR copy-paste the contents of database/schema.sql into MySQL Workbench and execute
```

This creates:
- Database: `admin_panel`
- Tables: `admins`, `states`, `cities`
- Default admin user: `admin@demo.com` / `Admin@123`

---

### Step 3 — Configure & Start the Backend (Node.js)

**3a. Set environment variables**

Open `backend/.env` and update your MySQL password:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE    ← Change this
DB_NAME=admin_panel
JWT_SECRET=AdminPanelSuperSecretKey2024ChangeThisInProduction
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

**3b. Install dependencies**

```bash
cd backend
npm install
```

**3c. Start the server**

```bash
# Development (auto-restarts on file change)
npm run dev

# Production
npm start
```

You should see:
```
✅ MySQL connected successfully
🚀 Server running on http://localhost:5000
```

---

### Step 4 — Configure & Start the Frontend (React)

**4a. Environment (already configured)**

`frontend/.env` contains:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**4b. Install dependencies**

```bash
cd frontend
npm install
```

**4c. Start the React app**

```bash
npm start
```

Browser opens automatically at **http://localhost:3000**

---

### Step 5 — Configure & Start the Laravel Public API

**5a. Set environment variables**

Open `laravel-api/.env` and update your MySQL password:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=admin_panel
DB_USERNAME=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE    ← Change this
```

**5b. Install dependencies** *(skip if vendor/ already exists)*

```bash
cd laravel-api
composer install
```

**5c. Generate app key** *(skip if APP_KEY already set in .env)*

```bash
php artisan key:generate
```

**5d. Start the Laravel server**

```bash
php artisan serve --port=8000
```

API is live at **http://localhost:8000**

---

## Running All Services (Quick Start)

Open **3 separate terminal windows** and run one command in each:

| Terminal | Command |
|----------|---------|
| Terminal 1 — Backend | `cd backend && npm run dev` |
| Terminal 2 — Frontend | `cd frontend && npm start` |
| Terminal 3 — Laravel API | `cd laravel-api && php artisan serve --port=8000` |



## Port Summary

| Service | Port | URL |
|---------|------|-----|
| React Frontend | 3000 | http://localhost:3000 |
| Node.js Backend | 5000 | http://localhost:5000 |
| Laravel Public API | 8000 | http://localhost:8000 |
| MySQL | 3306 | localhost:3306 |

---

## Default Login Credentials

```
Email:    admin@demo.com
Password: Admin@123
```

---

## Features

### Task 1 — Admin Panel UI
- Purple Bootstrap Dash theme (dark sidebar, gradient buttons)
- Fully responsive layout
- Dashboard with live stats (total/active states & cities)

### Task 2 — Admin Authentication
- Login with email + password
- Client-side validation (email format, min 6 chars password)
- Server-side validation with express-validator
- JWT token (24h expiry) stored in localStorage
- Password show/hide toggle
- Auto-logout when token expires (401 interceptor)
- Rate limiting: 15 login attempts per 15 minutes

### Task 3 — Location Management (CRUD)

**States:**
- Fields: State Name, Status (Active / Inactive)
- Create, Read (list), Update, Delete
- Auto-search with 400ms debounce
- Pagination (10 per page)
- Status filter (All / Active / Inactive)
- Delete guard — cannot delete a state that has cities

**Cities:**
- Fields: State (dropdown — only Active states shown), City Name, Status
- Create, Read (list), Update, Delete
- Auto-search + State filter + Status filter
- Pagination
- Clicking a state name in the city list filters by that state

### Task 4 — Public Laravel API
- No authentication required
- Returns only Active states and Active cities
- Open CORS (accessible from any origin)

---

## API Reference

### Node.js Backend API (Port 5000)

#### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login, returns JWT token |
| GET | `/api/auth/me` | Yes | Get logged-in admin profile |

**Login Request:**
```json
POST /api/auth/login
{
  "email": "admin@demo.com",
  "password": "Admin@123"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": { "id": 1, "name": "Super Admin", "email": "admin@demo.com" }
}
```

---

#### States (All require `Authorization: Bearer <token>` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/states` | List states (search, pagination, status filter) |
| GET | `/api/states/all-active` | All active states (for dropdowns) |
| GET | `/api/states/:id` | Get single state |
| POST | `/api/states` | Create state |
| PUT | `/api/states/:id` | Update state |
| DELETE | `/api/states/:id` | Delete state |

**Query Parameters for GET /api/states:**
```
?search=maharashtra    → search by name
?page=1&limit=10       → pagination
?status=Active         → filter by status
```

**Create/Update State Body:**
```json
{
  "state_name": "Maharashtra",
  "status": "Active"
}
```

---

#### Cities (All require `Authorization: Bearer <token>` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cities` | List cities (search, pagination, filter) |
| GET | `/api/cities/:id` | Get single city |
| POST | `/api/cities` | Create city |
| PUT | `/api/cities/:id` | Update city |
| DELETE | `/api/cities/:id` | Delete city |

**Query Parameters for GET /api/cities:**
```
?search=mumbai         → search by city name
?state_id=1            → filter by state
?page=1&limit=10       → pagination
?status=Active         → filter by status
```

**Create/Update City Body:**
```json
{
  "state_id": 1,
  "city_name": "Mumbai",
  "status": "Active"
}
```

---

### Laravel Public API (Port 8000)

> No authentication required. All endpoints are public and read-only.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | All active states with their active cities |
| GET | `/api/locations/states` | All active states only (no cities) |
| GET | `/api/locations/states/{id}/cities` | Active cities for a specific state |

**GET /api/locations — Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "state_name": "Maharashtra",
      "cities": [
        { "id": 10, "city_name": "Mumbai" },
        { "id": 11, "city_name": "Pune" }
      ]
    },
    {
      "id": 2,
      "state_name": "Gujarat",
      "cities": [
        { "id": 20, "city_name": "Ahmedabad" }
      ]
    }
  ],
  "total_states": 2,
  "generated_at": "2026-04-21T10:00:00.000Z"
}
```

**GET /api/locations/states — Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "state_name": "Gujarat" },
    { "id": 2, "state_name": "Maharashtra" }
  ],
  "total": 2
}
```

**GET /api/locations/states/1/cities — Response:**
```json
{
  "success": true,
  "state": "Maharashtra",
  "state_id": 1,
  "data": [
    { "id": 10, "city_name": "Mumbai" },
    { "id": 11, "city_name": "Pune" }
  ],
  "total": 2
}
```

---

## Database Schema

```sql
-- admins
CREATE TABLE admins (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(191) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,   -- bcrypt hashed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- states
CREATE TABLE states (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  state_name VARCHAR(100) NOT NULL,
  status     ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_state_name (state_name)
);

-- cities
CREATE TABLE cities (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  state_id   INT UNSIGNED NOT NULL,
  city_name  VARCHAR(100) NOT NULL,
  status     ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_city_per_state (state_id, city_name),
  FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE RESTRICT
);
```

---

## Validation Rules

### Server-side (Node.js)

| Field | Rules |
|-------|-------|
| `email` | Required, valid email format |
| `password` | Required, minimum 6 characters |
| `state_name` | Required, 2–100 characters, unique |
| `state.status` | Required, must be `Active` or `Inactive` |
| `state_id` (city) | Required, must be an existing **Active** state |
| `city_name` | Required, 2–100 characters, unique per state |
| `city.status` | Required, must be `Active` or `Inactive` |

### Client-side (React)
- All fields validated before API call
- Field-level error messages shown inline
- Errors cleared when user starts typing

---

## Common Issues & Fixes

### CORS Error on Login
**Error:** `Access-Control-Allow-Origin` mismatch

**Fix:** The backend CORS config in `server.js` already includes `http://localhost:3000` as a hardcoded allowed origin. If you still face issues, restart the backend.

---

### MySQL Connection Failed
**Error:** `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`

**Fix:**
1. Make sure MySQL service is running
2. Check `DB_PASSWORD` in `backend/.env` matches your MySQL root password
3. Verify database `admin_panel` exists (run schema.sql again)

---

### Laravel: `APP_KEY` not set
**Error:** `No application encryption key has been specified`

**Fix:**
```bash
cd laravel-api
php artisan key:generate
```

---

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Fix:**
```bash
# Windows — find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Then restart the backend
npm run dev
```

---

## Environment Variables Reference

### backend/.env
```env
PORT=5000                          # Node.js server port
DB_HOST=localhost                  # MySQL host
DB_PORT=3306                       # MySQL port
DB_USER=root                       # MySQL username
DB_PASSWORD=                       # MySQL password ← SET THIS
DB_NAME=admin_panel                # Database name
JWT_SECRET=<long-random-string>    # JWT signing secret ← CHANGE IN PRODUCTION
JWT_EXPIRES_IN=24h                 # Token expiry
FRONTEND_URL=http://localhost:3000 # Allowed CORS origin
```

### laravel-api/.env
```env
APP_NAME=LocationAPI
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=admin_panel
DB_USERNAME=root
DB_PASSWORD=                       # ← SET THIS (same as backend)
```

### frontend/.env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Security Notes

- Passwords are hashed with **bcrypt** (10 rounds) — never stored as plain text
- JWT tokens expire after **24 hours**
- Login endpoint is **rate-limited** (15 requests per 15 minutes per IP)
- HTTP security headers added via **Helmet.js**
- SQL injection prevented via **parameterized queries** (mysql2)
- State deletion is **guarded** — cannot delete a state that has cities

---

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| backend | `npm run dev` | Start with nodemon (auto-reload) |
| backend | `npm start` | Start in production mode |
| frontend | `npm start` | Start React dev server |
| frontend | `npm run build` | Build for production |
| laravel-api | `php artisan serve --port=8000` | Start Laravel dev server |
| laravel-api | `php artisan route:list` | List all API routes |

---

## License

MIT
