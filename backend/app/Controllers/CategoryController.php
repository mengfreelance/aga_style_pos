<?php

namespace StylePOS\Controllers;

use StylePOS\Core\Controller;
use StylePOS\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $this->requireAuth();
        $categoryModel = new Category($this->db);
        $this->json($categoryModel->all());
    }

    public function show(int $id)
    {
        $this->requireAuth();
        $categoryModel = new Category($this->db);
        $category = $categoryModel->find($id);
        if (!$category) {
            $this->json(['error' => 'Category not found'], 404);
        }
        $this->json($category);
    }

    public function store()
    {
        $this->requireAuth();
        $input = $this->getInput();
        $this->requireFields($input, ['name']);

        $categoryModel = new Category($this->db);
        $id = $categoryModel->create(['name' => $input['name']]);
        $this->json(['id' => $id, 'message' => 'Category created'], 201);
    }

    public function update(int $id)
    {
        $this->requireAuth();
        $input = $this->getInput();
        $categoryModel = new Category($this->db);
        $categoryModel->update($id, ['name' => $input['name'] ?? '']);
        $this->json(['message' => 'Category updated']);
    }

    public function destroy(int $id)
    {
        $this->requireAuth();
        $categoryModel = new Category($this->db);
        $categoryModel->delete($id);
        $this->json(['message' => 'Category deleted']);
    }
}
