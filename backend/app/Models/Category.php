<?php

namespace StylePOS\Models;

use StylePOS\Core\Model;

class Category extends Model
{
    protected $table = 'categories';

    public function withProducts()
    {
        $stmt = $this->query("SELECT c.*, COUNT(p.id) AS product_count FROM categories c LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id");
        return $stmt->fetchAll();
    }
}
