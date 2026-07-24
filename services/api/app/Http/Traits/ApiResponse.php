<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function success(
        mixed $data = null,
        string $message = "Success",
        int $status = 200,
        array $meta = []
    ): JsonResponse {

        return response()->json([
            "success" => true,
            "message" => $message,
            "data" => $data,
            "meta" => $meta,
        ], $status);

    }

    protected function error(
        string $message = "Something went wrong.",
        int $status = 400,
        mixed $errors = null
    ): JsonResponse {

        return response()->json([
            "success" => false,
            "message" => $message,
            "errors" => $errors,
        ], $status);

    }
}