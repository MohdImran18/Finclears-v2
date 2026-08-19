<?php

namespace App\Services\ITR\Filing;

use App\Models\ItrReturn;
use RuntimeException;

class ItrFilingValidator
{
    /**
     * Validate whether a return is ready for filing.
     */
    public function validate(
        ItrReturn $return
    ): array {

        $errors = [];

        if (
            trim((string) $return->pan) === ''
        ) {
            $errors[] = 'PAN is required.';
        }

        if (!$return->is_verified) {
            $errors[] = 'KYC verification is required.';
        }

        if (!$return->is_validated) {
            $errors[] = 'ITR validation must pass before filing.';
        }

        if (
            empty($return->api_request)
        ) {
            $errors[] = 'Validated ITR payload is missing.';
        }

        if (
            !empty($return->acknowledgement_number)
            ||
            !empty($return->receipt_number)
        ) {
            $errors[] = 'This ITR has already been filed.';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Throw when filing requirements are not satisfied.
     */
    public function ensureReady(
        ItrReturn $return
    ): void {

        $result = $this->validate(
            $return
        );

        if (!$result['valid']) {
            throw new RuntimeException(
                implode(' ', $result['errors'])
            );
        }
    }
}
