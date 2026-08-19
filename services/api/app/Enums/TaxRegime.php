<?php

namespace App\Enums;

enum TaxRegime: string
{
    case OLD = 'old';
    case NEW = 'new';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}