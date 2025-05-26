import { GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../../lib/platformClient/s3.js";
import { v4 as uuidv4 } from 'uuid';
import { addMultipleFilesToDatabase } from "./file.Controller.js";
import dotenv from "dotenv";


dotenv.config();


export const Upload = async (req, res) => {
    try {
        const s3Client = await getS3Client(req);

        console.log("req-body", req.body);
        console.log("req-file", req.files);

        const { bucketName, userId } = req.body;
        const files = req.files;

        console.log(files);

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No file found" });
        }

        const uploadResults = [];
        const fileDataForDB = []; 
        const failedUploads = []; 

        // Process each file
        for (const file of files) {
            try {
                const fileType = file.mimetype;
                let fileCategory;

                if (fileType.startsWith('image/')) {
                    fileCategory = 'images';
                } else if (fileType.startsWith('video/')) {
                    fileCategory = 'videos';
                } else {
                    fileCategory = 'other';
                }

                const fileId = uuidv4();
                const fileName = file.originalname; 
                const filePath = `users/${userId}/${fileCategory}/${fileName}`;

                // Upload to S3
                const params = {
                    Bucket: bucketName,
                    Key: filePath,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };

                const command = new PutObjectCommand(params);
                await s3Client.send(command);

                uploadResults.push({
                    fileId: fileId,
                    originalName: file.originalname,
                    fileName: fileName,
                    storedPath: filePath,
                    fileType: fileCategory,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    uploadedAt: new Date()
                });

                fileDataForDB.push({
                    fileId: fileId,
                    fileName: fileName,
                    originalName: file.originalname,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                });

                console.log(`File ${file.originalname} uploaded successfully to S3`);

            } catch (fileError) {
                console.error(`Failed to upload file ${file.originalname}:`, fileError);
                failedUploads.push({
                    originalName: file.originalname,
                    error: fileError.message
                });
            }
        }

        // If no files were uploaded successfully
        if (fileDataForDB.length === 0) {
            return res.status(500).json({
                message: "All file uploads failed",
                failedUploads: failedUploads
            });
        }

        // Update database with successfully uploaded files
        const dbResult = await addMultipleFilesToDatabase(userId, fileDataForDB);

        if (!dbResult.success) {
            console.error("Database update failed:", dbResult.error);
            
            // Files were uploaded to S3 but database update failed
            // You might want to implement a cleanup mechanism here
            // or handle this scenario based on your business logic
            
            return res.status(207).json({ // 207 Multi-Status
                message: "Files uploaded to S3 but database update failed",
                uploadedFiles: uploadResults,
                databaseError: dbResult.message,
                warning: "Files exist in storage but may not be tracked in database"
            });
        }

        // Success response
        const responseData = {
            message: "Files uploaded successfully",
            uploadedFiles: uploadResults,
            totalFilesUploaded: uploadResults.length,
            totalSize: fileDataForDB.reduce((sum, file) => sum + file.fileSize, 0),
            databaseInfo: {
                totalFiles: dbResult.data.totalFiles,
                totalSize: dbResult.data.totalSize,
                lastModified: dbResult.data.lastModified
            }
        };

        // Include failed uploads info if any
        if (failedUploads.length > 0) {
            responseData.failedUploads = failedUploads;
            responseData.message = `${uploadResults.length} files uploaded successfully, ${failedUploads.length} failed`;
        }

        res.status(200).json(responseData);
        console.log("Upload process completed successfully");

    } catch (error) {
        console.error("Error in upload controller:", error);
        res.status(500).json({ 
            message: "Error in upload controller",
            error: error.message 
        });
    }
};

export const generateSignedUrl = async (req, res) => {
    try {
        
        const { fileName, expiration, userId, bucketName } = req.body;

        if (!fileName || !expiration || !userId || !bucketName) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const s3Client = await getS3Client(req);

        if (!s3Client) {
            return res.status(400).json({ message: "S3 client not initialized" });
        }

        const fileExtension = fileName.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'];

        let fileCategory = 'other';
        if (imageExtensions.includes(fileExtension)) fileCategory = 'images';
        else if (videoExtensions.includes(fileExtension)) fileCategory = 'videos';

        const filePath = `users/${userId}/${fileCategory}/${fileName}`;

        try {
            const headCommand = new HeadObjectCommand({
                Bucket: bucketName,
                Key: filePath
            });

            await s3Client.send(headCommand);

            const Url = await getSignedUrl(
                s3Client,
                new GetObjectCommand({
                    Bucket: bucketName,
                    Key: filePath
                }),
                { expiresIn: expiration * 60 }
            );

            if (!Url) {
                return res.status(400).json({ message: "Error in generating Url" });
            }

            res.status(200).json({ message: "Success", Url });

        } catch (error) {
            if (error.name === 'NotFound' || error.code === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
                return res.status(404).json({ message: "No such file found. Please try uploading again." });
            }
            throw error;
        }

    } catch (error) {
        console.log("Error in generateSignedUrl:", error);
        res.status(500).json({ message: "Error in getSignedUrl controller" });
    }
};
