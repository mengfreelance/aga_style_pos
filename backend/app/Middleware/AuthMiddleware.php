<?php

namespace StylePOS\Middleware;

use StylePOS\Core\Database;
use StylePOS\Models\User;

class AuthMiddleware
{
    private static ?Database $db = null;
    public static ?int $userId = null;

    public static function init(Database $db): void
    {
        self::$db = $db;
    }

    public static function handle(): void
    {
        $headers = getallheaders() ?? [];
        $authHeader = $headers['Authorization'] ?? '';

        if (!preg_match('/^Bearer\s+(\S+)$/i', $authHeader, $matches)) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Unauthorized: Missing or invalid token']);
            exit;
        }

        $token = $matches[1];

        if (strlen($token) < 10) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Unauthorized: Invalid token']);
            exit;
        }

        $userModel = new User(self::$db);
        $user = $userModel->findByToken($token);

        if (!$user) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Unauthorized: Invalid or expired token']);
            exit;
        }

        self::$userId = (int) $user['id'];
    }
}
