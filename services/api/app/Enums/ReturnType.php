<?php

namespace App\Enums;

enum ReturnType: string
{
    case ITR1 = 'ITR-1';
    case ITR2 = 'ITR-2';
    case ITR3 = 'ITR-3';
    case ITR4 = 'ITR-4';
    case ITR5 = 'ITR-5';
    case ITR6 = 'ITR-6';
    case ITR7 = 'ITR-7';

    public function label(): string
    {
        return $this->value;
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}