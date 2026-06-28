<?php
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
    $client = new MongoDB\Client($_ENV['MONGO_URI']);
    $db = $client->selectDatabase($_ENV['MONGO_DB']);
    $collections = $db->listCollections();
    echo "Connected to MongoDB Atlas successfully!\n";
    echo "Database: " . $_ENV['MONGO_DB'] . "\n";
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}