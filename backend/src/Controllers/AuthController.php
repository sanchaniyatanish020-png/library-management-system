<?php
namespace App\Controllers;

use App\Models\User;
use App\Services\AuthService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController {
    public function register(Request $request, Response $response): Response {
        $data = $request->getParsedBody();

        if (!$data['name'] || !$data['email'] || !$data['password']) {
            $response->getBody()->write(json_encode(['error' => 'All fields are required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $existing = User::findByEmail($data['email']);
        if ($existing) {
            $response->getBody()->write(json_encode(['error' => 'Email already exists']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $userId = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => AuthService::hashPassword($data['password']),
            'role' => 'member',
            'created_at' => date('Y-m-d H:i:s')
        ]);

        $token = AuthService::generateToken([
            'id' => $userId,
            'email' => $data['email'],
            'role' => 'member'
        ]);

        $response->getBody()->write(json_encode([
            'message' => 'Registration successful',
            'token' => $token,
            'user' => ['id' => $userId, 'name' => $data['name'], 'email' => $data['email'], 'role' => 'member']
        ]));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    public function login(Request $request, Response $response): Response {
        $data = $request->getParsedBody();

        if (!$data['email'] || !$data['password']) {
            $response->getBody()->write(json_encode(['error' => 'Email and password required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $user = User::findByEmail($data['email']);
        if (!$user || !AuthService::verifyPassword($data['password'], $user['password'])) {
            $response->getBody()->write(json_encode(['error' => 'Invalid credentials']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $token = AuthService::generateToken([
            'id' => (string)$user['_id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);

        $response->getBody()->write(json_encode([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => (string)$user['_id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]));
        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
}