<?php

namespace StylePOS\Models;

use StylePOS\Core\Model;

class Customer extends Model
{
    protected $table = 'customers';

    public function search(string $term)
    {
        $stmt = $this->query("SELECT * FROM {$this->table} WHERE name LIKE ? OR phone LIKE ?", ["%{$term}%", "%{$term}%"]);
        return $stmt->fetchAll();
    }
}
