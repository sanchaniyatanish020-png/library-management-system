<?php
namespace App\Models;

use App\Config\Database;
use MongoDB\BSON\ObjectId;

class Fine {
    private static function collection() {
        return Database::getInstance()->fines;
    }

    public static function create(array $data): string {
        $result = self::collection()->insertOne($data);
        return (string)$result->getInsertedId();
    }

    public static function findByUser(string $userId): array {
        return self::collection()->find([
            'user_id' => new ObjectId($userId),
            'paid' => false
        ])->toArray();
    }

    public static function markPaid(string $id): void {
        self::collection()->updateOne(
            ['_id' => new ObjectId($id)],
            ['$set' => ['paid' => true, 'paid_at' => date('Y-m-d H:i:s')]]
        );
    }
}