<?php

namespace StylePOS\Controllers;

use StylePOS\Core\Controller;
use StylePOS\Models\Sale;
use StylePOS\Models\SaleItem;
use StylePOS\Models\Payment;
use StylePOS\Models\StockMovement;
use StylePOS\Models\ProductVariant;

class SaleController extends Controller
{
    public function index()
    {
        $this->requireAuth();
        $saleModel = new Sale($this->db);
        $this->json($saleModel->all());
    }

    public function store()
    {
        $this->requireAuth();
        $input = $this->getInput();
        $this->requireFields($input, ['items', 'total_amount']);

        $saleModel = new Sale($this->db);
        $userId = $this->currentUserId() ?? 1;
        $saleId = $saleModel->create([
            'customer_id'   => $input['customer_id'] ?? null,
            'total_amount'  => $input['total_amount'],
            'currency'      => $input['currency'] ?? 'USD',
            'exchange_rate' => $input['exchange_rate'] ?? 1,
            'status'        => 'completed',
            'created_at'    => date('Y-m-d H:i:s'),
        ]);

        foreach ($input['items'] as $item) {
            if (!isset($item['variant_id']) || !isset($item['quantity'])) {
                $this->json(['error' => 'Each item needs variant_id and quantity'], 400);
            }

            $saleItemModel = new SaleItem($this->db);
            $saleItemModel->create([
                'sale_id'      => $saleId,
                'variant_id'   => $item['variant_id'],
                'quantity'     => $item['quantity'],
                'unit_price'   => $item['unit_price'] ?? 0,
                'total'        => $item['total'] ?? 0,
            ]);

            $variantModel = new ProductVariant($this->db);
            $variantModel->updateStock($item['variant_id'], -($item['quantity']));

            $movementModel = new StockMovement($this->db);
            $movementModel->log($item['variant_id'], 'sale', $item['quantity'], $userId, 'POS Sale');
        }

        if (!empty($input['payment'])) {
            $paymentModel = new Payment($this->db);
            $paymentModel->create([
                'sale_id'     => $saleId,
                'method'      => $input['payment']['method'] ?? 'cash',
                'currency'    => $input['payment']['currency'] ?? 'USD',
                'amount'      => $input['payment']['amount'] ?? 0,
                'change_due'  => $input['payment']['change_due'] ?? 0,
                'paid_at'     => date('Y-m-d H:i:s'),
            ]);
        }

        $this->json(['id' => $saleId, 'message' => 'Sale completed'], 201);
    }

    public function show(int $id)
    {
        $this->requireAuth();
        $saleModel = new Sale($this->db);
        $sale = $saleModel->find($id);
        if (!$sale) {
            $this->json(['error' => 'Sale not found'], 404);
        }
        $this->json($sale);
    }

    public function update(int $id)
    {
        $this->requireAuth();
        $input = $this->getInput();
        $saleModel = new Sale($this->db);
        $saleModel->update($id, [
            'customer_id'   => $input['customer_id'] ?? null,
            'total_amount'  => $input['total_amount'] ?? 0,
            'currency'      => $input['currency'] ?? 'USD',
            'exchange_rate' => $input['exchange_rate'] ?? 1,
            'status'        => $input['status'] ?? 'completed',
        ]);
        $this->json(['message' => 'Sale updated']);
    }

    public function destroy(int $id)
    {
        $this->requireAuth();
        $saleModel = new Sale($this->db);
        $saleModel->delete($id);
        $this->json(['message' => 'Sale deleted']);
    }
}
