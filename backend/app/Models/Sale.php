<?php

namespace StylePOS\Models;

use StylePOS\Core\Model;

class Sale extends Model
{
    protected $table = 'sales';

    public function withItems()
    {
        $stmt = $this->query("SELECT s.*, si.id AS item_id, si.product_variant_id, si.quantity, si.unit_price, si.total FROM sales s LEFT JOIN sale_items si ON si.sale_id = s.id");
        return $stmt->fetchAll();
    }
}
