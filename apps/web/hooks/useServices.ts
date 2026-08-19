"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Service } from "@/types/service";

interface ServicesResponse {
    success: boolean;
    message: string;
    data: {
        services: Service[];
    };
}

export function useServices() {
    const [data, setData] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadServices() {
            try {
                setIsLoading(true);
                setIsError(false);

                const response = await api.get<ServicesResponse>("/services");

                if (mounted) {
                    setData(response.data?.data?.services ?? []);
                }
            } catch (error) {
                console.error("Failed to load services:", error);

                if (mounted) {
                    setData([]);
                    setIsError(true);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        loadServices();

        return () => {
            mounted = false;
        };
    }, []);

    return {
        data,
        isLoading,
        isError,
    };
}

export function useFeaturedServices() {
    const [data, setData] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadFeaturedServices() {
            try {
                setIsLoading(true);
                setIsError(false);

                const response = await api.get<ServicesResponse>(
                    "/services/featured"
                );

                if (mounted) {
                    setData(response.data?.data?.services ?? []);
                }
            } catch (error) {
                console.error("Failed to load featured services:", error);

                if (mounted) {
                    setData([]);
                    setIsError(true);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        loadFeaturedServices();

        return () => {
            mounted = false;
        };
    }, []);

    return {
        data,
        isLoading,
        isError,
    };
}
