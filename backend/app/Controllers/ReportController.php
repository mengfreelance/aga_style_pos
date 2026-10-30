<?php

namespace StylePOS\Controllers;

use StylePOS\Core\Controller;
use StylePOS\Models\Product;

class ReportController extends Controller
{
    public function dashboard()
    {
        $this->requireAuth();
        $productModel = new Product($this->db);
        $this->json([
            'low_stock'  => $productModel->lowStock(),
            'message'    => 'Dashboard data',
        ]);
    }

    public function sales()
    {
        $this->requireAuth();
        $this->json(['message' => 'Sales report']);
    }

    public function expenses()
    {
        $this->requireAuth();
        $this->json(['message' => 'Expenses report not available in core scope']);
    }
}
