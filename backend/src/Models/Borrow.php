<?php
namespace App\Models;

use App\Config\Database;
use MongoDB\BSON\ObjectId;

class Borrow {
    private static function collection() {
        return Database::getInstance()->borrows;
    }

    public static function create(array $data): string {
        $result = self::collection()->insertOne($data);
        return (string)$result->getInsertedId();
    }

    public static function findAll(array $filter = []): array {
        return self::collection()->find($filter)->toArray();
    }

    public static function findById(string $id): ?object {
        return self::collection()->findOne(['_id' => new ObjectId($id)]);
    }

    public static function findByUser(string $userId): array {
        return self::collection()->find([
            'user_id' => new ObjectId($userId),
            'returned_at' => null
        ])->toArray();
    }

    public static function update(string $id, array $data): void {
        self::collection()->updateOne(
            ['_id' => new ObjectId($id)],
            ['$set' => $data]
        );
    }
}   