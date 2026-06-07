import api from "@/lib/axios";

export const login = async (
    email: string,
    password: string
) => {

    const response = await api.post(
        "/auth/login",
        {
            email,
            password
        }
    );

    return response.data;
};

export const register = async (
    username: string,
    email: string,
    password: string
) => {

    const response = await api.post(
        "/auth/register",
        {
            username,
            email,
            password
        }
    );

    return response.data;
};

export const getProfile = async () => {

    const response = await api.get(
        "/auth/profile"
    );

    return response.data;
};

export const logout = async () => {

    const response = await api.post(
        "/auth/logout"
    );

    return response.data;
};