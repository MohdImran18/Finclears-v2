<?php

namespace App\Enums;

enum VerificationStatus: string
{
    case NOT_VERIFIED = 'not_verified';
    case OTP_SENT = 'otp_sent';
    case OTP_VERIFIED = 'otp_verified';
    case EVC_VERIFIED = 'evc_verified';
    case DSC_VERIFIED = 'dsc_verified';
    case COMPLETED = 'completed';
    case FAILED = 'failed';

    public function label(): string
    {
        return ucwords(str_replace('_', ' ', $this->value));
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}