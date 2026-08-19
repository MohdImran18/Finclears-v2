<?php

namespace App\Enums;

enum IncomeType: string
{
    case SECTION_80C = '80C';
    case SECTION_80D = '80D';
    case SECTION_80CCD = '80CCD';
    case SECTION_80G = '80G';
    case SECTION_80E = '80E';
    case SECTION_24 = '24';
    case HRA = 'HRA';
    case LTA = 'LTA';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
