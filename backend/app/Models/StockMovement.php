<?php

namespace StylePOS\Models;

use StylePOS\Core\Model;

class StockMovement extends Model
{
    protected $table = 'stock_movements';

    public function log(int $variantId, string $type, int $quantity, int $userId, string $note = null)
    {
        return $this->create([
            'variant_id' => $variantId,
            'type'       => $type,
            'quantity'   => $quantity,
            'user_id'    => $userId,
            'note'       => $note,
            'created_at' => date('Y-m-d H:i:s'),
        ]);
    }
}
