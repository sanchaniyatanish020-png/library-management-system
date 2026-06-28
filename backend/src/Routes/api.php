<?php
use App\Controllers\AuthController;
use App\Controllers\BookController;
use App\Controllers\BorrowController;
use App\Controllers\ReservationController;
use App\Controllers\FineController;
use App\Controllers\UserController;
use App\Controllers\PdfController;
use App\Middleware\AuthMiddleware;
use App\Middleware\AdminMiddleware;
use App\Middleware\CorsMiddleware;

$app->add(CorsMiddleware::class);

$app->options('/{routes:.+}', function ($request, $response) {
    return $response;
});

// Auth routes
$app->post('/api/auth/register', [AuthController::class, 'register']);
$app->post('/api/auth/login', [AuthController::class, 'login']);

// Book routes
$app->get('/api/books', [BookController::class, 'index']);
$app->get('/api/books/{id}', [BookController::class, 'show']);

$app->group('/api/books', function ($group) {
    $group->post('', [BookController::class, 'store']);
    $group->put('/{id}', [BookController::class, 'update']);
    $group->delete('/{id}', [BookController::class, 'destroy']);
})->add(AdminMiddleware::class)->add(AuthMiddleware::class);

// Borrow routes
$app->group('/api/borrows', function ($group) {
    $group->get('', [BorrowController::class, 'index']);
    $group->post('/issue', [BorrowController::class, 'issue']);
    $group->put('/return/{id}', [BorrowController::class, 'return']);
})->add(AuthMiddleware::class);

// Reservation routes
$app->group('/api/reservations', function ($group) {
    $group->get('', [ReservationController::class, 'index']);
    $group->post('', [ReservationController::class, 'reserve']);
    $group->delete('/{book_id}', [ReservationController::class, 'cancel']);
})->add(AuthMiddleware::class);

// Fine routes
$app->group('/api/fines', function ($group) {
    $group->get('', [FineController::class, 'index']);
    $group->put('/pay/{id}', [FineController::class, 'pay']);
})->add(AuthMiddleware::class);

// User routes (admin only)
$app->group('/api/users', function ($group) {
    $group->get('', [UserController::class, 'index']);
    $group->delete('/{id}', [UserController::class, 'destroy']);
})->add(AdminMiddleware::class)->add(AuthMiddleware::class);

// PDF routes
$app->get('/api/pdf/borrow/{id}', [PdfController::class, 'borrowReceipt'])->add(AuthMiddleware::class);