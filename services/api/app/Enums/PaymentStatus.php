<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case PENDING = 'pending';
    case INITIATED = 'initiated';
    case PROCESSING = 'processing';
    case SUCCESS = 'success';
    case FAILED = 'failed';
    case REFUNDED = 'refunded';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::INITIATED => 'Initiated',
            self::PROCESSING => 'Processing',
            self::SUCCESS => 'Success',
            self::FAILED => 'Failed',
            self::REFUNDED => 'Refunded',
            self::CANCELLED => 'Cancelled',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'yellow',
            self::INITIATED => 'blue',
            self::PROCESSING => 'cyan',
            self::SUCCESS => 'green',
            self::FAILED => 'red',
            self::REFUNDED => 'purple',
            self::CANCELLED => 'gray',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}