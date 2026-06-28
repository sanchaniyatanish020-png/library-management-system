<?php
namespace App\Controllers;

use App\Config\Database;
use App\Services\FineService;
use Dompdf\Dompdf;
use Dompdf\Options;
use MongoDB\BSON\ObjectId;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class PdfController {
    public function borrowReceipt(Request $request, Response $response, array $args): Response {
        $db = Database::getInstance();
        $user = $request->getAttribute('user');

        $borrow = $db->borrows->findOne(['_id' => new ObjectId($args['id'])]);
        if (!$borrow) {
            $response->getBody()->write(json_encode(['error' => 'Borrow not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $book = $db->books->findOne(['_id' => $borrow['book_id']]);
        $member = $db->users->findOne(['_id' => $borrow['user_id']]);
        $fine = FineService::calculate($borrow);

        $html = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                .header { background: #4f46e5; color: white; padding: 20px; border-radius: 8px; margin-bottom: 24px; }
                .header h1 { margin: 0; font-size: 22px; }
                .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.8; }
                .receipt-id { font-size: 12px; color: #888; margin-bottom: 20px; }
                .section { background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
                .section h3 { margin: 0 0 12px; font-size: 14px; color: #4f46e5; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; }
                .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .label { font-size: 12px; color: #888; }
                .value { font-size: 12px; font-weight: bold; color: #333; }
                .fine { color: #e53e3e; }
                .status-active { background: #e6f0ff; color: #2b6cb0; padding: 4px 10px; border-radius: 4px; font-size: 11px; }
                .status-overdue { background: #ffe6e6; color: #c53030; padding: 4px 10px; border-radius: 4px; font-size: 11px; }
                .status-returned { background: #e6ffed; color: #276749; padding: 4px 10px; border-radius: 4px; font-size: 11px; }
                .footer { text-align: center; font-size: 11px; color: #aaa; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h1>📚 LibraryOS</h1>
                <p>Borrow Receipt</p>
            </div>

            <p class='receipt-id'>Receipt ID: {$args['id']}</p>

            <div class='section'>
                <h3>Member Details</h3>
                <div class='row'>
                    <span class='label'>Name</span>
                    <span class='value'>{$member['name']}</span>
                </div>
                <div class='row'>
                    <span class='label'>Email</span>
                    <span class='value'>{$member['email']}</span>
                </div>
            </div>

            <div class='section'>
                <h3>Book Details</h3>
                <div class='row'>
                    <span class='label'>Title</span>
                    <span class='value'>{$book['title']}</span>
                </div>
                <div class='row'>
                    <span class='label'>Author</span>
                    <span class='value'>{$book['author']}</span>
                </div>
                <div class='row'>
                    <span class='label'>ISBN</span>
                    <span class='value'>{$book['isbn']}</span>
                </div>
                <div class='row'>
                    <span class='label'>Genre</span>
                    <span class='value'>{$book['genre']}</span>
                </div>
            </div>

            <div class='section'>
                <h3>Borrow Details</h3>
                <div class='row'>
                    <span class='label'>Issued Date</span>
                    <span class='value'>{$borrow['issued_at']}</span>
                </div>
                <div class='row'>
                    <span class='label'>Due Date</span>
                    <span class='value'>{$borrow['due_date']}</span>
                </div>
                <div class='row'>
                    <span class='label'>Returned Date</span>
                    <span class='value'>" . ($borrow['returned_at'] ?? 'Not returned yet') . "</span>
                </div>
                <div class='row'>
                    <span class='label'>Status</span>
                    <span class='value'>" . ($borrow['returned_at'] ? 'Returned' : (new \DateTime() > new \DateTime($borrow['due_date']) ? 'Overdue' : 'Active')) . "</span>
                </div>
                " . ($fine > 0 ? "
                <div class='row'>
                    <span class='label'>Fine Amount</span>
                    <span class='value fine'>₹{$fine}</span>
                </div>" : "") . "
            </div>

            <div class='footer'>
                <p>Generated on " . date('Y-m-d H:i:s') . " | LibraryOS Management System</p>
                <p>Thank you for using our library!</p>
            </div>
        </body>
        </html>
        ";

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $pdf = $dompdf->output();

        $response->getBody()->write($pdf);
        return $response
            ->withHeader('Content-Type', 'application/pdf')
            ->withHeader('Content-Disposition', 'attachment; filename="receipt-' . $args['id'] . '.pdf"');
    }
}