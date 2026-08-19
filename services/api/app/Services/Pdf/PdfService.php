<?php

namespace App\Services\Pdf;

use App\Models\ItrReturn;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PdfService
{
    /**
     * Generate ITR Summary PDF
     */
    public function generate(
        ItrReturn $return
    ): BinaryFileResponse {

        $pdf = Pdf::loadView(
            'pdf.itr-summary',
            [
                'return' => $return,
            ]
        );

        $fileName =
            'itr-summary-' .
            $return->uuid .
            '.pdf';

        return response()->download(
            tap(
                storage_path(
                    'app/temp/' . $fileName
                ),
                function ($path) use ($pdf) {

                    if (! is_dir(dirname($path))) {
                        mkdir(
                            dirname($path),
                            0777,
                            true
                        );
                    }

                    $pdf->save($path);

                }
            ),
            $fileName
        )->deleteFileAfterSend(true);
    }
}