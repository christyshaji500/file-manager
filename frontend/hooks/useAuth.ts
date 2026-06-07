"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/services/auth.service";

export const useAuth = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const data = await getProfile();

                setUser(data.user);

            } catch {

                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        fetchUser();

    }, []);

    return {
        user,
        loading
    };

};