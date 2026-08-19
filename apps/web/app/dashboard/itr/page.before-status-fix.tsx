"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
    Eye,
    Download,
    Pencil,
    Trash2,
    Search,
    FileText,
    CheckCircle2,
    Clock3,
    IndianRupee,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import itrService from "@/services/itr.service";

import { toast } from "sonner";

interface ItrReturn {
    id: number;
    uuid: string;

    assessment_year?: string;

    financial_year?: string;

    status?: string;

    tax_payable?: number;

    payment_status?: string;

    created_at: string;

    return_number?: string;

    pan?: string;
}

export default function ItrDashboardPage() {
    const [loading, setLoading] =
        useState(true);

    const [returns, setReturns] =
        useState<ItrReturn[]>([]);

    const [search, setSearch] =
        useState("");

    const loadReturns = async () => {
        try {
            setLoading(true);

            const response =
                await itrService.getAll();

            setReturns(
                response.data.data ?? []
            );
        } catch {
            toast.error(
                "Unable to load returns."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadReturns();
    }, []);

   const filteredReturns = useMemo(() => {
    return returns.filter((item: any) => {
        return (
            (item.assessment_year ?? "")
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            (item.return_number ?? "")
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            (item.pan ?? "")
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    });
}, [returns, search]);

    const totalReturns =
        returns.length;

    const submitted =
        returns.filter(
            (x) =>
                x.status ===
                "submitted"
        ).length;

    const draft =
        returns.filter(
            (x) =>
                x.status === "draft"
        ).length;

    const completed =
        returns.filter(
            (x) =>
                x.status ===
                "completed"
        ).length;

    if (loading) {
        return (
            <div className="flex h-72 items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="space-y-8">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        My Income Tax Returns
                    </h1>

                    <p className="mt-2 text-slate-500">
                        View and manage all your filed returns.
                    </p>

                </div>

                <Link href="/itr">

                    <Button>
                        File New Return
                    </Button>

                </Link>

            </div>

            <div className="grid gap-6 md:grid-cols-4">

                <Card>

                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                            <FileText className="h-5 w-5" />

                            Total

                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="text-3xl font-bold">
                            {totalReturns}
                        </div>

                    </CardContent>

                </Card>

                <Card>

                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                            <Clock3 className="h-5 w-5" />

                            Draft

                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="text-3xl font-bold">
                            {draft}
                        </div>

                    </CardContent>

                </Card>

                <Card>

                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                            <IndianRupee className="h-5 w-5" />

                            Submitted

                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="text-3xl font-bold">
                            {submitted}
                        </div>

                    </CardContent>

                </Card>

                <Card>

                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                            <CheckCircle2 className="h-5 w-5" />

                            Completed

                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="text-3xl font-bold">
                            {completed}
                        </div>

                    </CardContent>

                </Card>

            </div>

            <Card>

                <CardContent className="p-6">

                    <Input
                        placeholder="Search Assessment Year..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </CardContent>

            </Card>
                        <Card>

                <CardHeader>

                    <CardTitle>
                        My Returns
                    </CardTitle>

                </CardHeader>

                <CardContent className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="border-b text-left">

                                <th className="py-3">
                                    Assessment Year
                                </th>

                                <th className="py-3">
                                    Status
                                </th>

                                <th className="py-3">
                                    Tax Payable
                                </th>

                                <th className="py-3">
                                    Created
                                </th>

                                <th className="py-3 text-right">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredReturns.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="py-10 text-center text-slate-500"
                                    >
                                        No Income Tax Returns Found.
                                    </td>

                                </tr>

                            ) : (

                                filteredReturns.map(
                                    (item) => (

                                        <tr
                                            key={item.uuid}
                                            className="border-b"
                                        >

                                            <td className="py-4 font-medium">

                                                {item.assessment_year}

                                            </td>

                                            <td>

                                 <Badge
    variant={
        item.status === "completed"
            ? "success"
            : item.status === "submitted"
            ? "warning"
            : "default"
    }
>
    {item.status}
</Badge>

                                            </td>

                                            <td>

                                                ₹
                                                {Number(
                                                    item.tax_payable ?? 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </td>

                                            <td>

                                                {new Date(
                                                    item.created_at
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}

                                            </td>

                                            <td>

                                                <div className="flex justify-end gap-2">

                                                    <Link
                                                        href={`/itr?uuid=${item.uuid}`}
                                                    >

                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                        >

                                                            <Pencil className="h-4 w-4" />

                                                        </Button>

                                                    </Link>

                                                    <Link
                                                        href={`/itr/${item.uuid}`}
                                                    >

                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                        >

                                                            <Eye className="h-4 w-4" />

                                                        </Button>

                                                    </Link>

                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={() =>
                                                            toast.info(
                                                                "Download will be available soon."
                                                            )
                                                        }
                                                    >

                                                        <Download className="h-4 w-4" />

                                                    </Button>

                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            toast.info(
                                                                "Delete feature coming soon."
                                                            )
                                                        }
                                                    >

                                                        <Trash2 className="h-4 w-4" />

                                                    </Button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </CardContent>

            </Card>
                    </div>
    );
}