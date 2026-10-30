<?php

namespace StylePOS\Controllers;

use StylePOS\Core\Controller;
use StylePOS\Models\ProductVariant;

class VariantController extends Controller
{
    public function index()
    {
        $this->requireAuth();
        $variantModel = new ProductVariant($this->db);
        $variants = $variantModel->all();
        $this->json($variants);
    }

    public function show(int $id)
    {
        $this->requireAuth();
        $variantModel = new ProductVariant($this->db);
        $variant = $variantModel->find($id);
        if (!$variant) {
            $this->json(['error' => 'Variant not found'], 404);
        }
        $this->json($variant);
    }

    public function store()
    {
        $this->requireAuth();
        $input = $this->getInput();
        $this->requireFields($input, ['product_id', 'sku', 'selling_price']);

        $variantModel = new ProductVariant($this->db);
        $id = $variantModel->create([
            'product_id'    => $input['product_id'],
            'sku'           => $input['sku'],
            'size'          => $input['size'] ?? '',
            'color'         => $input['color'] ?? '',
            'selling_price' => $input['selling_price'],
            'stock_quantity'=> $input['stock_quantity'] ?? 0,
        ]);
        $this->json(['id' => $id, 'message' => 'Variant created'], 201);
    }

    public function update(int $id)
    {
        $this->requireAuth();
        $input = $this->getInput();
        $variantModel = new ProductVariant($this->db);
        $variantModel->update($id, [
            'sku'           => $input['sku'] ?? '',
            'size'          => $input['size'] ?? '',
            'color'         => $input['color'] ?? '',
            'selling_price' => $input['selling_price'] ?? 0,
            'stock_quantity'=> $input['stock_quantity'] ?? 0,
        ]);
        $this->json(['message' => 'Variant updated']);
    }

    public function destroy(int $id)
    {
        $this->requireAuth();
        $variantModel = new ProductVariant($this->db);
        $variantModel->delete($id);
        $this->json(['message' => 'Variant deleted']);
    }
}
