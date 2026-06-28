<?php
namespace App\Controllers;

use App\Models\Book;
use App\Models\Borrow;
use App\Models\User;
use App\Services\FineService;
use App\Services\EmailService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class BorrowController {
    public function index(Request $request, Response $response): Response {
        $user = $request->getAttribute('user');
        $filter = $user->role === 'admin' ? [] : ['user_id' => new \MongoDB\BSON\ObjectId($user->id)];
        $borrows = Borrow::findAll($filter);

        $result = array_map(fn($b) => array_merge((array)$b, [
            'id' => (string)$b['_id'],
            'fine' => FineService::calculate($b)
        ]), $borrows);

        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function issue(Request $request, Response $response): Response {
        $data = $request->getParsedBody();
        $user = $request->getAttribute('user');

        $book = Book::findById($data['book_id']);
        if (!$book) {
            $response->getBody()->write(json_encode(['error' => 'Book not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        if ($book['available_copies'] < 1) {
            $response->getBody()->write(json_encode(['error' => 'No copies available']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $dueDate = date('Y-m-d', strtotime('+14 days'));

        $id = Borrow::create([
            'user_id' => new \MongoDB\BSON\ObjectId($user->id),
            'book_id' => new \MongoDB\BSON\ObjectId($data['book_id']),
            'issued_at' => date('Y-m-d H:i:s'),
            'due_date' => $dueDate,
            'returned_at' => null
        ]);

        Book::update($data['book_id'], [
            'available_copies' => $book['available_copies'] - 1
        ]);

        // Send confirmation email
        $userDetails = User::findById($user->id);
        if ($userDetails) {
            EmailService::sendBorrowConfirmation(
                $userDetails['email'],
                $userDetails['name'],
                $book['title'],
                $dueDate
            );
        }

        $response->getBody()->write(json_encode(['message' => 'Book issued', 'id' => $id]));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    public function return(Request $request, Response $response, array $args): Response {
        $borrow = Borrow::findById($args['id']);
        if (!$borrow) {
            $response->getBody()->write(json_encode(['error' => 'Borrow record not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $fine = FineService::calculate($borrow);

        Borrow::update($args['id'], ['returned_at' => date('Y-m-d H:i:s')]);

        $book = Book::findById((string)$borrow['book_id']);
        Book::update((string)$borrow['book_id'], [
            'available_copies' => $book['available_copies'] + 1
        ]);

        $response->getBody()->write(json_encode([
            'message' => 'Book returned',
            'fine' => $fine
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    }
}