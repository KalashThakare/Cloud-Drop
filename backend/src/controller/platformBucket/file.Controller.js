import fileSchema from "../../models/fileManager.Model.js";

export const addMultipleFilesToDatabase = async (userId, filesArray) => {
    try {
        if (!filesArray || filesArray.length === 0) {
            return {
                success: false,
                message: 'No files provided'
            };
        }

        const totalSize = filesArray.reduce((sum, file) => sum + file.fileSize, 0);
        
        const result = await fileSchema.findOneAndUpdate(
            { userId },
            {
                $push: { uploadedFiles: { $each: filesArray } },
                $inc: { 
                    totalFiles: filesArray.length,
                    totalSize: totalSize 
                },
                $set: { lastModified: new Date() }
            },
            { 
                new: true, 
                upsert: true,
                runValidators: true 
            }
        );
        
        return {
            success: true,
            data: result,
            filesAdded: filesArray.length,
            totalSizeAdded: totalSize,
            message: `${filesArray.length} files added to database successfully`
        };
    } catch (error) {
        console.error('Error adding multiple files to database:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to add files to database'
        };
    }
};

export const removeFileFromDatabase = async (userId, fileId) => {
    try {
        // First, get the file to know its size
        const userFiles = await fileSchema.findOne({ userId });
        if (!userFiles) {
            return {
                success: false,
                message: 'User files not found'
            };
        }

        const fileToRemove = userFiles.uploadedFiles.find(file => file.fileId === fileId);
        if (!fileToRemove) {
            return {
                success: false,
                message: 'File not found'
            };
        }

        const result = await fileSchema.findOneAndUpdate(
            { userId },
            {
                $pull: { uploadedFiles: { fileId } },
                $inc: { 
                    totalFiles: -1,
                    totalSize: -fileToRemove.fileSize 
                },
                $set: { lastModified: new Date() }
            },
            { new: true }
        );

        return {
            success: true,
            data: result,
            removedFile: fileToRemove,
            message: 'File removed from database successfully'
        };
    } catch (error) {
        console.error('Error removing file from database:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to remove file from database'
        };
    }
};


export const getUserFiles = async (req,res) => {
    try {

        const {userId} = req.body;
        
        const result = await fileSchema.findOne({ userId }).populate('userId', 'name email');
        
        if (!result) {
            return res.status(400).json({message:"User hasent uploaded anything yet"})
        }

        res.status(200).json(result)

        
    } catch (error) {
        console.error('Error getting user files:', error);
        res.status(500).json({message:"Internal server error"})
    }
};

export const getUserFileStats = async (req,res) => {
    try {

        const {userId} = req.body;

        const result = await fileSchema.findOne({ userId });
        
        if (!result) {
            return res.status(400).json({message:"No files found for this user"});
        }

        // Format file size
        const formatBytes = (bytes) => {
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Bytes';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
        };

        res.status(200).json(result);
        
    } catch (error) {
        console.error('Error getting file statistics:', error);
        return res.status(500).json({message:"Failed to retrieve file statistics"})
    }
};

export const removeMultipleFilesFromDatabase = async (userId, fileIds) => {
    try {
        if (!fileIds || fileIds.length === 0) {
            return {
                success: false,
                message: 'No file IDs provided'
            };
        }

        // Filter out null/undefined values
        const validFileIds = fileIds.filter(id => id !== null && id !== undefined && id !== '');
        
        if (validFileIds.length === 0) {
            return {
                success: false,
                message: 'No valid file IDs provided'
            };
        }

        // Get user files to calculate total size to remove
        const userFiles = await fileSchema.findOne({ userId });
        if (!userFiles || !userFiles.uploadedFiles) {
            return {
                success: false,
                message: 'User files not found'
            };
        }

        const filesToRemove = userFiles.uploadedFiles.filter(file => 
            validFileIds.includes(file.fileId)
        );

        if (filesToRemove.length === 0) {
            return {
                success: false,
                message: 'No matching files found'
            };
        }

        const totalSizeToRemove = filesToRemove.reduce((sum, file) => sum + (file.fileSize || 0), 0);

        // Check if we're deleting all files
        const remainingFiles = userFiles.uploadedFiles.filter(file => 
            !validFileIds.includes(file.fileId)
        );

        let result;

        if (remainingFiles.length === 0) {
            // Deleting ALL files - use $set to avoid the unique index issue
            result = await fileSchema.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        uploadedFiles: [],
                        totalFiles: 0,
                        totalSize: 0,
                        lastModified: new Date()
                    }
                },
                { new: true }
            );
        } else {
            // Use array replacement approach to avoid $pull issues with unique index
            const newTotalFiles = remainingFiles.length;
            const newTotalSize = remainingFiles.reduce((sum, file) => sum + (file.fileSize || 0), 0);

            result = await fileSchema.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        uploadedFiles: remainingFiles,
                        totalFiles: newTotalFiles,
                        totalSize: newTotalSize,
                        lastModified: new Date()
                    }
                },
                { new: true }
            );
        }

        return {
            success: true,
            data: result,
            filesRemoved: filesToRemove.length,
            totalSizeRemoved: totalSizeToRemove,
            remainingFiles: remainingFiles.length,
            deletedAllFiles: remainingFiles.length === 0,
            message: `${filesToRemove.length} files removed successfully`
        };

    } catch (error) {
        console.error('Error removing multiple files from database:', error);
        
        // Handle specific duplicate key error
        if (error.code === 11000 && error.message.includes('uploadedFiles.fileId')) {
            return {
                success: false,
                error: error.message,
                message: 'Database constraint error during file deletion. Please remove the unique index on uploadedFiles.fileId',
                errorType: 'DUPLICATE_KEY'
            };
        }

        return {
            success: false,
            error: error.message,
            message: 'Failed to remove files from database'
        };
    }
};