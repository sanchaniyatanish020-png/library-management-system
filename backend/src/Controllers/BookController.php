<?php
namespace App\Controllers;

use App\Models\Book;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class BookController {
    public function index(Request $request, Response $response): Response {
        $params = $request->getQueryParams();
        $books = isset($params['search'])
            ? Book::search($params['search'])
            : Book::findAll();

        $result = array_map(fn($b) => array_merge((array)$b, ['id' => (string)$b['_id']]), $books);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function show(Request $request, Response $response, array $args): Response {
        $book = Book::findById($args['id']);
        if (!$book) {
            $response->getBody()->write(json_encode(['error' => 'Book not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }
        $response->getBody()->write(json_encode(array_merge((array)$book, ['id' => (string)$book['_id']])));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function store(Request $request, Response $response): Response {
        $data = $request->getParsedBody();

        if (!$data['title'] || !$data['author']) {
            $response->getBody()->write(json_encode(['error' => 'Title and author are required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $id = Book::create([
            'title' => $data['title'],
            'author' => $data['author'],
            'isbn' => $data['isbn'] ?? '',
            'genre' => $data['genre'] ?? '',
            'total_copies' => (int)($data['total_copies'] ?? 1),
            'available_copies' => (int)($data['total_copies'] ?? 1),
            'created_at' => date('Y-m-d H:i:s')
        ]);

        $response->getBody()->write(json_encode(['message' => 'Book added', 'id' => $id]));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    public function update(Request $request, Response $response, array $args): Response {
        $data = $request->getParsedBody();
        Book::update($args['id'], $data);
        $response->getBody()->write(json_encode(['message' => 'Book updated']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function destroy(Request $request, Response $response, array $args): Response {
        Book::delete($args['id']);
        $response->getBody()->write(json_encode(['message' => 'Book deleted']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}