<?php
namespace App\Models;

use App\Config\Database;
use MongoDB\BSON\ObjectId;

class Reservation {
    private static function collection() {
        return Database::getInstance()->reservations;
    }

    public static function findByBook(string $bookId): ?object {
        return self::collection()->findOne(['book_id' => new ObjectId($bookId)]);
    }

    public static function findByUser(string $userId): array {
        return self::collection()->find([
            'queue.user_id' => new ObjectId($userId)
        ])->toArray();
    }
}