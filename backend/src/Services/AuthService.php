<?php
namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService {
    public static function generateToken(array $payload): string {
        $payload['iat'] = time();
        $payload['exp'] = time() + (int)$_ENV['JWT_EXPIRE'];
        return JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
    }

    public static function decodeToken(string $token): object {
        return JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
    }

    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
}