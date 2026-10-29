# StylePOS API Reference

Base URL: `http://localhost:8000`

All protected endpoints require an `Authorization: Bearer <token>` header.  
Token is obtained from `POST /api/auth/login` and stored in `localStorage` as `stylepos_token`.

## Authentication

### POST /api/auth/login
Authenticate admin user. Returns a Bearer token.

**Body (JSON):**
```json
{
  "email": "admin@stylepos.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "token": "82db962cc767...",
  "user": {
    "id": 1,
    "name": "System Admin",
    "email": "admin@stylepos.com",
    "role": "admin",
    "image": "http://localhost:8000/uploads/users/user_abc.jpg"
  }
}
```

**Errors:** `400` invalid email format, `401` invalid credentials.

---

### POST /api/auth/logout
Logout (requires auth).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "message": "Logged out" }
```

---

### POST /api/auth/register
Create a new admin user (requires auth, multipart/form-data).

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Unique username |
| email | string | Yes | Unique email |
| password | string | Yes | Plain text, hashed server-side |
| name | string | Yes | Full name |
| role | string | No | Default: `admin` |
| image | file | No | Profile image upload |

**Response (201):**
```json
{
  "id": 2,
  "username": "staff",
  "email": "staff@stylepos.com",
  "name": "Staff User",
  "role": "admin",
  "image": "http://localhost:8000/uploads/users/user_xyz.jpg",
  "message": "User created"
}
```

---

### GET /api/auth/me
Get current authenticated user profile (requires auth).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@stylepos.com",
    "role": "admin",
    "image": "http://localhost:8000/uploads/users/user_abc.jpg",
    "created_at": "2026-10-29 06:00:00"
  }
}
```

---

### PUT /api/auth/update-profile
Update current user's name and email (requires auth, JSON).

**Body (JSON):**
```json
{
  "name": "System Admin",
  "email": "admin@stylepos.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated",
  "user": { ... }
}
```

**Errors:** `409` email already exists, `404` user not found.

---

### POST /api/auth/update-profile-image
Upload/update profile image (requires auth, multipart/form-data).

**Form Field:**
| Field | Type | Description |
|-------|------|-------------|
| image | file | Profile image |

**Response (200):**
```json
{
  "message": "Profile image updated",
  "image": "http://localhost:8000/uploads/users/user_new.jpg"
}
```

---

### DELETE /api/users/{id}
Delete a user by ID (requires auth). Cannot delete yourself.

**Response (200):**
```json
{ "message": "User deleted" }
```

---

## Products

### GET /api/products
List all products. Image paths converted to full URLs (`image_url` field).

**Response (200):** Array of product objects.

---

### GET /api/products/{id}
Get a single product by ID.

**Response (200):** Product object with `image_url`.

---

### POST /api/products
Create a product (requires auth, multipart/form-data).

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Product name |
| category_id | int | No | References categories.id |
| brand_id | int | No | References brands.id |
| description | string | No | Product description |
| cost_price | decimal | No | Default: 0 |
| image | file | No | Product image upload |

**Response (201):**
```json
{ "id": 5, "message": "Product created" }
```

---

### PUT /api/products/{id}
Update a product (requires auth, multipart/form-data). Same fields as create. Old image deleted if new one uploaded.

---

### DELETE /api/products/{id}
Delete a product (requires auth). Image file also deleted.

---

## Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/{id}` | Get category by ID |
| POST | `/api/categories` | Create category (body: `{ "name": "..." }`) |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

All require auth. Category has: `id`, `name`, `created_at`.

---

## Brands

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/brands` | List all brands |
| GET | `/api/brands/{id}` | Get brand by ID |
| POST | `/api/brands` | Create brand (body: `{ "name": "..." }`) |
| PUT | `/api/brands/{id}` | Update brand |
| DELETE | `/api/brands/{id}` | Delete brand |

All require auth. Brand has: `id`, `name`, `created_at`.

---

## Product Variants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/variants` | List all variants |
| GET | `/api/variants/{id}` | Get variant by ID |
| POST | `/api/variants` | Create variant |
| PUT | `/api/variants/{id}` | Update variant |
| DELETE | `/api/variants/{id}` | Delete variant |

All require auth. Variant fields: `id`, `product_id`, `sku`, `size`, `color`, `selling_price`, `stock_quantity`, `image`, `created_at`.

---

## Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List all customers |
| GET | `/api/customers/search` | Search customers (query param) |
| GET | `/api/customers/{id}` | Get customer by ID |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/{id}` | Update customer |
| DELETE | `/api/customers/{id}` | Delete customer |

All require auth. Customer fields: `id`, `name`, `phone`, `email`, `address`, `created_at`.

---

## Sales

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | List all sales |
| POST | `/api/sales` | Create a sale |
| GET | `/api/sales/{id}` | Get sale by ID |
| PUT | `/api/sales/{id}` | Update sale |
| DELETE | `/api/sales/{id}` | Delete sale |

All require auth. Sale fields: `id`, `customer_id`, `total_amount`, `currency`, `exchange_rate`, `status`, `created_at`.

---

## Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/dashboard` | Dashboard summary stats |
| GET | `/api/reports/sales` | Sales report data |

All require auth.

---

## Error Response Format

All errors return JSON:
```json
{ "error": "Error message description" }
```

Common status codes:
- `200` — Success
- `201` — Created
- `400` — Bad request (missing/invalid fields)
- `401` — Unauthorized (missing/invalid token)
- `404` — Not found (route or resource)
- `409` — Conflict (duplicate email/username)

---

## Frontend API Service (`frontend/src/services/api.js`)

Axios instance with:
- Base URL from `VITE_API_URL` env var (default `http://localhost:8000`)
- Automatic `Authorization: Bearer <token>` header from `localStorage`
- Auto-redirect to login on `401` responses

Usage:
```js
import api from '../services/api';
api.get('/api/auth/me');
api.post('/api/products', { name: 'T-Shirt' });
api.put('/api/products/1', { name: 'Updated' });
api.delete('/api/products/1');
```

Image uploads use native `fetch` with `FormData` (not axios) to avoid content-type issues:
```js
const formData = new FormData();
formData.append('image', file);
fetch(`${API_BASE}/api/auth/update-profile-image`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
```
