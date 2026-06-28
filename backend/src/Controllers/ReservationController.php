<?php
namespace App\Controllers;

use App\Models\Book;
use App\Models\Reservation;
use App\Services\ReservationService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ReservationController {
    public function index(Request $request, Response $response): Response {
        $user = $request->getAttribute('user');
        $reservations = Reservation::findByUser($user->id);
        $response->getBody()->write(json_encode($reservations));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function reserve(Request $request, Response $response): Response {
        $data = $request->getParsedBody();
        $user = $request->getAttribute('user');

        $book = Book::findById($data['book_id']);
        if (!$book) {
            $response->getBody()->write(json_encode(['error' => 'Book not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        ReservationService::addToQueue($data['book_id'], $user->id);

        $response->getBody()->write(json_encode(['message' => 'Book reserved successfully']));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    public function cancel(Request $request, Response $response, array $args): Response {
        $user = $request->getAttribute('user');
        ReservationService::removeFromQueue($args['book_id'], $user->id);
        $response->getBody()->write(json_encode(['message' => 'Reservation cancelled']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}