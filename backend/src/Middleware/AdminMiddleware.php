<?php
namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

class AdminMiddleware implements MiddlewareInterface {
    public function process(Request $request, RequestHandler $handler): Response {
        $user = $request->getAttribute('user');

        if (!$user || $user->role !== 'admin') {
            $response = new SlimResponse();
            $response->getBody()->write(json_encode(['error' => 'Admin access required']));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }

        return $handler->handle($request);
    }
}