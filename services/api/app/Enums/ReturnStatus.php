<?php

namespace App\Enums;

enum ReturnStatus: string
{
    case DRAFT = 'draft';
    case IN_PROGRESS = 'in_progress';
    case SUBMITTED = 'submitted';
    case VERIFIED = 'verified';
    case PROCESSED = 'processed';
    case DEFECTIVE = 'defective';
    case REVISED = 'revised';
    case COMPLETED = 'completed';
    case REJECTED = 'rejected';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::IN_PROGRESS => 'In Progress',
            self::SUBMITTED => 'Submitted',
            self::VERIFIED => 'Verified',
            self::PROCESSED => 'Processed',
            self::DEFECTIVE => 'Defective',
            self::REVISED => 'Revised',
            self::COMPLETED => 'Completed',
            self::REJECTED => 'Rejected',
            self::CANCELLED => 'Cancelled',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::DRAFT => 'gray',
            self::IN_PROGRESS => 'blue',
            self::SUBMITTED => 'cyan',
            self::VERIFIED => 'green',
            self::PROCESSED => 'emerald',
            self::DEFECTIVE => 'yellow',
            self::REVISED => 'orange',
            self::COMPLETED => 'success',
            self::REJECTED => 'red',
            self::CANCELLED => 'slate',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}