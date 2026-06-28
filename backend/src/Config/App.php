<?php
namespace App\Config;

use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

class App {
    public static function create(): \Slim\App {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->safeLoad();

        $app = AppFactory::create();
        $app->addBodyParsingMiddleware();
        $app->addRoutingMiddleware();
        $app->addErrorMiddleware(true, true, true);

        return $app;
    }
}