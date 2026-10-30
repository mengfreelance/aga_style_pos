<?php

namespace StylePOS\Controllers;

use StylePOS\Core\Controller;
use StylePOS\Models\Product;
use StylePOS\Models\Category;
use StylePOS\Models\Brand;

class ProductController extends Controller
{
    public function index()
    {
        $this->requireAuth();
        $productModel = new Product($this->db);
        $products = $productModel->all();
        // Add full image URL
        $products = array_map(function ($p) {
            if (!empty($p['image'])) {
                $p['image_url'] = $this->getImageUrl($p['image']);
            }
            return $p;
        }, $products);
        $this->json($products);
    }

    public function show(int $id)
    {
        $this->requireAuth();
        $productModel = new Product($this->db);
        $product = $productModel->find($id);
        if (!$product) {
            $this->json(['error' => 'Product not found'], 404);
        }
        if (!empty($product['image'])) {
            $product['image_url'] = $this->getImageUrl($product['image']);
        }
        $this->json($product);
    }

    public function store()
    {
        $this->requireAuth();

        // Handle multipart form data
        $name        = $_POST['name'] ?? '';
        $category_id = $_POST['category_id'] ?? null;
        $brand_id    = $_POST['brand_id'] ?? null;
        $description = $_POST['description'] ?? '';
        $cost_price  = $_POST['cost_price'] ?? 0;

        if ($name === '') {
            $this->json(['error' => 'Missing required field: name'], 400);
        }

        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imagePath = $this->uploadImage($_FILES['image'], 'products');
        }

        $productModel = new Product($this->db);
        $id = $productModel->create([
            'name'        => $name,
            'category_id' => $category_id,
            'brand_id'    => $brand_id,
            'description' => $description,
            'cost_price'  => $cost_price,
            'image'       => $imagePath,
            'created_at'  => date('Y-m-d H:i:s'),
        ]);
        $this->json(['id' => $id, 'message' => 'Product created'], 201);
    }

    public function update(int $id)
    {
        $this->requireAuth();

        $name        = $_POST['name'] ?? '';
        $category_id = $_POST['category_id'] ?? null;
        $brand_id    = $_POST['brand_id'] ?? null;
        $description = $_POST['description'] ?? '';
        $cost_price  = $_POST['cost_price'] ?? 0;

        $productModel = new Product($this->db);
        $product = $productModel->find($id);
        if (!$product) {
            $this->json(['error' => 'Product not found'], 404);
        }

        $imagePath = $product['image'];
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            // Delete old image
            if (!empty($product['image'])) {
                $this->deleteImage($product['image']);
            }
            $imagePath = $this->uploadImage($_FILES['image'], 'products');
        }

        $productModel->update($id, [
            'name'        => $name,
            'category_id' => $category_id,
            'brand_id'    => $brand_id,
            'description' => $description,
            'cost_price'  => $cost_price,
            'image'       => $imagePath,
        ]);
        $this->json(['message' => 'Product updated']);
    }

    public function destroy(int $id)
    {
        $this->requireAuth();
        $productModel = new Product($this->db);
        $product = $productModel->find($id);
        if (!$product) {
            $this->json(['error' => 'Product not found'], 404);
        }
        if (!empty($product['image'])) {
            $this->deleteImage($product['image']);
        }
        $productModel->delete($id);
        $this->json(['message' => 'Product deleted']);
    }

    private function uploadImage(array $file, string $folder): string
    {
        $uploadDir = __DIR__ . '/../../public/uploads/' . $folder . '/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('img_', true) . '.' . $ext;
        $destination = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return 'uploads/' . $folder . '/' . $filename;
        }

        return null;
    }

    private function deleteImage(string $imagePath): void
    {
        $fullPath = __DIR__ . '/../../public/' . $imagePath;
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }

    private function getImageUrl(string $imagePath): string
    {
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
        return $baseUrl . '/' . $imagePath;
    }
}
