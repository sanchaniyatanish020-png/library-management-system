<?php
namespace App\Models;

use App\Config\Database;
use MongoDB\BSON\ObjectId;

class User {
    private static function collection() {
        return Database::getInstance()->users;
    }

    public static function create(array $data): string {
        $result = self::collection()->insertOne($data);
        return (string)$result->getInsertedId();
    }

    public static function findByEmail(string $email): ?object {
        return self::collection()->findOne(['email' => $email]);
    }

    public static function findById(string $id): ?object {
        return self::collection()->findOne(['_id' => new ObjectId($id)]);
    }

    public static function findAll(): array {
        return self::collection()->find()->toArray();
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