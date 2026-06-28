<?php
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use App\Config\Database;
use App\Services\EmailService;
use App\Services\FineService;

$db = Database::getInstance();

// Get all overdue borrows
$borrows = $db->borrows->find([
    'returned_at' => null
])->toArray();

$count = 0;
foreach ($borrows as $borrow) {
    $dueDate = new DateTime($borrow['due_date']);
    $now = new DateTime();

    if ($now <= $dueDate) continue;

    // Get user
    $user = $db->users->findOne(['_id' => $borrow['user_id']]);
    if (!$user) continue;

    // Get book
    $book = $db->books->findOne(['_id' => $borrow['book_id']]);
    if (!$book) continue;

    $fine = FineService::calculate($borrow);

    $sent = EmailService::sendOverdueAlert(
        $user['email'],
        $user['name'],
        $book['title'],
        $borrow['due_date'],
        $fine
    );

    if ($sent) {
        echo "✅ Email sent to {$user['email']} for book: {$book['title']}\n";
        $count++;
    } else {
        echo "❌ Failed to send email to {$user['email']}\n";
    }
}

echo "\nDone! Sent {$count} overdue alerts.\n";