<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\ItrPayment;
use App\Models\ItrReturn;
use App\Services\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {
    }

    /**
     * List payments.
     */
    public function index(): JsonResponse
    {
        $payments = $this->paymentService->paginate();

        return response()->json([
            'success' => true,
            'data' => PaymentResource::collection($payments),
        ]);
    }

    /**
     * Create Cashfree payment.
     */
    public function store(
        StorePaymentRequest $request
    ): JsonResponse {
        $itrReturn = ItrReturn::where(
            'uuid',
            $request->itr_return_uuid
        )->firstOrFail();

        $amount = (float) (
            $request->amount ?? 1
        );

        $payment = $this->paymentService
            ->createPayment(
                $itrReturn,
                $amount
            );

        return response()->json([
            'success' => true,
            'message' =>
                'Cashfree payment created successfully.',
            'data' =>
                new PaymentResource($payment),
        ], 201);
    }

    /**
     * Show payment.
     */
    public function show(
        int $id
    ): JsonResponse {
        $payment =
            $this->paymentService->find($id);

        if (! $payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' =>
                new PaymentResource($payment),
        ]);
    }

    /**
     * Update payment.
     */
    public function update(
        StorePaymentRequest $request,
        int $id
    ): JsonResponse {
        $payment =
            $this->paymentService->update(
                $id,
                $request->validated()
            );

        return response()->json([
            'success' => true,
            'message' =>
                'Payment updated successfully.',
            'data' =>
                new PaymentResource($payment),
        ]);
    }

    /**
     * Verify Cashfree payment from frontend.
     *
     * Frontend sends:
     *
     * payment_id
     * cashfree_order_id
     */
    public function verify(
        Request $request
    ): JsonResponse {
        $validated = $request->validate([
            'payment_id' => [
                'required',
                'integer',
            ],

            'cashfree_order_id' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        $payment =
            ItrPayment::find(
                $validated['payment_id']
            );

        if (! $payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found.',
            ], 404);
        }

        try {
            $result =
                $this->paymentService
                    ->verifyCashfreePayment(
                        $payment,
                        $validated[
                            'cashfree_order_id'
                        ]
                    );

            return response()->json([
                'success' =>
                    $result['status'] === 'success',

                'message' => match (
                    $result['status']
                ) {
                    'success' =>
                        'Payment verified successfully.',

                    'pending' =>
                        'Payment is still pending.',

                    default =>
                        'Payment verification failed.',
                },

                'data' => [
                    'payment' =>
                        new PaymentResource(
                            $payment->fresh()
                        ),

                    'verification' =>
                        $result,
                ],
            ], 200);

        } catch (\Throwable $e) {

            report($e);

            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to verify payment.',
            ], 500);
        }
    }

    /**
     * Cashfree browser return URL.
     *
     * Cashfree redirects the customer here
     * after checkout.
     *
     * IMPORTANT:
     * This endpoint does NOT mark payment successful
     * by trusting the browser redirect.
     *
     * It redirects the customer back to the
     * frontend. The frontend then calls /payments/verify,
     * which securely checks Cashfree's API.
     */
    public function cashfreeReturn(
        Request $request
    ) {
        $orderId =
            $request->query('order_id');

        if (! $orderId) {
            return response()->json([
                'success' => false,
                'message' =>
                    'Cashfree order ID is missing.',
            ], 400);
        }

        /*
         * Local frontend URL.
         *
         * Change this later for production.
         */
        $frontendUrl = rtrim(
            config(
                'app.frontend_url',
                'http://127.0.0.1:3000'
            ),
            '/'
        );

        return redirect()->away(
            $frontendUrl .
            '/payment/callback?order_id=' .
            urlencode($orderId)
        );
    }

    /**
     * Delete payment.
     */
    public function destroy(
        int $id
    ): JsonResponse {
        $this->paymentService->delete($id);

        return response()->json([
            'success' => true,
            'message' =>
                'Payment deleted successfully.',
        ]);
    }
}