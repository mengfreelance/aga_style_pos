<?php

namespace StylePOS\Controllers;

use StylePOS\Core\Controller;
use StylePOS\Models\User;

class AuthController extends Controller
{
    public function login()
    {
        $input = $this->getInput();
        $this->requireFields($input, ['email', 'password']);

        $email = $input['email'];
        $password = $input['password'];

        if (!$this->validateEmail($email)) {
            $this->json(['error' => 'Invalid email format'], 400);
        }

        $userModel = new User($this->db);
        $user = $userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid email or password']);
            exit;
        }

        $token = bin2hex(random_bytes(32));

        // Store token in database
        $userModel = new User($this->db);
        $userModel->setToken((int) $user['id'], $token);

        $this->json([
            'token' => $token,
            'user'  => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
                'image' => !empty($user['image']) ? $this->getImageUrl($user['image']) : null,
            ]
        ]);
    }

    public function store()
    {
        $input = $this->getInput();
        $username = $input['username'] ?? $_POST['username'] ?? '';
        $email = $input['email'] ?? $_POST['email'] ?? '';
        $password = $input['password'] ?? $_POST['password'] ?? '';
        $name = $input['name'] ?? $_POST['name'] ?? '';
        $role = $input['role'] ?? $_POST['role'] ?? 'admin';

        if ($username === '' || $email === '' || $password === '' || $name === '') {
            $this->json(['error' => 'Missing required fields'], 400);
        }

        if (!$this->validateEmail($email)) {
            $this->json(['error' => 'Invalid email format'], 400);
        }

        $userModel = new User($this->db);

        if ($userModel->findByEmail($email)) {
            $this->json(['error' => 'Email already exists'], 409);
        }

        if ($userModel->findByUsername($username)) {
            $this->json(['error' => 'Username already exists'], 409);
        }

        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imagePath = $this->uploadImage($_FILES['image'], 'users');
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $id = $userModel->create([
            'username' => $username,
            'email'    => $email,
            'password' => $hashedPassword,
            'name'     => $name,
            'role'     => $role,
            'image'    => $imagePath,
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        $this->json([
            'id'    => $id,
            'username' => $username,
            'email'    => $email,
            'name'     => $name,
            'role'     => $role,
            'image'    => $imagePath ? $this->getImageUrl($imagePath) : null,
            'message'  => 'User created'
        ], 201);
    }

    public function updateProfileImage()
    {
        $this->requireAuth();

        $userId = $this->currentUserId();
        $userModel = new User($this->db);
        $user = $userModel->find($userId);

        if (!$user) {
            $this->json(['error' => 'User not found'], 404);
        }

        // Delete old image
        if (!empty($user['image'])) {
            $this->deleteImage($user['image']);
        }

        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imagePath = $this->uploadImage($_FILES['image'], 'users');
        }

        $userModel->update($userId, ['image' => $imagePath]);

        $this->json([
            'message' => 'Profile image updated',
            'image'   => $imagePath ? $this->getImageUrl($imagePath) : null,
        ]);
    }

    public function updateProfile()
    {
        $this->requireAuth();

        $userId = $this->currentUserId();
        $userModel = new User($this->db);
        $user = $userModel->find($userId);

        if (!$user) {
            $this->json(['error' => 'User not found'], 404);
        }

        $input = $this->getInput();
        $name = $input['name'] ?? $user['name'];
        $email = $input['email'] ?? $user['email'];

        // Check if email is taken by another user
        if ($email !== $user['email']) {
            $existing = $userModel->findByEmail($email);
            if ($existing) {
                $this->json(['error' => 'Email already exists'], 409);
            }
        }

        $userModel->update($userId, [
            'name'  => $name,
            'email' => $email,
        ]);

        $updated = $userModel->find($userId);
        unset($updated['password']);

        $this->json([
            'message' => 'Profile updated',
            'user'    => $updated,
        ]);
    }

    public function destroy(int $id)
    {
        $this->requireAuth();

        $userModel = new User($this->db);
        $user = $userModel->find($id);

        if (!$user) {
            $this->json(['error' => 'User not found'], 404);
        }

        // Prevent deleting yourself
        $currentUserId = $this->currentUserId();
        if ($currentUserId && $currentUserId === $id) {
            $this->json(['error' => 'Cannot delete your own account'], 400);
        }

        if (!empty($user['image'])) {
            $this->deleteImage($user['image']);
        }

        $userModel->delete($id);
        $this->json(['message' => 'User deleted']);
    }

    public function me()
    {
        $this->requireAuth();
        $userId = $this->currentUserId();

        $userModel = new User($this->db);
        $user = $userModel->find($userId);

        if (!$user) {
            $this->json(['error' => 'User not found'], 404);
        }

        unset($user['password']);
        $user['image'] = !empty($user['image']) ? $this->getImageUrl($user['image']) : null;

        $this->json(['user' => $user]);
    }

    public function logout()
    {
        $this->requireAuth();

        $userModel = new User($this->db);
        $userModel->clearToken((int) $this->currentUserId());

        $this->json(['message' => 'Logged out']);
    }

    private function uploadImage(array $file, string $folder): string
    {
        $uploadDir = __DIR__ . '/../../public/uploads/' . $folder . '/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('user_', true) . '.' . $ext;
        $destination = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return 'uploads/' . $folder . '/' . $filename;
        }

        return null;
    }

    private function deleteImage(string $imagePath): void
    {
        $fullPath = __DIR__ . '/../../public/' . $imagePath;
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }

    private function getImageUrl(string $imagePath): string
    {
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
        return $baseUrl . '/' . $imagePath;
    }
}
