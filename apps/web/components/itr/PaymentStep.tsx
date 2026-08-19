"use client";

import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { getApiError } from "@/lib/getApiError";
import paymentService from "@/services/payment.service";
import { useItrStore } from "@/store/itr";

interface PaymentSummary {
  id: number;
  amount: number;
  gst: number;
  total: number;
  currency: string;
  payment_status?: string;
  payment_gateway?: string;
  cashfree_order_id?: string;
  payment_session_id?: string;
}

interface PaymentResponse {
  success: boolean;
  message?: string;
  data: PaymentSummary;
}

interface CashfreeInstance {
  checkout(options: {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_modal" | "_top";
  }): Promise<void>;
}

interface CashfreeFactory {
  (options: {
    mode: "sandbox" | "production";
  }): CashfreeInstance;
}

declare global {
  interface Window {
    Cashfree?: CashfreeFactory;
  }
}

export default function PaymentStep() {
  const uuid = useItrStore(
    (state) => state.uuid
  );

  const setStep = useItrStore(
    (state) => state.setStep
  );

  const [loading, setLoading] =
    useState(true);

  const [paying, setPaying] =
    useState(false);

  const [summary, setSummary] =
    useState<PaymentSummary | null>(null);

  const loadPayment =
    useCallback(async () => {
      if (!uuid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response =
          (await paymentService.create({
            itr_return_uuid: uuid,
            amount: 1,
            currency: "INR",
          })) as PaymentResponse;

        setSummary(response.data);
      } catch (error: unknown) {
        toast.error(
          getApiError(
            error,
            "Unable to load payment."
          )
        );
      } finally {
        setLoading(false);
      }
    }, [uuid]);

  useEffect(() => {
    void loadPayment();
  }, [loadPayment]);

  const loadCashfree = async () => {
    return new Promise<boolean>(
      (resolve) => {
        if (window.Cashfree) {
          resolve(true);
          return;
        }

        const script =
          document.createElement("script");

        script.src =
          "https://sdk.cashfree.com/js/v3/cashfree.js";

        script.async = true;

        script.onload = () => {
          resolve(
            typeof window.Cashfree ===
              "function"
          );
        };

        script.onerror = () => {
          resolve(false);
        };

        document.body.appendChild(
          script
        );
      }
    );
  };

  const verifyPayment = async (
    payment: PaymentSummary
  ) => {
    if (
      !payment.id ||
      !payment.cashfree_order_id
    ) {
      throw new Error(
        "Cashfree payment information is missing."
      );
    }

    return paymentService.verify({
      payment_id: payment.id,
      cashfree_order_id:
        payment.cashfree_order_id,
    });
  };

  const payNow = async () => {
    if (!summary) {
      return;
    }

    if (!summary.payment_session_id) {
      toast.error(
        "Cashfree payment session is unavailable."
      );
      return;
    }

    if (!summary.cashfree_order_id) {
      toast.error(
        "Cashfree order ID is unavailable."
      );
      return;
    }

    setPaying(true);

    try {
      const loaded =
        await loadCashfree();

      if (!loaded || !window.Cashfree) {
        throw new Error(
          "Unable to load Cashfree Checkout."
        );
      }

      const cashfree =
        window.Cashfree({
          mode: "sandbox",
        });

      await cashfree.checkout({
        paymentSessionId:
          summary.payment_session_id,
        redirectTarget: "_modal",
      });

      /*
       * Cashfree checkout has returned.
       * Verify the actual payment status
       * from our Laravel backend.
       */
      const verification =
        await verifyPayment(summary);

      const status =
  verification?.data
    ?.verification?.status ??
  verification?.data
    ?.payment?.payment_status;

      if (
        verification?.success === true ||
        status === "success"
      ) {
        toast.success(
          "Payment successful."
        );

        setStep(7);

        return;
      }

      if (status === "pending") {
        toast.info(
          "Payment is still being processed. Please wait and try again."
        );

        return;
      }

      toast.error(
        verification?.message ??
          "Payment could not be verified."
      );
    } catch (error: unknown) {
      toast.error(
        getApiError(
          error,
          "Unable to complete payment."
        )
      );
    } finally {
      setPaying(false);
    }
  };

  const format = (
    amount: number
  ) =>
    new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
      }
    ).format(amount);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading Payment...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex h-64 items-center justify-center">
        Payment information unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Payment
        </h2>

        <p className="mt-2 text-slate-500">
          Complete your payment securely to
          continue with your Income Tax Return
          filing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Order Summary
          </h3>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>
                ITR Filing Charges
              </span>

              <span>
                {format(summary.amount)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>

              <span>
                {format(summary.gst)}
              </span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">
              <span>
                Total Payable
              </span>

              <span className="text-blue-600">
                {format(summary.total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Payment Method
          </h3>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border p-5 transition hover:border-blue-500">
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-blue-600" />

              <div>
                <h4 className="font-semibold">
                  Cashfree Secure Checkout
                </h4>

                <p className="text-sm text-slate-500">
                  UPI • Cards • Net Banking • Wallet
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-lg bg-green-50 p-4">
            <ShieldCheck className="h-5 w-5 text-green-600" />

            <span className="text-sm font-medium text-green-700">
              Your payment is protected with
              secure Cashfree checkout.
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={paying}
          onClick={() => setStep(5)}
        >
          Previous
        </Button>

        <Button
          type="button"
          disabled={paying}
          onClick={payNow}
          className="min-w-[220px]"
        >
          {paying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {format(summary.total)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}