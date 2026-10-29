# StylePOS Setup Guide

## Prerequisites

- **PHP 8.2+** (with PDO MySQL extension)
- **MariaDB/MySQL 8.0+**
- **Node.js 18+** and npm
- **Composer** (optional — not used; classes loaded via manual `require_once`)

## 1. Clone / Open the Project

```powershell
cd D:\StylePOS
```

## 2. Database Setup

### Create the database and tables

```powershell
mysql -u root -p stylepos_db < database\schema.sql
```

If the database doesn't exist yet, create it first:
```powershell
mysql -u root -p -e "CREATE DATABASE stylepos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p stylepos_db < database\schema.sql
```

**Existing databases:** If you already have a `users` table without the `token` column, run:
```powershell
mysql -u root -p stylepos_db -e "ALTER TABLE users ADD COLUMN token VARCHAR(255) AFTER image;"
```

### Import seed data (clothing products, categories, brands, admin user)

```powershell
mysql -u root -p stylepos_db < database\seeders\seed.sql
```

**Default admin account:**
- Email: `admin@stylepos.com`
- Password: `password`

## 3. Backend (PHP)

From the `backend` directory:

```powershell
cd D:\StylePOS\backend
php -S localhost:8000 -t public
```

The API will be available at `http://localhost:8000`.

### Backend Configuration

Edit `backend\config\database.php` or set environment variables:

| Env Var | Default | Description |
|---------|---------|-------------|
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_NAME` | `stylepos_db` | Database name |
| `DB_USER` | `root` | MySQL username |
| `DB_PASS | `` (empty) | MySQL password |

### CORS

`backend\public\index.php` allows CORS from `localhost:5173`, `5174`, `5175`. Add your frontend port to the `$allowedOrigins` array if needed.

## 4. Frontend (React + Vite)

From the `frontend` directory:

```powershell
cd D:\StylePOS\frontend
npm install
npm run dev -- --port 5173
```

The app will be available at `http://localhost:5173`.

### Frontend Configuration

Create/edit `frontend\.env`:

```env
VITE_API_URL=http://localhost:8000
```

## 5. Verify Installation

1. Open `http://localhost:5173` — should show the login page
2. Log in with `admin@stylepos.com` / `password`
3. You should be redirected to the dashboard
4. Navigate to Settings to view/edit your profile
5. Test API directly: `curl http://localhost:8000/api/products`

## 6. Project Ports

| Service | Port | Command |
|---------|------|---------|
| Backend API | 8000 | `php -S localhost:8000 -t public` |
| Frontend Dev | 5173 | `npm run dev -- --port 5173` |

## 7. Troubleshooting

### "User not found" on Settings page

The seed data must be imported so user ID `1` exists. `AuthMiddleware` hardcodes the authenticated user ID to `1`.

```powershell
mysql -u root -p stylepos_db < database\seeders\seed.sql
```

### CORS errors

Add your frontend port to `$allowedOrigins` in `backend\public\index.php`, then restart the PHP server.

### 404 on API endpoints

Ensure the PHP server is running from the `backend/` directory with `-t public`:
```powershell
php -S localhost:8000 -t public
```

### Token not persisted

Login stores the token in `localStorage` as `stylepos_token`. Clear browser storage or log out and back in if auth issues persist.

## 8. Directory Permissions (Windows)

Ensure the PHP process can write to `backend/public/uploads/` for image uploads:

```powershell
# From backend directory
mkdir public\uploads\products
mkdir public\uploads\variants
mkdir public\uploads\users
```

## 9. Rebuilding from Scratch

To reset everything:

```powershell
mysql -u root -p -e "DROP DATABASE stylepos_db; CREATE DATABASE stylepos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p stylepos_db < database\schema.sql
mysql -u root -p stylepos_db < database\seeders\seed.sql
```

Then restart both servers.
