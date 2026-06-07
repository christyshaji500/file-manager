const fs = require("fs");
const path = require("path");

const { createFile,getFilesByUserId,getFileById,deleteFileById } = require("../models/file.model");
const uploadToS3 = require("../utils/s3Upload");
const deleteFromS3 = require("../utils/s3Delete");

const uploadFile = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const s3Result = await uploadToS3(
         req.file
        );

        // const savedFile = await createFile(
        //     req.user.id,
        //     req.file.originalname,
        //     req.file.filename,
        //     req.file.path,
        //     req.file.size,
        //     req.file.mimetype
        // );

            const savedFile = await createFile(
                req.user.id,
                req.file.originalname,
                s3Result.key,
                s3Result.url,
                req.file.size,
                req.file.mimetype
            );

        res.status(201).json({
            success: true,
            file: savedFile
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Upload Failed"
        });

    }

};

const getFiles = async (req, res) => {

    try {

        const files = await getFilesByUserId(
            req.user.id
        );

        res.status(200).json({
            success: true,
            count: files.length,
            files
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch files"
        });

    }

};

const getFile = async (req, res) => {

    try {

        const file = await getFileById(
            req.params.id,
            req.user.id
        );

        if (!file) {

            return res.status(404).json({
                success: false,
                message: "File not found"
            });

        }

        res.status(200).json({
            success: true,
            file
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch file"
        });

    }

};

const deleteFile = async (req, res) => {

    try {

        const file = await getFileById(
            req.params.id,
            req.user.id
        );

        if (!file) {

            return res.status(404).json({
                success: false,
                message: "File not found"
            });

        }

        // const absolutePath = path.resolve(file.file_path);

        // if (fs.existsSync(absolutePath)) {

        //     fs.unlinkSync(absolutePath);

        // }
        await deleteFromS3( file.s3_key );

        await deleteFileById(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "File deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Delete failed"
        });

    }

};

module.exports = {
    uploadFile,
    getFiles,
    getFile,
    deleteFile
};