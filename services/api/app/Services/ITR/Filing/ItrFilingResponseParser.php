<?php

namespace App\Services\ITR\Filing;

class ItrFilingResponseParser
{
    /**
     * Parse a filing response into a normalized structure.
     */
    public function parse(
        array $response
    ): array {

        $acknowledgement =
            $response['acknowledgement_number']
            ?? $response['acknowledgementNumber']
            ?? $response['data']['acknowledgement_number']
            ?? $response['data']['acknowledgementNumber']
            ?? null;

        $receipt =
            $response['receipt_number']
            ?? $response['receiptNumber']
            ?? $response['data']['receipt_number']
            ?? $response['data']['receiptNumber']
            ?? null;

        $reference =
            $response['transaction_id']
            ?? $response['reference_id']
            ?? $response['api_reference']
            ?? $response['data']['transaction_id']
            ?? $response['data']['reference_id']
            ?? null;

        $success =
            ($response['success'] ?? false) === true
            ||
            !empty($acknowledgement)
            ||
            !empty($receipt);

        return [
            'success' => $success,
            'reference' => $reference,
            'acknowledgement_number' => $acknowledgement,
            'receipt_number' => $receipt,
            'message' =>
                $response['message']
                ?? $response['error']
                ?? null,
            'response' => $response,
        ];
    }
}
