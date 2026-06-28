<?php
namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    public static function send(string $to, string $toName, string $subject, string $body): bool {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = $_ENV['MAIL_HOST'];
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV['MAIL_USERNAME'];
            $mail->Password   = $_ENV['MAIL_PASSWORD'];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = $_ENV['MAIL_PORT'];

            $mail->setFrom($_ENV['MAIL_FROM'], $_ENV['MAIL_FROM_NAME']);
            $mail->addAddress($to, $toName);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Email error: " . $mail->ErrorInfo);
            return false;
        }
    }

    public static function sendOverdueAlert(string $to, string $name, string $bookTitle, string $dueDate, int $fine): bool {
        $subject = "⚠️ Overdue Book Alert - LibraryOS";
        $body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background: #4f46e5; padding: 24px; border-radius: 12px 12px 0 0;'>
                <h1 style='color: white; margin: 0; font-size: 20px;'>📚 LibraryOS</h1>
            </div>
            <div style='background: white; padding: 24px; border: 1px solid #eee; border-radius: 0 0 12px 12px;'>
                <h2 style='color: #1a1a2e; font-size: 18px;'>Overdue Book Alert</h2>
                <p style='color: #666;'>Dear <strong>{$name}</strong>,</p>
                <p style='color: #666;'>The following book is overdue:</p>
                <div style='background: #fff8e6; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 16px 0;'>
                    <p style='margin: 0; font-size: 16px; font-weight: bold; color: #1a1a2e;'>📖 {$bookTitle}</p>
                    <p style='margin: 8px 0 0; color: #b7791f;'>Due Date: {$dueDate}</p>
                </div>
                <div style='background: #ffe6e6; border: 1px solid #fc8181; border-radius: 8px; padding: 16px; margin: 16px 0;'>
                    <p style='margin: 0; color: #c53030; font-weight: bold;'>Current Fine: ₹{$fine}</p>
                    <p style='margin: 8px 0 0; color: #c53030; font-size: 13px;'>Fine increases by ₹5 every day</p>
                </div>
                <p style='color: #666;'>Please return the book as soon as possible to avoid further fines.</p>
                <a href='http://localhost:5173/my-borrows'
                   style='display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;'>
                   View My Borrows
                </a>
                <p style='color: #aaa; font-size: 12px; margin-top: 24px;'>LibraryOS Management System</p>
            </div>
        </div>
        ";
        return self::send($to, $name, $subject, $body);
    }

    public static function sendBorrowConfirmation(string $to, string $name, string $bookTitle, string $dueDate): bool {
        $subject = "✅ Book Borrowed Successfully - LibraryOS";
        $body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background: #4f46e5; padding: 24px; border-radius: 12px 12px 0 0;'>
                <h1 style='color: white; margin: 0; font-size: 20px;'>📚 LibraryOS</h1>
            </div>
            <div style='background: white; padding: 24px; border: 1px solid #eee; border-radius: 0 0 12px 12px;'>
                <h2 style='color: #1a1a2e; font-size: 18px;'>Book Borrowed Successfully!</h2>
                <p style='color: #666;'>Dear <strong>{$name}</strong>,</p>
                <p style='color: #666;'>You have successfully borrowed the following book:</p>
                <div style='background: #e6ffed; border: 1px solid #9ae6b4; border-radius: 8px; padding: 16px; margin: 16px 0;'>
                    <p style='margin: 0; font-size: 16px; font-weight: bold; color: #1a1a2e;'>📖 {$bookTitle}</p>
                    <p style='margin: 8px 0 0; color: #276749;'>Due Date: <strong>{$dueDate}</strong></p>
                </div>
                <p style='color: #666;'>Please return the book before the due date to avoid fines.</p>
                <a href='http://localhost:5173/my-borrows'
                   style='display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;'>
                   View My Borrows
                </a>
                <p style='color: #aaa; font-size: 12px; margin-top: 24px;'>LibraryOS Management System</p>
            </div>
        </div>
        ";
        return self::send($to, $name, $subject, $body);
    }
}