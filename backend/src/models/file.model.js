const pool = require("../config/db");

const createFile = async (
    userId,
    originalName,
    s3Key,
    s3Url,
    fileSize,
    mimeType
) => {

    const query = `
        INSERT INTO files(
            user_id,
            original_name,
            s3_key,
            s3_url,
            file_size,
            mime_type
        )
        VALUES($1,$2,$3,$4,$5,$6)
        RETURNING *
    `;

    const result = await pool.query(
        query,
        [
            userId,
            originalName,
            s3Key,
            s3Url,
            fileSize,
            mimeType
        ]
    );

    return result.rows[0];
};

const getFilesByUserId = async (userId) => {

    const query = `
        SELECT  
        id,
        original_name,
        file_size,
        mime_type,
        created_at
        FROM files
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;

    const result = await pool.query(
        query,
        [userId]
    );

    return result.rows;
};


const getFileById = async (fileId, userId) => {

    const query = `
        SELECT *
        FROM files
        WHERE id = $1
        AND user_id = $2
    `;

    const result = await pool.query(
        query,
        [fileId, userId]
    );

    return result.rows[0];
};

const deleteFileById = async (fileId, userId) => {

    const query = `
        DELETE FROM files
        WHERE id = $1
        AND user_id = $2
        RETURNING *
    `;

    const result = await pool.query(
        query,
        [fileId, userId]
    );

    return result.rows[0];
};

module.exports = {
    createFile,
    getFilesByUserId,
    getFileById,
    deleteFileById
};