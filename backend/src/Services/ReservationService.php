<?php
namespace App\Services;

use App\Config\Database;
use MongoDB\BSON\ObjectId;

class ReservationService {
    public static function addToQueue(string $bookId, string $userId): bool {
        $db = Database::getInstance();
        $reservation = $db->reservations->findOne(['book_id' => new ObjectId($bookId)]);

        if (!$reservation) {
            $db->reservations->insertOne([
                'book_id' => new ObjectId($bookId),
                'queue' => [['user_id' => new ObjectId($userId), 'reserved_at' => date('Y-m-d H:i:s')]]
            ]);
        } else {
            $db->reservations->updateOne(
                ['book_id' => new ObjectId($bookId)],
                ['$push' => ['queue' => ['user_id' => new ObjectId($userId), 'reserved_at' => date('Y-m-d H:i:s')]]]
            );
        }
        return true;
    }

    public static function removeFromQueue(string $bookId, string $userId): bool {
        $db = Database::getInstance();
        $db->reservations->updateOne(
            ['book_id' => new ObjectId($bookId)],
            ['$pull' => ['queue' => ['user_id' => new ObjectId($userId)]]]
        );
        return true;
    }
}