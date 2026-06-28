<?php
namespace App\Services;

class FineService {
    const FINE_PER_DAY = 5;

    public static function calculate(\MongoDB\Model\BSONDocument $borrow): int {
        if ($borrow['returned_at'] || !$borrow['due_date']) return 0;

        $due = new \DateTime($borrow['due_date']);
        $now = new \DateTime();

        if ($now <= $due) return 0;

        $days = (int)$now->diff($due)->days;
        return $days * self::FINE_PER_DAY;
    }
}