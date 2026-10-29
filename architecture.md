# StylePOS Architecture

## Overview

StylePOS is a separated frontend/backend web application for clothing store point-of-sale operations. React handles the UI, PHP (MVC pattern) handles backend business logic, and MySQL stores all data.

## Project Structure

```
D:\StylePOS\
├── backend/
│   ├── public/
│   │   └── index.php           # Entry point, bootstraps app, resolves routes
│   ├── public/uploads/
│   │   ├── products/           # Product image uploads
│   │   ├── variants/           # Variant image uploads
│   │   └── users/              # User avatar uploads
│   ├── app/
│   │   ├── Core/
│   │   │   ├── Database.php    # PDO database connection
│   │   │   ├── Router.php      # Simple URL router (method + path matching)
│   │   │   ├── Controller.php  # Base controller with json(), getInput(), requireAuth()
│   │   │   └── Model.php       # Base model with CRUD (all, find, create, update, delete)
│   │   ├── Controllers/
│   │   │   ├── AuthController.php      # Login, logout, register, profile, me
│   │   │   ├── ProductController.php   # Product CRUD + image upload
│   │   │   ├── CategoryController.php  # Category CRUD
│   │   │   ├── BrandController.php     # Brand CRUD
│   │   │   ├── VariantController.php   # Product variant CRUD
│   │   │   ├── CustomerController.php  # Customer CRUD + search
│   │   │   ├── SaleController.php      # Sale CRUD
│   │   │   └── ReportController.php    # Dashboard + sales reports
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Product.php
│   │   │   ├── Category.php
│   │   │   ├── Brand.php
│   │   │   ├── ProductVariant.php
│   │   │   ├── Customer.php
│   │   │   ├── Sale.php
│   │   │   ├── SaleItem.php
│   │   │   ├── Payment.php
│   │   │   └── StockMovement.php
│   │   └── Middleware/
│   │       └── AuthMiddleware.php      # Bearer token validation (stub: always user ID 1)
│   ├── config/
│   │   └── database.php            # DB connection config (env vars with defaults)
│   └── routes/
│       └── api.php                 # All API route definitions
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── .env                        # VITE_API_URL=http://localhost:8000
│   ├── package.json
│   └── src/
│       ├── main.jsx                # React entry point
│       ├── App.jsx                 # Router: login vs dashboard pages
│       ├── services/
│       │   └── api.js              # Axios instance with Bearer token interceptor
│       └── components/
│           ├── Login.jsx
│           ├── Navbar.jsx
│           ├── Sidebar.jsx
│           ├── Dashboard.jsx
│           ├── Products.jsx
│           ├── Categories.jsx
│           ├── Brands.jsx
│           ├── Variants.jsx
│           ├── Customers.jsx
│           ├── Sales.jsx
│           ├── Reports.jsx
│           └── Settings.jsx
├── database/
│   ├── schema.sql                  # 10-table database schema
│   └── seeders/
│       └── seed.sql                # Clothing-focused seed data
└── README.md
```

## MVC Architecture

### Model Layer (`backend/app/Models/`)

Each model extends `StylePOS\Core\Model` and sets a `$table` property. Provides:
- `all()` — fetch all rows
- `find($id)` — fetch row by ID
- `create($data)` — insert row, returns last insert ID
- `update($id, $data)` — update row by ID
- `delete($id)` — delete row by ID

All queries use PDO prepared statements to prevent SQL injection.

### Controller Layer (`backend/app/Controllers/`)

Each controller extends `StylePOS\Core\Controller` and receives a `Database` instance. Provides:
- `json($data, $status)` — sends JSON response
- `getInput()` — parses JSON body from `php://input`
- `requireFields($input, $fields)` — validates required fields
- `validateEmail($email)` — email format validation
- `currentUserId()` — returns authenticated user ID from AuthMiddleware
- `requireAuth()` — returns 401 if not authenticated

### Router Layer (`backend/app/Core/Router.php`)

Simple router that matches HTTP method + URI path. Supports:
- Static routes: `GET /api/products`
- Parameterized routes: `GET /api/products/{id}`
- Middleware per route (e.g., `auth`)

Route resolution order:
1. Exact match on method + path
2. Parameterized route match (same part count, `{param}` placeholders)
3. 404 if no match

### Auth Middleware (`backend/app/Middleware/AuthMiddleware.php`)

- Reads `Authorization: Bearer <token>` header
- Validates token format (regex: `^Bearer\s+(\S+)$`, min 10 chars)
- Sets `self::$userId` — currently hardcoded to `1` (stub, not validated against DB)
- Controllers call `$this->requireAuth()` which checks `AuthMiddleware::$userId !== null`

**Note:** Token is generated on login (`bin2hex(random_bytes(32))`) but is NOT validated against the database. Any token string with 10+ characters passes auth.

### Request Flow

```
1. React frontend sends HTTP request (GET/POST/PUT/DELETE) to PHP backend
2. backend/public/index.php bootstraps: loads DB, controllers, middleware, routes
3. Router matches method + URI to a controller action
4. AuthMiddleware runs (if route has 'auth' middleware) — validates Bearer token
5. Controller action executes business logic, calls Model
6. Model executes SQL against MySQL stylepos_db
7. Controller returns JSON response
8. React updates UI
```

## Image Upload

- Images stored as files in `backend/public/uploads/{folder}/`
- Database stores relative path (e.g., `uploads/users/user_abc123.jpg`)
- Full URL generated server-side via `getImageUrl()` (uses `$_SERVER['HTTP_HOST']`)
- Old images deleted on update/delete to avoid orphan files
- Frontend sends `multipart/form-data` for image uploads

## Authentication

- Login: `POST /api/auth/login` with `email` + `password`
- Password verified with `password_verify()` against bcrypt hash
- Token: `bin2hex(random_bytes(32))` returned in response
- Frontend stores token in `localStorage` as `stylepos_token`
- Axios interceptor attaches `Authorization: Bearer <token>` to every request
- 401 responses clear token and reload page

## Default Admin Account

| Field | Value |
|-------|-------|
| Email | `admin@stylepos.com` |
| Password | `password` |
| Role | `admin` |

Created by `database/seeders/seed.sql`.

## Ports

- Backend (PHP): `localhost:8000` — `php -S localhost:8000 -t public` (from `backend/` dir)
- Frontend (Vite): `localhost:5173` (default) — `npm run dev` (from `frontend/` dir)

## CORS

`backend/public/index.php` sets `Access-Control-Allow-Origin` for `localhost:5173`, `5174`, `5175`. Update this array if running the frontend on a different port.
