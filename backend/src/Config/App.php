<?php
namespace App\Config;

use Slim\Factory\AppFactory;
use Dotenv\Dotenv;
use Slim\Routing\RouteCollectorProxy;

class App {
    public static function create(): \Slim\App {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->safeLoad();

        $app = AppFactory::create();
        $app->addBodyParsingMiddleware();
        $app->addRoutingMiddleware();
        $app->addErrorMiddleware(true, true, true);

        // CORS Middleware
        $app->add(function ($request, $handler) {
            $response = $handler->handle($request);
            return $response
                ->withHeader('Access-Control-Allow-Origin', 'https://library-management-system-three-rose-96.vercel.app')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                ->withHeader('Access-Control-Allow-Credentials', 'true');
        });

        // Handle OPTIONS preflight
        $app->options('/{routes:.+}', function ($request, $response) {
            return $response;
        });

        return $app;
    }
}