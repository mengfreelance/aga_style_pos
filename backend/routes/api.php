<?php

// API route definitions
// Requires (from including file): $router, $auth, $products, $categories, $brands,
// $variants, $customers, $sales, $reports, $AUTH

/** @var \StylePOS\Core\Router $router */
/** @var \StylePOS\Controllers\AuthController $auth */
/** @var \StylePOS\Controllers\ProductController $products */
/** @var \StylePOS\Controllers\CategoryController $categories */
/** @var \StylePOS\Controllers\BrandController $brands */
/** @var \StylePOS\Controllers\VariantController $variants */
/** @var \StylePOS\Controllers\CustomerController $customers */
/** @var \StylePOS\Controllers\SaleController $sales */
/** @var \StylePOS\Controllers\ReportController $reports */
/** @var array<string> $AUTH */

$AUTH = ['auth'];

// Public routes (no auth required)
$router->post('/api/auth/login', [$auth, 'login']);
$router->post('/api/auth/logout', [$auth, 'logout']);
$router->post('/api/auth/register', [$auth, 'store']);
$router->get('/api/auth/me', [$auth, 'me'], $AUTH);
$router->post('/api/auth/update-profile-image', [$auth, 'updateProfileImage'], $AUTH);
$router->put('/api/auth/update-profile', [$auth, 'updateProfile'], $AUTH);

// User management (protected)
$router->delete('/api/users/{id}', [$auth, 'destroy'], $AUTH);

$router->get('/api/products', [$products, 'index'], $AUTH);
$router->post('/api/products', [$products, 'store'], $AUTH);
$router->get('/api/products/{id}', [$products, 'show'], $AUTH);
$router->put('/api/products/{id}', [$products, 'update'], $AUTH);
$router->delete('/api/products/{id}', [$products, 'destroy'], $AUTH);

$router->get('/api/categories', [$categories, 'index'], $AUTH);
$router->get('/api/categories/{id}', [$categories, 'show'], $AUTH);
$router->post('/api/categories', [$categories, 'store'], $AUTH);
$router->put('/api/categories/{id}', [$categories, 'update'], $AUTH);
$router->delete('/api/categories/{id}', [$categories, 'destroy'], $AUTH);

$router->get('/api/brands', [$brands, 'index'], $AUTH);
$router->get('/api/brands/{id}', [$brands, 'show'], $AUTH);
$router->post('/api/brands', [$brands, 'store'], $AUTH);
$router->put('/api/brands/{id}', [$brands, 'update'], $AUTH);
$router->delete('/api/brands/{id}', [$brands, 'destroy'], $AUTH);

$router->get('/api/variants', [$variants, 'index'], $AUTH);
$router->post('/api/variants', [$variants, 'store'], $AUTH);
$router->get('/api/variants/{id}', [$variants, 'show'], $AUTH);
$router->put('/api/variants/{id}', [$variants, 'update'], $AUTH);
$router->delete('/api/variants/{id}', [$variants, 'destroy'], $AUTH);

$router->get('/api/customers', [$customers, 'index'], $AUTH);
$router->get('/api/customers/search', [$customers, 'search'], $AUTH);
$router->post('/api/customers', [$customers, 'store'], $AUTH);
$router->get('/api/customers/{id}', [$customers, 'show'], $AUTH);
$router->put('/api/customers/{id}', [$customers, 'update'], $AUTH);
$router->delete('/api/customers/{id}', [$customers, 'destroy'], $AUTH);

$router->get('/api/sales', [$sales, 'index'], $AUTH);
$router->post('/api/sales', [$sales, 'store'], $AUTH);
$router->get('/api/sales/{id}', [$sales, 'show'], $AUTH);
$router->put('/api/sales/{id}', [$sales, 'update'], $AUTH);
$router->delete('/api/sales/{id}', [$sales, 'destroy'], $AUTH);

$router->get('/api/reports/dashboard', [$reports, 'dashboard'], $AUTH);
$router->get('/api/reports/sales', [$reports, 'sales'], $AUTH);
