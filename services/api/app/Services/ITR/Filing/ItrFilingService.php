<?php

namespace App\Services\ITR\Filing;

use App\Models\ItrReturn;
use App\Services\Sandbox\SandboxService;
use RuntimeException;

class ItrFilingService
{
    public function __construct(
        protected SandboxService $sandboxService
    ) {
    }

    public function file(ItrReturn $return): array
    {
        $return->refresh();

        if (!filter_var(
            config('services.sandbox.itr_filing_enabled', false),
            FILTER_VALIDATE_BOOL
        )) {
            throw new RuntimeException(
                'ITR filing is currently disabled.'
            );
        }

        $pan = strtoupper(
            trim((string) $return->pan)
        );

        if ($pan === '') {
            throw new RuntimeException(
                'PAN is required before ITR filing.'
            );
        }

        if (!$return->is_verified) {
            throw new RuntimeException(
                'ITR cannot be filed before KYC verification.'
            );
        }

        if (!$return->is_validated) {
            throw new RuntimeException(
                'ITR must pass validation before filing.'
            );
        }

        $payload = $return->api_request;

        if (is_string($payload)) {
            $payload = json_decode(
                $payload,
                true
            );
        }

        if (!is_array($payload) || empty($payload)) {
            throw new RuntimeException(
                'Validated ITR payload is missing.'
            );
        }

        if (
            !empty($return->acknowledgement_number) ||
            !empty($return->receipt_number)
        ) {
            throw new RuntimeException(
                'This ITR appears to have already been filed.'
            );
        }

        $return->update([
            'workflow_stage' => 'filing',
        ]);

        try {
            $response = $this->sandboxService->fileItr(
                $payload
            );

            $return->update([
                'api_response' => $response,
            ]);

            $reference =
                $response['transaction_id']
                ?? $response['reference_id']
                ?? $response['api_reference']
                ?? $response['data']['transaction_id']
                ?? $response['data']['reference_id']
                ?? null;

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

            $success =
                ($response['success'] ?? false) === true
                || !empty($acknowledgement)
                || !empty($receipt);

            if (!$success) {
                $return->update([
                    'workflow_stage' => 'filing_failed',
                    'api_reference' => $reference,
                ]);

                return [
                    'success' => false,
                    'message' =>
                        $response['message']
                        ?? $response['error']
                        ?? 'ITR filing failed.',
                    'reference' => $reference,
                    'acknowledgement_number' => $acknowledgement,
                    'receipt_number' => $receipt,
                    'response' => $response,
                    'return' => $return->fresh(),
                ];
            }

            $return->update([
                'api_reference' => $reference,
                'acknowledgement_number' => $acknowledgement,
                'receipt_number' => $receipt,
                'filing_date' => now(),
                'workflow_stage' => 'filed',
            ]);

            return [
                'success' => true,
                'message' => 'ITR filed successfully.',
                'reference' => $reference,
                'acknowledgement_number' => $acknowledgement,
                'receipt_number' => $receipt,
                'response' => $response,
                'return' => $return->fresh(),
            ];

        } catch (\Throwable $e) {
            $return->update([
                'workflow_stage' => 'filing_failed',
                'api_response' => [
                    'success' => false,
                    'message' => $e->getMessage(),
                    'exception' => get_class($e),
                ],
            ]);

            throw $e;
        }
    }
}