"use client";

import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCreateCompany } from "@/hooks/useCompanies";
import { useCompanyWizard } from "@/hooks/useCompanyWizard";
import * as CompanyService from "@/services/company/company.service";

interface Props {
    previous: () => void;
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

const COMPANY_REGISTRATION_AMOUNT = 9999;

export default function ReviewStep({ previous }: Props) {
    const {
        data,
        documents,
        reset,
    } = useCompanyWizard();

    const mutation = useCreateCompany();

    const [processing, setProcessing] = useState(false);

    async function loadCashfree(): Promise<boolean> {
        if (window.Cashfree) {
            return true;
        }

        return new Promise<boolean>((resolve) => {
            const existingScript = document.querySelector(
                'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]',
            );

            if (existingScript) {
                existingScript.addEventListener("load", () => {
                    resolve(typeof window.Cashfree === "function");
                });

                existingScript.addEventListener("error", () => {
                    resolve(false);
                });

                return;
            }

            const script = document.createElement("script");

            script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
            script.async = true;

            script.onload = () => {
                resolve(typeof window.Cashfree === "function");
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    }

    async function submit() {
        if (processing || mutation.isPending) {
            return;
        }

        let companyId: number | null = null;
        let paymentId: number | null = null;

        try {
            setProcessing(true);

            /*
             * Step 1:
             * Create company registration.
             */
            const companyResponse = await mutation.mutateAsync(
                data as any,
            );

            const company = companyResponse.data;

            if (!company?.id) {
                throw new Error(
                    "Company created but company ID was not returned.",
                );
            }

            companyId = company.id;

            /*
             * Step 2:
             * Upload selected documents.
             */
            for (const document of documents) {
                const formData = new FormData();

                formData.append(
                    "document_type",
                    document.documentType,
                );

                formData.append(
                    "remarks",
                    document.remarks || document.name,
                );

                formData.append(
                    "file",
                    document.file,
                );

                await CompanyService.uploadDocuments(
                    company.id,
                    formData,
                );
            }

            /*
             * Step 3:
             * Create local company payment + Cashfree order.
             */
            toast.info("Creating secure payment...");

            const paymentResponse =
                await CompanyService.createCompanyPayment(
                    company.id,
                    COMPANY_REGISTRATION_AMOUNT,
                );

            if (
                !paymentResponse?.success ||
                !paymentResponse?.data?.payment?.id
            ) {
                throw new Error(
                    paymentResponse?.message ??
                    "Unable to create payment.",
                );
            }

            const payment =
                paymentResponse.data.payment;

            paymentId = payment.id;

            const paymentSessionId =
                paymentResponse.data.cashfree?.payment_session_id;

            const orderId =
                paymentResponse.data.cashfree?.order_id ??
                payment.gateway_order_id;

            if (!paymentSessionId) {
                throw new Error(
                    "Cashfree payment session is unavailable.",
                );
            }

            if (!orderId) {
                throw new Error(
                    "Cashfree order ID is unavailable.",
                );
            }

            /*
             * Step 4:
             * Load Cashfree browser SDK.
             */
            const loaded = await loadCashfree();

            if (!loaded || !window.Cashfree) {
                throw new Error(
                    "Unable to load Cashfree Checkout.",
                );
            }

            /*
             * Step 5:
             * Open Cashfree checkout.
             */
            const cashfree = window.Cashfree({
                mode: "sandbox",
            });

            toast.info("Opening secure Cashfree checkout...");

            await cashfree.checkout({
                paymentSessionId,
                redirectTarget: "_modal",
            });

            /*
             * Step 6:
             * Verify payment from Laravel backend.
             */
            toast.info("Verifying payment...");

            const verification =
                await CompanyService.verifyCompanyPayment(
                    paymentId,
                );

            const status =
                verification?.data?.verification?.status ??
                verification?.data?.payment?.payment_status;

            if (
                verification?.success === true &&
                status === "success"
            ) {
                /*
                 * Step 7:
                 * Only now submit company for processing.
                 *
                 * draft -> pending
                 */
                await CompanyService.submitCompany(
                    company.id,
                );

                toast.success(
                    "Payment successful. Company Registration submitted successfully.",
                );

                reset();

                return;
            }

            if (status === "pending") {
                toast.info(
                    "Payment is still being processed. Company registration has not been submitted yet.",
                );

                return;
            }

            toast.error(
                verification?.message ??
                "Payment could not be verified. Company registration has not been submitted.",
            );
        } catch (error: any) {
            console.error(
                "Company registration payment flow failed:",
                error,
            );

            const message =
                error?.response?.data?.message ??
                error?.message ??
                "Unable to complete payment.";

            toast.error(message);

            /*
             * Payment/company remains pending/draft.
             * We intentionally DO NOT submit the company here.
             */
            if (companyId) {
                console.warn(
                    "Company was created but registration was not submitted because payment was not completed.",
                    {
                        companyId,
                        paymentId,
                    },
                );
            }
        } finally {
            setProcessing(false);
        }
    }

    const disabled =
        processing ||
        mutation.isPending;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold">
                    Review & Payment
                </h2>

                <p className="mt-2 text-slate-500">
                    Review your company registration details
                    and complete the secure payment.
                </p>
            </div>

            <div className="rounded-xl border p-6 space-y-3">
                <p>
                    <strong>Company:</strong>{" "}
                    {data.company_name || "-"}
                </p>

                <p>
                    <strong>Type:</strong>{" "}
                    {data.company_type || "-"}
                </p>

                <p>
                    <strong>State:</strong>{" "}
                    {data.state || "-"}
                </p>

                <p>
                    <strong>City:</strong>{" "}
                    {data.city || "-"}
                </p>

                <p>
                    <strong>Shareholders:</strong>{" "}
                    {Array.isArray(data.shareholders)
                        ? data.shareholders.filter(
                              (shareholder) =>
                                  shareholder?.name?.trim(),
                          ).length
                        : 0}
                </p>

                <p>
                    <strong>Documents:</strong>{" "}
                    {documents.length}
                </p>

                {documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="rounded-lg bg-slate-50 px-4 py-3 text-sm"
                            >
                                {document.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-xl border p-6">
                <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-blue-600" />

                    <div>
                        <h3 className="font-semibold">
                            Company Registration Fee
                        </h3>

                        <p className="text-sm text-slate-500">
                            Secure payment via Cashfree
                        </p>
                    </div>

                    <div className="ml-auto text-2xl font-bold">
                        ₹{COMPANY_REGISTRATION_AMOUNT.toLocaleString("en-IN")}
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-lg bg-green-50 p-4">
                    <ShieldCheck className="h-5 w-5 text-green-600" />

                    <span className="text-sm font-medium text-green-700">
                        UPI, Cards, Net Banking and Wallets
                        supported through secure Cashfree Checkout.
                    </span>
                </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Your company registration will be submitted for
                processing only after successful payment verification.
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={previous}
                    disabled={disabled}
                    className="rounded-lg border px-6 py-3 disabled:opacity-50"
                >
                    Previous
                </button>

                <button
                    type="button"
                    onClick={submit}
                    disabled={disabled}
                    className="flex min-w-[240px] items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-white disabled:opacity-50"
                >
                    {disabled ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay ₹{COMPANY_REGISTRATION_AMOUNT.toLocaleString("en-IN")}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
