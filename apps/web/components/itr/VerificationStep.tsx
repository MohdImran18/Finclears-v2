"use client";

import {
  ArrowRight,
  CheckCircle2,
  Download,
  Loader2,
  ShieldCheck,
  Clock3,
  XCircle,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getApiError } from "@/lib/getApiError";
import itrService from "@/services/itr.service";
import kycService from "@/services/kyc.service";
import { useItrStore } from "@/store/itr";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

interface PaymentData {
  id: number;
  uuid?: string;
  itr_return_id: number;

  transaction_id?: string | null;

  amount: number;
  tax_amount?: number;
  interest_amount?: number;
  penalty_amount?: number;
  gateway_fee?: number;

  gst: number;
  total: number;

  currency: string;

  payment_status?: string;
  payment_gateway?: string | null;
  gateway_transaction_id?: string | null;

  paid_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AssessmentYearData {
  id: number;
  name: string;
  code: string;
}

interface ReturnStatusData {
  id: number;
  name: string;
  code: string;
}

interface VerificationData {
  id: number;
  uuid: string;

  acknowledgement_number?: string | null;

  assessment_year?: AssessmentYearData | string | null;

  status?: ReturnStatusData | string | null;

  payment?: PaymentData | null;

  pan?: string | null;
  pan_verification_status?: string | null;
  pan_verified_at?: string | null;

  aadhaar?: string | null;

  mobile?: string | null;
  email?: string | null;

  gross_income?: number | string | null;
  total_deductions?: number | string | null;
  taxable_income?: number | string | null;
  tax_liability?: number | string | null;
  refund_amount?: number | string | null;
  net_payable?: number | string | null;

  workflow_stage?: string | null;
  completion_percentage?: number | null;

  is_verified?: boolean;
  is_validated?: boolean;
}

interface VerificationResponse {
  success?: boolean;
  message?: string;
  data: VerificationData;
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function VerificationStep() {
  const router = useRouter();

  const uuid = useItrStore(
    (state) => state.uuid
  );

  const [loading, setLoading] =
    useState(Boolean(uuid));

  const [submitting, setSubmitting] =
    useState(false);

  const [data, setData] =
    useState<VerificationData | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Aadhaar State
  |--------------------------------------------------------------------------
  */

  const [aadhaar, setAadhaar] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [referenceId, setReferenceId] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [aadhaarVerified, setAadhaarVerified] =
    useState(false);

  const [sendingOtp, setSendingOtp] =
    useState(false);

  const [verifyingAadhaar, setVerifyingAadhaar] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load Return
  |--------------------------------------------------------------------------
  */

  const loadReturn =
    useCallback(async () => {
      if (!uuid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response =
          (await itrService.get(uuid)) as {
            data: VerificationData;
          };

        setData(response.data);
      } catch (error: unknown) {
        toast.error(
          getApiError(
            error,
            "Unable to load return."
          )
        );
      } finally {
        setLoading(false);
      }
    }, [uuid]);

  useEffect(() => {
    void loadReturn();
  }, [loadReturn]);

  /*
  |--------------------------------------------------------------------------
  | Aadhaar OTP
  |--------------------------------------------------------------------------
  */

  const sendAadhaarOtp =
    useCallback(async () => {
      if (!uuid) {
        toast.error(
          "ITR return not found."
        );
        return;
      }

      if (!/^\d{12}$/.test(aadhaar)) {
        toast.error(
          "Please enter a valid 12-digit Aadhaar number."
        );
        return;
      }

      try {
        setSendingOtp(true);

        const response =
          await kycService.sendAadhaarOtp({
            itr_return_uuid: uuid,
            aadhaar,
          });

        const responseData =
          response.data?.data;

        const ref =
          responseData?.reference_id;

        if (!ref) {
          toast.error(
            "OTP reference was not received."
          );
          return;
        }

        setReferenceId(
          String(ref)
        );

        setOtpSent(true);

        toast.success(
          response.data?.message ??
            "Aadhaar OTP sent successfully."
        );
      } catch (error: unknown) {
        toast.error(
          getApiError(
            error,
            "Unable to send Aadhaar OTP."
          )
        );
      } finally {
        setSendingOtp(false);
      }
    }, [uuid, aadhaar]);

  /*
  |--------------------------------------------------------------------------
  | Verify Aadhaar OTP
  |--------------------------------------------------------------------------
  */

  const verifyAadhaar =
    useCallback(async () => {
      if (!uuid) {
        toast.error(
          "ITR return not found."
        );
        return;
      }

      if (!referenceId) {
        toast.error(
          "Please request Aadhaar OTP first."
        );
        return;
      }

      if (!/^\d{6}$/.test(otp)) {
        toast.error(
          "Please enter the 6-digit OTP."
        );
        return;
      }

      try {
        setVerifyingAadhaar(true);

        const response =
          await kycService.verifyAadhaarOtp({
            itr_return_uuid: uuid,
            aadhaar,
            reference_id: referenceId,
            otp,
          });

        const verification =
          response.data?.data?.verification;

        if (
          verification?.status ===
          "verified"
        ) {
          setAadhaarVerified(true);

          toast.success(
            response.data?.message ??
              "Aadhaar verified successfully."
          );

          await loadReturn();
        } else {
          toast.error(
            response.data?.message ??
              "Aadhaar verification failed."
          );
        }
      } catch (error: unknown) {
        toast.error(
          getApiError(
            error,
            "Unable to verify Aadhaar."
          )
        );
      } finally {
        setVerifyingAadhaar(false);
      }
    }, [
      uuid,
      aadhaar,
      otp,
      referenceId,
      loadReturn,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Submit / Verify Return
  |--------------------------------------------------------------------------
  */

  const verifyReturn =
    useCallback(async () => {
      if (!uuid) {
        toast.error(
          "ITR return not found."
        );
        return;
      }

      if (!aadhaarVerified) {
        toast.error(
          "Please complete Aadhaar verification first."
        );
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Payment must be successful before final submission
      |--------------------------------------------------------------------------
      */

      const currentPaymentStatus =
        String(
          data?.payment?.payment_status ?? ""
        ).toLowerCase();

      const paymentSuccessful =
        currentPaymentStatus === "success" ||
        currentPaymentStatus === "successful" ||
        currentPaymentStatus === "paid";

      if (!paymentSuccessful) {
        toast.error(
          "Please complete the payment before submitting the return."
        );
        return;
      }

      try {
        setSubmitting(true);

        const response =
          (await itrService.submit(
            uuid
          )) as VerificationResponse;

        setData(response.data);

        toast.success(
          response.message ??
            "Income Tax Return submitted successfully."
        );

        await loadReturn();
      } catch (error: unknown) {
        toast.error(
          getApiError(
            error,
            "Unable to submit return."
          )
        );
      } finally {
        setSubmitting(false);
      }
    }, [
      uuid,
      aadhaarVerified,
      data?.payment?.payment_status,
      loadReturn,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Download Summary
  |--------------------------------------------------------------------------
  */

  const downloadSummary =
    useCallback(() => {
      toast.info(
        "Download will be available after acknowledgement generation."
      );
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const formatCurrency = (
    value: number | string | null | undefined
  ) => {
    const numericValue =
      Number(value ?? 0);

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
      }
    ).format(
      Number.isFinite(numericValue)
        ? numericValue
        : 0
    );
  };

  const getAssessmentYear = () => {
    if (
      typeof data?.assessment_year ===
        "object" &&
      data.assessment_year
    ) {
      return data.assessment_year.name;
    }

    return (
      data?.assessment_year ??
      "-"
    );
  };

  const getReturnStatus = () => {
    if (
      typeof data?.status ===
        "object" &&
      data.status
    ) {
      return data.status.name;
    }

    return data?.status ?? "-";
  };

  /*
  |--------------------------------------------------------------------------
  | Payment State
  |--------------------------------------------------------------------------
  */

  const payment =
    data?.payment ?? null;

  const paymentStatus = String(
    payment?.payment_status ?? "pending"
  ).toLowerCase();

  const isPaymentSuccessful =
    paymentStatus === "success" ||
    paymentStatus === "successful" ||
    paymentStatus === "paid";

  const isPaymentPending =
    paymentStatus === "pending" ||
    paymentStatus === "processing";

  const isPaymentFailed =
    paymentStatus === "failed" ||
    paymentStatus === "failure" ||
    paymentStatus === "cancelled";

  const paymentGateway =
    payment?.payment_gateway ??
    "-";

  const paymentTransactionId =
    payment?.gateway_transaction_id ??
    payment?.transaction_id ??
    "-";

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading Verification...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        Verification data unavailable.
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="mx-auto max-w-4xl space-y-8">

      {/* --------------------------------------------------------------- */}
      {/* Payment Status Banner */}
      {/* --------------------------------------------------------------- */}

      <Card
        className={
          isPaymentSuccessful
            ? "border-green-200 bg-green-50"
            : isPaymentFailed
              ? "border-red-200 bg-red-50"
              : "border-yellow-200 bg-yellow-50"
        }
      >
        <CardContent className="py-10">
          <div className="flex flex-col items-center text-center">

            {isPaymentSuccessful ? (
              <CheckCircle2 className="mb-5 h-20 w-20 text-green-600" />
            ) : isPaymentFailed ? (
              <XCircle className="mb-5 h-20 w-20 text-red-600" />
            ) : (
              <Clock3 className="mb-5 h-20 w-20 text-yellow-600" />
            )}

            <h2 className="text-3xl font-bold text-slate-900">
              {isPaymentSuccessful
                ? "Payment Successful"
                : isPaymentFailed
                  ? "Payment Failed"
                  : "Payment Pending"}
            </h2>

            <p className="mt-3 max-w-xl text-slate-600">
              {isPaymentSuccessful
                ? "Your payment has been verified successfully. Complete Aadhaar verification and submit your return to finish your filing."
                : isPaymentFailed
                  ? "Your payment could not be completed. Please return to the payment step and try again."
                  : "Your payment has not been completed yet. Please complete the payment to continue with your Income Tax Return filing."}
            </p>

          </div>
        </CardContent>
      </Card>

      {/* --------------------------------------------------------------- */}
      {/* Payment Summary */}
      {/* --------------------------------------------------------------- */}

      <Card
        className={
          isPaymentSuccessful
            ? "border-green-200"
            : isPaymentFailed
              ? "border-red-200"
              : "border-yellow-200"
        }
      >
        <CardHeader>
          <h3 className="text-xl font-semibold">
            Payment Details
          </h3>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex justify-between">
            <span className="text-slate-500">
              Payment Status
            </span>

            <Badge
              className={
                isPaymentSuccessful
                  ? "bg-green-600 hover:bg-green-700"
                  : isPaymentFailed
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-yellow-500 hover:bg-yellow-600"
              }
            >
              {paymentStatus.toUpperCase()}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Filing Fee
            </span>

            <span className="font-semibold">
              {formatCurrency(
                payment?.amount
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              GST
            </span>

            <span className="font-semibold">
              {formatCurrency(
                payment?.gst
              )}
            </span>
          </div>

          <div className="border-t pt-4 flex justify-between">
            <span className="font-semibold">
              {isPaymentSuccessful
                ? "Total Paid"
                : "Total Payable"}
            </span>

            <span
              className={
                isPaymentSuccessful
                  ? "text-xl font-bold text-green-600"
                  : "text-xl font-bold text-blue-600"
              }
            >
              {formatCurrency(
                payment?.total
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Payment Gateway
            </span>

            <span className="font-semibold capitalize">
              {paymentGateway}
            </span>
          </div>

          {paymentTransactionId !== "-" && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Transaction ID
              </span>

              <span className="font-mono text-sm font-semibold break-all text-right">
                {paymentTransactionId}
              </span>
            </div>
          )}

          {payment?.paid_at && (
            <div className="flex justify-between">
              <span className="text-slate-500">
                Paid At
              </span>

              <span className="font-semibold">
                {payment.paid_at}
              </span>
            </div>
          )}

        </CardContent>
      </Card>

      {/* --------------------------------------------------------------- */}
      {/* Verification Methods */}
      {/* --------------------------------------------------------------- */}

      <Card>

        <CardHeader>
          <h3 className="text-xl font-semibold">
            Verify Your Return
          </h3>
        </CardHeader>

        <CardContent className="space-y-5">

          {/* Aadhaar OTP */}

          <div className="rounded-xl border p-5">

            <div className="flex items-start gap-4">

              <ShieldCheck className="mt-1 h-7 w-7 text-indigo-600" />

              <div className="w-full">

                <div className="flex items-center justify-between">

                  <h4 className="font-semibold">
                    Aadhaar OTP Verification
                  </h4>

                  {aadhaarVerified && (
                    <Badge className="bg-green-600">
                      Verified
                    </Badge>
                  )}

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Verify your return using Aadhaar OTP.
                </p>

                {!aadhaarVerified && (
                  <div className="mt-5 space-y-4">

                    {/* Aadhaar */}

                    <div>

                      <label className="mb-1 block text-sm font-medium">
                        Aadhaar Number
                      </label>

                      <div className="flex gap-2">

                        <Input
                          value={aadhaar}
                          onChange={(e) =>
                            setAadhaar(
                              e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 12)
                            )
                          }
                          placeholder="Enter 12-digit Aadhaar"
                          inputMode="numeric"
                          maxLength={12}
                          disabled={otpSent}
                        />

                        <Button
                          type="button"
                          onClick={
                            sendAadhaarOtp
                          }
                          disabled={
                            sendingOtp ||
                            aadhaar.length !==
                              12 ||
                            otpSent
                          }
                        >
                          {sendingOtp ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send OTP"
                          )}
                        </Button>

                      </div>

                    </div>

                    {/* OTP */}

                    {otpSent && (
                      <div>

                        <label className="mb-1 block text-sm font-medium">
                          OTP
                        </label>

                        <div className="flex gap-2">

                          <Input
                            value={otp}
                            onChange={(e) =>
                              setOtp(
                                e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6)
                              )
                            }
                            placeholder="Enter 6-digit OTP"
                            inputMode="numeric"
                            maxLength={6}
                          />

                          <Button
                            type="button"
                            onClick={
                              verifyAadhaar
                            }
                            disabled={
                              verifyingAadhaar ||
                              otp.length !==
                                6
                            }
                          >
                            {verifyingAadhaar ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              "Verify OTP"
                            )}
                          </Button>

                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          OTP has been sent to the mobile number
                          linked with your Aadhaar.
                        </p>

                      </div>
                    )}

                  </div>
                )}

                {aadhaarVerified && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">

                    <div className="flex items-center gap-2 text-green-700">

                      <CheckCircle2 className="h-5 w-5" />

                      <span className="font-medium">
                        Aadhaar verification completed successfully.
                      </span>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* EVC */}

          <div className="rounded-xl border p-5 transition hover:border-green-400">

            <div className="flex items-start gap-4">

              <ShieldCheck className="mt-1 h-7 w-7 text-green-600" />

              <div>

                <h4 className="font-semibold">
                  Net Banking / EVC
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  Verify your Income Tax Return using your bank account
                  through Electronic Verification Code (EVC).
                </p>

              </div>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* --------------------------------------------------------------- */}
      {/* Filing Summary */}
      {/* --------------------------------------------------------------- */}

      <Card>

        <CardHeader>
          <h3 className="text-xl font-semibold">
            Filing Summary
          </h3>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex justify-between">
            <span className="text-slate-500">
              Return Status
            </span>

            <Badge className="bg-green-600 hover:bg-green-700">
              {getReturnStatus()}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Assessment Year
            </span>

            <span className="font-semibold">
              {getAssessmentYear()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Payment Status
            </span>

            <span
              className={
                isPaymentSuccessful
                  ? "font-semibold text-green-600"
                  : isPaymentFailed
                    ? "font-semibold text-red-600"
                    : "font-semibold text-yellow-600"
              }
            >
              {paymentStatus}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              {isPaymentSuccessful
                ? "Filing Fee"
                : "Amount Due"}
            </span>

            <span className="font-semibold">
              {formatCurrency(
                payment?.amount
              )}
            </span>
          </div>

          <div className="flex justify-between border-t pt-4">

            <span className="font-semibold">
              {isPaymentSuccessful
                ? "Total Paid"
                : "Total Payable"}
            </span>

            <span
              className={
                isPaymentSuccessful
                  ? "font-bold text-green-600"
                  : "font-bold text-blue-600"
              }
            >
              {formatCurrency(
                payment?.total
              )}
            </span>

          </div>

        </CardContent>

      </Card>

      {/* --------------------------------------------------------------- */}
      {/* Aadhaar / PAN Verification Summary */}
      {/* --------------------------------------------------------------- */}

      <Card>

        <CardHeader>
          <h3 className="text-xl font-semibold">
            Verification Summary
          </h3>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex justify-between">

            <span className="text-slate-500">
              PAN Verification
            </span>

            <Badge
              className={
                data.pan_verification_status ===
                "verified"
                  ? "bg-green-600"
                  : "bg-yellow-500"
              }
            >
              {data.pan_verification_status ===
              "verified"
                ? "Verified"
                : "Pending"}
            </Badge>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Aadhaar Verification
            </span>

            <Badge
              className={
                aadhaarVerified
                  ? "bg-green-600"
                  : "bg-yellow-500"
              }
            >
              {aadhaarVerified
                ? "Verified"
                : "Pending"}
            </Badge>

          </div>

        </CardContent>

      </Card>

      {/* --------------------------------------------------------------- */}
      {/* Acknowledgement */}
      {/* --------------------------------------------------------------- */}

      {data.acknowledgement_number && (
        <Card className="border-blue-200 bg-blue-50">

          <CardHeader>
            <h3 className="text-lg font-semibold">
              Acknowledgement Number
            </h3>
          </CardHeader>

          <CardContent>

            <div className="rounded-lg bg-white p-4">

              <p className="font-mono text-lg font-bold text-blue-700">
                {data.acknowledgement_number}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Keep this acknowledgement number for future reference.
              </p>

            </div>

          </CardContent>

        </Card>
      )}

      {/* --------------------------------------------------------------- */}
      {/* Action Buttons */}
      {/* --------------------------------------------------------------- */}

      <div className="flex flex-wrap justify-end gap-4">

        <Button
          type="button"
          variant="outline"
          onClick={downloadSummary}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Summary
        </Button>

        <Button
          type="button"
          disabled={
            submitting ||
            !aadhaarVerified ||
            !isPaymentSuccessful
          }
          onClick={verifyReturn}
        >

          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Return
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}

        </Button>

      </div>

      {/* --------------------------------------------------------------- */}
      {/* Final Success */}
      {/* --------------------------------------------------------------- */}

      {data.acknowledgement_number && (
        <Card className="border-green-300 bg-green-50">

          <CardContent className="py-8">

            <div className="text-center">

              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600" />

              <h3 className="text-2xl font-bold text-green-700">
                Income Tax Return Filed Successfully
              </h3>

              <p className="mt-3 text-slate-600">
                Your Income Tax Return has been submitted successfully.
                You can now download the acknowledgement or
                return to your dashboard.
              </p>

              <Button
                className="mt-6"
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard"
                  )
                }
              >
                Go to Dashboard
              </Button>

            </div>

          </CardContent>

        </Card>
      )}

    </div>
  );
}