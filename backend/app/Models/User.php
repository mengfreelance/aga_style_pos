<?php

namespace StylePOS\Models;

use StylePOS\Core\Model;

class User extends Model
{
    protected $table = 'users';

    public function findByEmail(string $email)
    {
        $stmt = $this->query("SELECT * FROM {$this->table} WHERE email = ?", [$email]);
        return $stmt->fetch();
    }

    public function findByUsername(string $username)
    {
        $stmt = $this->query("SELECT * FROM {$this->table} WHERE username = ?", [$username]);
        return $stmt->fetch();
    }

    public function findByToken(string $token)
    {
        $stmt = $this->query("SELECT * FROM {$this->table} WHERE token = ?", [$token]);
        return $stmt->fetch();
    }

    public function setToken(int $userId, string $token)
    {
        $this->update($userId, ['token' => $token]);
    }

    public function clearToken(int $userId)
    {
        $this->update($userId, ['token' => null]);
    }
}
