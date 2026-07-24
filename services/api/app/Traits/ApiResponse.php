<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    protected function error(
        string $message = 'Error',
        int $status = 400,
        mixed $errors = null
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    protected function validationError(
        mixed $errors,
        string $message = 'Validation Error'
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], 422);
    }

    protected function unauthorized(
        string $message = 'Unauthenticated.'
    ): JsonResponse {
        return $this->error($message, 401);
    }

    protected function forbidden(
        string $message = 'Forbidden.'
    ): JsonResponse {
        return $this->error($message, 403);
    }

    protected function notFound(
        string $message = 'Resource not found.'
    ): JsonResponse {
        return $this->error($message, 404);
    }

    protected function created(
        mixed $data = null,
        string $message = 'Created successfully.'
    ): JsonResponse {
        return $this->success($data, $message, 201);
    }
}