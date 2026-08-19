<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN = 'admin';
    case MANAGER = 'manager';
    case CA = 'ca';
    case TAX_EXPERT = 'tax_expert';
    case SUPPORT = 'support';
    case CUSTOMER = 'customer';

    public function label(): string
    {
        return ucwords(str_replace('_', ' ', $this->value));
    }

    public function isAdmin(): bool
    {
        return in_array($this, [
            self::SUPER_ADMIN,
            self::ADMIN,
        ], true);
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}