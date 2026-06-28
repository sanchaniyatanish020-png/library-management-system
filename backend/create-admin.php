<?php
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
    $client = new MongoDB\Client($_ENV['MONGO_URI']);
    $db = $client->selectDatabase($_ENV['MONGO_DB']);

    // Delete existing admin if any
    $db->users->deleteOne(['email' => 'admin@library.com']);

    // Create fresh admin
    $db->users->insertOne([
        'name' => 'Admin User',
        'email' => 'admin@library.com',
        'password' => password_hash('admin123', PASSWORD_BCRYPT),
        'role' => 'admin',
        'created_at' => date('Y-m-d H:i:s')
    ]);

    echo "Admin created successfully in MongoDB Atlas!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}