<?php

namespace StylePOS\Controllers;

use StylePOS\Core\Controller;
use StylePOS\Models\Brand;

class BrandController extends Controller
{
    public function index()
    {
        $this->requireAuth();
        $brandModel = new Brand($this->db);
        $this->json($brandModel->all());
    }

    public function show(int $id)
    {
        $this->requireAuth();
        $brandModel = new Brand($this->db);
        $brand = $brandModel->find($id);
        if (!$brand) {
            $this->json(['error' => 'Brand not found'], 404);
        }
        $this->json($brand);
    }

    public function store()
    {
        $this->requireAuth();
        $input = $this->getInput();
        $this->requireFields($input, ['name']);

        $brandModel = new Brand($this->db);
        $id = $brandModel->create(['name' => $input['name']]);
        $this->json(['id' => $id, 'message' => 'Brand created'], 201);
    }

    public function update(int $id)
    {
        $this->requireAuth();
        $input = $this->getInput();
        $brandModel = new Brand($this->db);
        $brandModel->update($id, ['name' => $input['name'] ?? '']);
        $this->json(['message' => 'Brand updated']);
    }

    public function destroy(int $id)
    {
        $this->requireAuth();
        $brandModel = new Brand($this->db);
        $brandModel->delete($id);
        $this->json(['message' => 'Brand deleted']);
    }
}
