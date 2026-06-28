<?php
namespace App\Config;

use MongoDB\Client;

class Database {
    private static $instance = null;

    public static function getInstance(): \MongoDB\Database {
        if (self::$instance === null) {
            $uri = $_ENV['MONGO_URI'];
            $dbName = $_ENV['MONGO_DB'];
            $client = new Client($uri);
            self::$instance = $client->selectDatabase($dbName);
        }
        return self::$instance;
    }
}