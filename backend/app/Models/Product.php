<?php

namespace StylePOS\Models;

use StylePOS\Core\Model;

class Product extends Model
{
    protected $table = 'products';

    public function withVariants()
    {
        $stmt = $this->query("SELECT p.*, v.id AS variant_id, v.sku, v.size, v.color, v.selling_price, v.stock_quantity FROM products p LEFT JOIN product_variants v ON v.product_id = p.id");
        return $stmt->fetchAll();
    }

    public function lowStock(int $threshold = 10)
    {
        $stmt = $this->query("SELECT p.*, MIN(v.stock_quantity) AS min_stock FROM products p JOIN product_variants v ON v.product_id = p.id GROUP BY p.id HAVING min_stock <= ?", [$threshold]);
        return $stmt->fetchAll();
    }
}
