<?php

namespace StylePOS\Models;

use StylePOS\Core\Model;

class ProductVariant extends Model
{
    protected $table = 'product_variants';

    public function findBySku(string $sku)
    {
        $stmt = $this->query("SELECT * FROM {$this->table} WHERE sku = ?", [$sku]);
        return $stmt->fetch();
    }

    public function updateStock(int $variantId, int $change)
    {
        $stmt = $this->query("UPDATE {$this->table} SET stock_quantity = stock_quantity + ? WHERE id = ?", [$change, $variantId]);
        return $stmt->rowCount();
    }
}
