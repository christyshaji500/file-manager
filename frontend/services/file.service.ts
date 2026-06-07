import api from "@/lib/axios";

export const uploadFile = async (
    file: File
) => {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    const response = await api.post(
        "/files/upload",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );

    return response.data;
};

export const getFiles = async () => {

    const response = await api.get(
        "/files"
    );

    return response.data;
};

export const deleteFile = async (
    id: number
) => {

    const response = await api.delete(
        `/files/${id}`
    );

    return response.data;
};