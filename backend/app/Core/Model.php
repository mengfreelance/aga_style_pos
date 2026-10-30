<?php

namespace StylePOS\Core;

abstract class Model
{
    protected $db;
    protected $table;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }

    protected function query(string $sql, array $params = [])
    {
        $stmt = $this->db->connect()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    protected function validateColumns(string $columns): string
    {
        $columns = trim($columns);

        if ($columns === '*') {
            return '*';
        }

        if (!preg_match('/^[a-zA-Z0-9_,\s\.]+$/', $columns)) {
            throw new \InvalidArgumentException('Invalid column names in query');
        }

        return $columns;
    }

    public function all(string $columns = '*')
    {
        $columns = $this->validateColumns($columns);
        return $this->query("SELECT {$columns} FROM {$this->table}")->fetchAll();
    }

    public function find(int $id, string $columns = '*')
    {
        $columns = $this->validateColumns($columns);
        $stmt = $this->query("SELECT {$columns} FROM {$this->table} WHERE id = ?", [$id]);
        return $stmt->fetch();
    }

    public function create(array $data)
    {
        foreach (array_keys($data) as $col) {
            if (!preg_match('/^[a-zA-Z0-9_]+$/', $col)) {
                throw new \InvalidArgumentException('Invalid column name: ' . $col);
            }
        }

        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $values = array_values($data);
        $stmt = $this->query("INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})", $values);
        return $this->db->connect()->lastInsertId();
    }

    public function update(int $id, array $data)
    {
        foreach (array_keys($data) as $col) {
            if (!preg_match('/^[a-zA-Z0-9_]+$/', $col)) {
                throw new \InvalidArgumentException('Invalid column name: ' . $col);
            }
        }

        $set = implode(', ', array_map(fn($col) => "{$col} = ?", array_keys($data)));
        $values = array_merge(array_values($data), [$id]);
        return $this->query("UPDATE {$this->table} SET {$set} WHERE id = ?", $values)->rowCount();
    }

    public function delete(int $id)
    {
        return $this->query("DELETE FROM {$this->table} WHERE id = ?", [$id])->rowCount();
    }
}
