<?php
namespace App\Models;

use App\Config\Database;
use MongoDB\BSON\ObjectId;

class Book {
    private static function collection() {
        return Database::getInstance()->books;
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

    public static function search(string $query): array {
        return self::collection()->find([
            '$or' => [
                ['title' => ['$regex' => $query, '$options' => 'i']],
                ['author' => ['$regex' => $query, '$options' => 'i']],
                ['genre' => ['$regex' => $query, '$options' => 'i']],
            ]
        ])->toArray();
    }

    public static function update(string $id, array $data): void {
        self::collection()->updateOne(
            ['_id' => new ObjectId($id)],
            ['$set' => $data]
        );
    }

    public static function delete(string $id): void {
        self::collection()->deleteOne(['_id' => new ObjectId($id)]);
    }
}