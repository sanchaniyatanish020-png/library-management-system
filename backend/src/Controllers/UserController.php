<?php
namespace App\Controllers;

use App\Models\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserController {
    public function index(Request $request, Response $response): Response {
        $users = User::findAll();
        $result = array_map(fn($u) => [
            'id' => (string)$u['_id'],
            'name' => $u['name'],
            'email' => $u['email'],
            'role' => $u['role'],
            'created_at' => $u['created_at']
        ], $users);

        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function destroy(Request $request, Response $response, array $args): Response {
        User::delete($args['id']);
        $response->getBody()->write(json_encode(['message' => 'User deleted']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}