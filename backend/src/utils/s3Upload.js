const { PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = require("../config/s3");

const uploadToS3 = async (file) => {

    const key =`uploads/${Date.now()}-${file.originalname}`;

    const command =
        new PutObjectCommand({

            Bucket:process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType:file.mimetype

        });

    await s3.send(command);

    return {
            key,
            url:`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    };

};

module.exports = uploadToS3;