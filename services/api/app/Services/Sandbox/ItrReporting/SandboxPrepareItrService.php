<?php

namespace App\Services\Sandbox\ItrReporting;

use App\Models\ItrReturn;
use App\Services\Sandbox\SandboxService;
use RuntimeException;

class SandboxPrepareItrService
{
    public function __construct(
        protected SandboxService $sandboxService
    ) {
    }

    public function prepare(
        ItrReturn $return,
        array $payload
    ): array {
        $return->refresh();

        $pan = strtoupper(trim((string) $return->pan));

        if ($pan === '') {
            throw new RuntimeException(
                'PAN is required before preparing ITR.'
            );
        }

        $return->loadMissing([
            'assessmentYear',
            'itrType',
        ]);

        $assessmentYear = trim(
            (string) (
                $return->assessmentYear?->name
                ?? $return->assessmentYear?->code
                ?? ''
            )
        );

        if ($assessmentYear === '') {
            throw new RuntimeException(
                'Assessment year is required before preparing ITR.'
            );
        }

        $endpoint = sprintf(
            '/itr-reporting/taxpayer/%s/itrs/%s/',
            rawurlencode($pan),
            rawurlencode($assessmentYear)
        );

        $response = $this->sandboxService->postRaw(
            $endpoint,
            $payload,
            120
        );

        $status = $response['status'] ?? null;

        return [
            'success' =>
                ($response['successful'] ?? false) === true
                || ($status >= 200 && $status < 300),

            'status' => $status,
            'endpoint' => $endpoint,
            'body' => $response['body'] ?? null,
            'response' => $response,
        ];
    }
}