"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const useRedirectIfAuthenticated = () => {

    const router = useRouter();

    const {
        user,
        loading
    } = useAuth();

    useEffect(() => {

        if (!loading && user) {

            router.push("/dashboard");

        }

    }, [loading, user, router]);

    return {
        loading
    };

};