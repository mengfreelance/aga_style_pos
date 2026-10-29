# StylePOS - Clothes Shop POS System

StylePOS is a web-based Point of Sale (POS) and inventory management system designed for clothing stores. It helps administrators manage products, track inventory, process sales, generate receipts, and monitor business performance in one centralized system.

## 1. Project Objectives

- Simplify clothing store sales and checkout.
- Manage clothing products, categories, brands, sizes, and colors.
- Track inventory and stock movements.
- Manage suppliers, purchases, and customers.
- Generate sales receipts and invoices.
- View sales reports and business expenses.
- Support USD and KHR currencies.
- Provide secure, admin-only system access.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| PHP | Backend development |
| PHP MVC Pattern | Organize backend code into Model, View, and Controller responsibilities |
| React.js | Frontend user interface |
| Tailwind CSS | Responsive UI styling |
| MySQL | Database and persistent data storage |
| REST API | Communication between React and PHP |
| Git & GitHub | Version control |

## 3. System Architecture

StylePOS uses a separated frontend and backend architecture. React handles the user interface, PHP follows the MVC pattern to process business logic, and MySQL stores application data.

```text
                 ADMIN
                   |
                   v
        +----------------------+
        |   React Frontend     |
        |  React + Tailwind CSS|
        +----------------------+
                   |
                   | HTTP Requests / JSON
                   v
        +----------------------+
        |     PHP Backend      |
        |      MVC Pattern     |
        +----------------------+
                   |
          +--------+--------+
          |        |        |
          v        v        v
       Models   Controllers Routes
          |        ^
          |        |
          v        |
        +----------------------+
        |      MySQL Database  |
        |    stylepos_db       |
        +----------------------+
```

### MVC Architecture

**Model**
- Handles database operations through PHP and PDO.
- Retrieves and stores products, sales, purchases, and inventory records.
- Defines data access and persistence logic.

**View**
- In this project, React and Tailwind CSS provide the actual frontend UI.
- Displays dashboards, forms, product lists, checkout screens, and reports.
- Communicates with the backend through REST API requests.

**Controller**
- Receives and validates API requests.
- Applies business rules and coordinates Models.
- Handles authentication, checkout, stock updates, and reporting responses.

**Important:** React is a separate frontend application, so it serves as the View layer rather than traditional PHP-rendered View files. PHP MVC manages backend request handling and business logic.

### Request Flow

1. The admin performs an action in the React interface.
2. React sends an HTTP request to a PHP API endpoint.
3. A PHP Controller validates the request and checks authorization.
4. The Controller calls the appropriate Model.
5. The Model reads or updates data in MySQL.
6. PHP returns a JSON response.
7. React updates the interface with the result.

## 4. Main System Features

### Admin Authentication
- Admin login and logout.
- Secure password hashing.
- Protected routes and API endpoints.
- Admin-only access to management functions.

### Dashboard
- Today's sales and revenue.
- Total products and stock quantity.
- Low-stock alerts.
- Best-selling products.
- Sales charts and summaries.

### Product Management
- Create, view, update, and delete products.
- Manage categories and brands.
- Manage sizes, colors, SKUs, and barcodes.
- Set cost prices and selling prices.
- Upload product images.

### Inventory Management
- Track stock by product variant.
- Receive stock from suppliers.
- Record stock adjustments and damaged items.
- Monitor low-stock products.
- View stock movement history.

### POS Checkout
- Search products by name or barcode.
- Add products to the shopping cart.
- Select size and color variants.
- Update quantities and apply discounts.
- Calculate totals and payment change.
- Support USD and KHR payments.
- Generate receipts and invoices.

### Supplier Management
- Store supplier details.
- Manage stock purchases.
- Record purchase items and costs.
- Update inventory when purchases are received.

### Customer Management
- Store customer information.
- Search customers by name or phone.
- View customer purchase history.

### Sales Management
- View sales history and invoice details.
- Search and filter transactions.
- Record returns and refunds.
- Track payment information.

### Reports & Expenses
- Daily, weekly, and monthly sales reports.
- Revenue and gross profit reports.
- Best-selling products.
- Inventory reports.
- Operating expense tracking.
- Export reports to CSV or Excel.

### Currency Management
- Support USD and KHR.
- Store the currency used for each transaction.
- Maintain transaction-specific exchange rates.
- Calculate payment amounts and change consistently.

## 5. Database Design

**Database name:** `stylepos_db`

### Core Tables (10)
1. `users` - Admin account information.
2. `categories` - Clothing categories.
3. `brands` - Clothing brands.
4. `products` - General product information.
5. `product_variants` - Product sizes, colors, SKUs, prices, and stock.
6. `customers` - Customer information.
7. `sales` - Sales transactions and invoices.
8. `sale_items` - Individual products sold.
9. `payments` - Payment methods, currencies, and amounts.
10. `stock_movements` - Inventory increases, decreases, and adjustments.

## 6. Core Business Workflow

```text
Admin Login
    |
    v
Manage Products
    |
    v
Receive Stock
    |
    v
Process POS Sale
    |
    v
Record Payment
    |
    v
Update Inventory
    |
    v
Generate Receipt
    |
    v
View Sales Reports
```

## 7. Suggested Project Structure

```text
stylepos/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Middleware/
│   │   └── Core/
│   ├── config/
│   │   └── database.php
│   ├── routes/
│   │   └── api.php
│   ├── public/
│   │   └── index.php
│   ├── storage/
│   └── .env
│
├── database/
│   ├── migrations/
│   └── seeders/
│
├── .gitignore
└── README.md
```

## 8. Security & Data Integrity

- Use PHP password hashing for admin credentials.
- Use PDO prepared statements to prevent SQL injection.
- Validate and sanitize input on the backend.
- Protect API endpoints with authentication and authorization.
- Store database credentials in environment variables.
- Use database transactions for checkout and inventory updates.
- Prevent stock from becoming negative.
- Preserve historical prices and exchange rates on completed transactions.
- Record important inventory changes and administrative actions.

## 9. Development Roadmap

1. Set up the React frontend, PHP backend, and MySQL database.
2. Implement the database schema and admin authentication.
3. Build product, category, brand, and variant management.
4. Implement supplier management and stock receiving.
5. Develop POS checkout, payments, and receipt generation.
6. Add customers, sales history, returns, and expenses.
7. Build dashboard charts and sales reports.
8. Test business rules, security, and responsive layouts.

## 10. Project Goal

The goal of StylePOS is to deliver a practical, maintainable, and responsive clothing store management system using React, Tailwind CSS, PHP MVC, and MySQL.

The project is intended as a medium-level portfolio project that demonstrates frontend development, backend architecture, REST API integration, relational database design, inventory management, and real-world POS business logic.
