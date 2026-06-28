<?php
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$client = new MongoDB\Client($_ENV['MONGO_URI']);
$db = $client->selectDatabase($_ENV['MONGO_DB']);

$db->users->insertOne([
    'name' => 'Admin User',
    'email' => 'admin@library.com',
    'password' => password_hash('admin123', PASSWORD_BCRYPT),
    'role' => 'admin',
    'created_at' => date('Y-m-d H:i:s')
]);

echo 'Admin created successfully!';