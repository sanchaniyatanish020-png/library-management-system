<?php
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$client = new MongoDB\Client($_ENV['MONGO_URI']);
$db = $client->selectDatabase($_ENV['MONGO_DB']);

$user = $db->users->findOne(['email' => 'admin@library.com']);

if ($user) {
    echo "User found!\n";
    echo "Name: " . $user['name'] . "\n";
    echo "Email: " . $user['email'] . "\n";
    echo "Role: " . $user['role'] . "\n";
    $verify = password_verify('admin123', $user['password']);
    echo "Password valid: " . ($verify ? 'YES' : 'NO') . "\n";
} else {
    echo "User NOT found in database!\n";
}