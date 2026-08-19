"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import {
    ArrowLeft,
    Calendar,
    Download,
    FileText,
    IndianRupee,
    User,
} from "lucide-react";

import { toast } from "sonner";
import { saveAs } from "file-saver";
import itrService from "@/services/itr.service";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

interface ReturnDetails {
    uuid: string;

    assessment_year: string;

    financial_year: string;

    status: string;

    tax_payable: number;

    gross_total_income: number;

    total_deductions: number;

    taxable_income: number;

    total_tax: number;

    refund_amount: number;

    payment_status?: string;

    created_at: string;

    updated_at: string;

    user?: {
        name: string;

        email: string;
    };

    company?: {
        name: string;
    };
}

export default function ItrDetailsPage() {

    const router = useRouter();

    const params = useParams();

    const uuid = params.uuid as string;

    const [loading, setLoading] =
        useState(true);

    const [data, setData] =
        useState<ReturnDetails | null>(
            null
        );

    const loadReturn = async () => {
        try {
            setLoading(true);
            const response =
                await itrService.get(uuid);
            setData(response.data.data);
        } catch {
            toast.error(
                "Unable to load return."
            );
        } finally {
            setLoading(false);
        }
    };

    const downloadPdf = async () => {
    try {
        const response =
            await itrService.download(uuid);

        saveAs(
            response.data,
            `ITR-${uuid}.pdf`
        );

        toast.success(
            "PDF downloaded successfully."
        );
    } catch {
        toast.error(
            "Unable to download PDF."
        );
    }
};

    useEffect(() => {

        if (uuid) {

            void loadReturn();

        }

    }, [uuid]);

    if (loading) {

        return (

            <div className="flex h-72 items-center justify-center">

                Loading Return...

            </div>

        );

    }

    if (!data) {

        return (

            <div className="flex h-72 items-center justify-center">

                Return not found.

            </div>

        );

    }

    return (

        <div className="space-y-8">

            <div className="flex items-center justify-between">

                <div>

                    <Button
                        variant="ghost"
                        onClick={() =>
                            router.back()
                        }
                    >

                        <ArrowLeft className="mr-2 h-4 w-4" />

                        Back

                    </Button>

                    <h1 className="mt-4 text-3xl font-bold">

                        Income Tax Return

                    </h1>

                    <p className="mt-2 text-slate-500">

                        Return ID: {data.uuid}

                    </p>

                </div>

              <Button
    onClick={downloadPdf}
>
    <Download className="mr-2 h-4 w-4" />

    Download PDF
</Button>

            </div>
                        <div className="grid gap-6 lg:grid-cols-3">

                <Card className="lg:col-span-2">

                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                            <User className="h-5 w-5" />

                            Return Details

                        </CardTitle>

                    </CardHeader>

                    <CardContent className="grid gap-5 md:grid-cols-2">

                        <Info
                            label="Assessment Year"
                            value={data.assessment_year}
                        />

                        <Info
                            label="Financial Year"
                            value={data.financial_year}
                        />

                        <Info
                            label="Status"
                            value={
                                <Badge>
                                    {data.status}
                                </Badge>
                            }
                        />

                        <Info
                            label="Payment Status"
                            value={
                                <Badge
    variant={
        data.payment_status === "Paid"
            ? "success"
            : data.payment_status === "Failed"
            ? "danger"
            : "warning"
    }
>
    {data.payment_status ?? "Pending"}
</Badge>
                            }
                        />

                        <Info
                            label="Created"
                            value={new Date(
                                data.created_at
                            ).toLocaleDateString(
                                "en-IN"
                            )}
                        />

                        <Info
                            label="Last Updated"
                            value={new Date(
                                data.updated_at
                            ).toLocaleDateString(
                                "en-IN"
                            )}
                        />

                    </CardContent>

                </Card>

                <Card>

                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                            <IndianRupee className="h-5 w-5" />

                            Tax Summary

                        </CardTitle>

                    </CardHeader>

                    <CardContent className="space-y-5">

                        <SummaryRow
                            title="Gross Income"
                            value={
                                data.gross_total_income
                            }
                        />

                        <SummaryRow
                            title="Deductions"
                            value={
                                data.total_deductions
                            }
                        />

                        <SummaryRow
                            title="Taxable Income"
                            value={
                                data.taxable_income
                            }
                        />

                        <SummaryRow
                            title="Total Tax"
                            value={
                                data.total_tax
                            }
                        />

                        <SummaryRow
                            title="Refund"
                            value={
                                data.refund_amount
                            }
                        />

                        <div className="rounded-xl bg-blue-50 p-5">

                            <p className="text-sm text-slate-500">

                                Tax Payable

                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-blue-700">

                                ₹
                                {Number(
                                    data.tax_payable ?? 0
                                ).toLocaleString(
                                    "en-IN"
                                )}

                            </h2>

                        </div>

                    </CardContent>

                </Card>

            </div>

            <Card>

                <CardHeader>

                    <CardTitle className="flex items-center gap-2">

                        <Calendar className="h-5 w-5" />

                        Timeline

                    </CardTitle>

                </CardHeader>

                <CardContent>

                    <div className="space-y-4">

                        <TimelineItem
                            title="Return Created"
                            date={new Date(
                                data.created_at
                            ).toLocaleString(
                                "en-IN"
                            )}
                        />

                        <TimelineItem
                            title="Last Updated"
                            date={new Date(
                                data.updated_at
                            ).toLocaleString(
                                "en-IN"
                            )}
                        />

                        <TimelineItem
                            title="Current Status"
                            date={data.status}
                        />

                    </div>

                </CardContent>

            </Card>
                    </div>
    );
}

interface InfoProps {
    label: string;
    value: React.ReactNode;
}

function Info({
    label,
    value,
}: InfoProps) {
    return (
        <div className="rounded-lg border p-4">

            <p className="text-sm text-slate-500">
                {label}
            </p>

            <div className="mt-2 font-semibold">
                {value}
            </div>

        </div>
    );
}

interface SummaryRowProps {
    title: string;
    value: number;
}

function SummaryRow({
    title,
    value,
}: SummaryRowProps) {
    return (
        <div className="flex items-center justify-between">

            <span className="text-slate-500">
                {title}
            </span>

            <span className="font-semibold">

                ₹
                {Number(value ?? 0).toLocaleString(
                    "en-IN"
                )}

            </span>

        </div>
    );
}

interface TimelineItemProps {
    title: string;
    date: string;
}

function TimelineItem({
    title,
    date,
}: TimelineItemProps) {
    return (
        <div className="flex items-start gap-4">

            <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />

            <div>

                <h4 className="font-medium">
                    {title}
                </h4>

                <p className="text-sm text-slate-500">
                    {date}
                </p>

            </div>

        </div>
    );
}