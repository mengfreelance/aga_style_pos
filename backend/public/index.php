<?php

namespace StylePOS\Core;

// CORS headers for frontend dev server
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../app/Core/Database.php';
require_once __DIR__ . '/../app/Core/Router.php';
require_once __DIR__ . '/../app/Core/Controller.php';
require_once __DIR__ . '/../app/Core/Model.php';

require_once __DIR__ . '/../app/Middleware/AuthMiddleware.php';

require_once __DIR__ . '/../app/Models/User.php';
require_once __DIR__ . '/../app/Models/Category.php';
require_once __DIR__ . '/../app/Models/Brand.php';
require_once __DIR__ . '/../app/Models/Product.php';
require_once __DIR__ . '/../app/Models/ProductVariant.php';
require_once __DIR__ . '/../app/Models/Customer.php';
require_once __DIR__ . '/../app/Models/Sale.php';
require_once __DIR__ . '/../app/Models/SaleItem.php';
require_once __DIR__ . '/../app/Models/Payment.php';
require_once __DIR__ . '/../app/Models/StockMovement.php';

require_once __DIR__ . '/../app/Controllers/AuthController.php';
require_once __DIR__ . '/../app/Controllers/ProductController.php';
require_once __DIR__ . '/../app/Controllers/CategoryController.php';
require_once __DIR__ . '/../app/Controllers/BrandController.php';
require_once __DIR__ . '/../app/Controllers/VariantController.php';
require_once __DIR__ . '/../app/Controllers/CustomerController.php';
require_once __DIR__ . '/../app/Controllers/SaleController.php';
require_once __DIR__ . '/../app/Controllers/ReportController.php';

use StylePOS\Core\Database;
use StylePOS\Core\Router;
use StylePOS\Controllers\AuthController;
use StylePOS\Controllers\ProductController;
use StylePOS\Controllers\CategoryController;
use StylePOS\Controllers\BrandController;
use StylePOS\Controllers\VariantController;
use StylePOS\Controllers\CustomerController;
use StylePOS\Controllers\SaleController;
use StylePOS\Controllers\ReportController;
use StylePOS\Middleware\AuthMiddleware;

$config = require __DIR__ . '/../config/database.php';
$db = new Database($config);
$router = new Router();

$router->middleware('auth', [AuthMiddleware::class, 'handle']);
AuthMiddleware::init($db);

$auth = new AuthController($db);
$products = new ProductController($db);
$categories = new CategoryController($db);
$brands = new BrandController($db);
$variants = new VariantController($db);
$customers = new CustomerController($db);
$sales = new SaleController($db);
$reports = new ReportController($db);

require __DIR__ . '/../routes/api.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

$router->resolve($method, $uri);
