<?php

namespace App\Enums;

enum RefundStatus: string
{
    case NOT_APPLICABLE = 'not_applicable';
    case PENDING = 'pending';
    case UNDER_PROCESS = 'under_process';
    case ISSUED = 'issued';
    case FAILED = 'failed';
    case HOLD = 'hold';

    public function label(): string
    {
        return ucwords(str_replace('_', ' ', $this->value));
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}