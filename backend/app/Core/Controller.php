<?php

namespace StylePOS\Core;

use StylePOS\Middleware\AuthMiddleware;

class Controller
{
    protected $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }

    protected function json($data, $status = 200)
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    protected function getInput()
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->json(['error' => 'Invalid JSON payload'], 400);
        }

        return $data ?? [];
    }

    protected function getQuery(string $key, $default = null)
    {
        return $_GET[$key] ?? $default;
    }

    protected function requireFields(array $input, array $fields)
    {
        foreach ($fields as $field) {
            if (!isset($input[$field]) || $input[$field] === '') {
                $this->json(['error' => 'Missing required field: ' . $field], 400);
            }
        }
    }

    protected function validateEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    protected function currentUserId(): ?int
    {
        return AuthMiddleware::$userId;
    }

    protected function requireAuth()
    {
        if (AuthMiddleware::$userId === null) {
            $this->json(['error' => 'Unauthorized: Authentication required'], 401);
        }
    }
}
