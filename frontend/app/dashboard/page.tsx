"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import {
    getFiles,
    uploadFile,
    deleteFile
} from "@/services/file.service";

import { logout } from "@/services/auth.service";

import { FileItem } from "@/types/file.types";

export default function DashboardPage() {

    const router = useRouter();

    const { user, loading } = useAuth();

    const [success, setSuccess] =
    useState("");

const [error, setError] =
    useState("");

    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const [files, setFiles] =
        useState<FileItem[]>([]);

    const [uploading, setUploading] =
        useState(false);

    const [fetching, setFetching] =
        useState(true);

    const loadFiles = async () => {

        try {

            const data = await getFiles();

            setFiles(data.files);

        } catch (error) {

            console.log(error);

        } finally {

            setFetching(false);

        }

    };

    const handleUpload = async () => {

        if (!selectedFile) return;

        try {

            setUploading(true);

            await uploadFile(selectedFile);

            setSelectedFile(null);

            await loadFiles();
            setSuccess(
    "File uploaded successfully"
);

        } catch (error) {

            console.log(error);

        } finally {

            setUploading(false);

        }

    };

    const handleDelete = async (
        id: number
    ) => {

        try {

            // await deleteFile(id);
            const confirmed =
    window.confirm(
        "Are you sure you want to delete this file?"
    );

if (!confirmed) return;

await deleteFile(id);

            await loadFiles();
            setSuccess(
    "File deleted successfully"
);

        } catch (error) {

            console.log(error);

        }

    };

    const handleLogout = async () => {

        await logout();

        router.push("/login");

    };

    useEffect(() => {

        if (!loading && !user) {

            router.push("/login");

        }

    }, [loading, user, router]);

    useEffect(() => {

        if (user) {

            loadFiles();

        }

    }, [user]);

    if (loading) {

        return (
            <div className="p-10">
                Loading...
            </div>
        );

    }

    if (!user) {

        return null;

    }

    return (

        
        <div className="min-h-screen bg-gray-100">
            {
    success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
        </div>
    )
}

{
    error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
        </div>
    )
}

            <div className="max-w-5xl mx-auto p-8">

                <div className="flex justify-between items-center mb-8">

                    <div>

    <h1 className="text-3xl font-bold">
        File Manager
    </h1>

    <p className="text-gray-600 mt-1">
        Welcome back, {user.username} 👋
    </p>

</div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>

                </div>

                <div className="bg-white p-6 rounded-lg shadow mb-8">

                    <h2 className="text-xl font-semibold mb-4">
                        Upload File
                    </h2>

                    <input
                        type="file"
                        onChange={(e) =>
                            setSelectedFile(
                                e.target.files?.[0] || null
                            )
                        }
                    />

                    <button
                        onClick={handleUpload}
                        disabled={
                            !selectedFile || uploading
                        }
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {
                            uploading
                                ? "Uploading..."
                                : "Upload"
                        }
                    </button>

                </div>

                <div className="bg-white p-6 rounded-lg shadow">

                    <h2 className="text-xl font-semibold mb-4">
                        My Files
                    </h2>

                    {
                        fetching
                            ? (
                                <p>
                                    Loading files...
                                </p>
                            )
                            : files.length === 0
                                ? (
                                   <div className="text-center py-10 text-gray-500">

    📁

    <p className="mt-2">
        No files uploaded yet
    </p>

    

</div>
                                )
                                : (
                                    <table className="w-full">

                                        <thead>

                                            <tr className="border-b">

                                                <th className="text-left py-3">
                                                    File Name
                                                </th>

                                                <th className="text-left py-3">
                                                    Type
                                                </th>

                                                <th className="text-left py-3">
                                                    Size
                                                </th>

                                                <th className="text-left py-3">
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                files.map(
                                                    (file) => (
                                                        <tr
                                                            key={file.id}
                                                            className="border-b"
                                                        >

                                                            <td className="py-3">
                                                                {
                                                                    file.original_name
                                                                }
                                                            </td>

                                                            <td className="py-3">
                                                                {
                                                                    file.mime_type
                                                                }
                                                            </td>

                                                            <td className="py-3">
                                                                {
                                                                    Number(file.file_size / 1024).toFixed(2)
                                                                } KB
                                                            </td>
                                                            <a
    href={file.s3_url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-500 text-white px-3 py-1 rounded"
>
    View
</a>

                                                            <td className="py-3">

                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            file.id
                                                                        )
                                                                    }
                                                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                                                >
                                                                    Delete
                                                                </button>

                                                            </td>

                                                        </tr>
                                                    )
                                                )
                                            }

                                        </tbody>

                                    </table>
                                )
                    }

                </div>

            </div>

        </div>
    );

}