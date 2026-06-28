<?php
namespace App\Controllers;

use App\Models\Fine;
use App\Models\Borrow;
use App\Services\FineService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class FineController {
    public function index(Request $request, Response $response): Response {
        $user = $request->getAttribute('user');
        $borrows = Borrow::findByUser($user->id);

        $fines = array_map(fn($b) => [
            'borrow_id' => (string)$b['_id'],
            'book_id' => (string)$b['book_id'],
            'due_date' => $b['due_date'],
            'fine' => FineService::calculate($b)
        ], array_filter($borrows, fn($b) => FineService::calculate($b) > 0));

        $response->getBody()->write(json_encode(array_values($fines)));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function pay(Request $request, Response $response, array $args): Response {
        Fine::markPaid($args['id']);
        $response->getBody()->write(json_encode(['message' => 'Fine paid successfully']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}