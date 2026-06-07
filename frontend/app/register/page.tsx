"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth.service";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";


export default function RegisterPage() {

    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loaded, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { loading } =useRedirectIfAuthenticated();
    
    if (loading) {
    return <div>Loading...</div>;
    }
   
    

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");

            await register(
                username,
                email,
                password
            );

            router.push("/login");

        } catch (err: any) {

            setError(
                err.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Register
                </h1>

                {error && (
                    <p className="text-red-500 mb-4">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        className="w-full border p-3 rounded"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full border p-3 rounded"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="w-full border p-3 rounded"
                    />

                    <button
                        type="submit"
                        disabled={loaded}
                        className="w-full bg-green-600 text-white p-3 rounded"
                    >
                        {
                            loaded
                                ? "Registering..."
                                : "Register"
                        }
                    </button>

                </form>

            </div>

        </div>
    );

}