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


export const getUserFiles = async (userId) => {
    try {
        const result = await fileSchema.findOne({ userId }).populate('userId', 'name email');
        
        if (!result) {
            return {
                success: true,
                data: null,
                message: 'No files found for this user'
            };
        }

        return {
            success: true,
            data: result,
            totalFiles: result.totalFiles,
            totalSize: result.totalSize,
            message: 'Files retrieved successfully'
        };
    } catch (error) {
        console.error('Error getting user files:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to retrieve user files'
        };
    }
};

export const getUserFileStats = async (userId) => {
    try {
        const result = await fileSchema.findOne({ userId });
        
        if (!result) {
            return {
                success: true,
                data: {
                    totalFiles: 0,
                    totalSize: 0,
                    totalSizeFormatted: '0 Bytes',
                    lastModified: null
                },
                message: 'No files found for this user'
            };
        }

        // Format file size
        const formatBytes = (bytes) => {
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Bytes';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
        };

        return {
            success: true,
            data: {
                totalFiles: result.totalFiles,
                totalSize: result.totalSize,
                totalSizeFormatted: formatBytes(result.totalSize),
                lastModified: result.lastModified,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
            },
            message: 'File statistics retrieved successfully'
        };
    } catch (error) {
        console.error('Error getting file statistics:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to retrieve file statistics'
        };
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

        // Get user files to calculate total size to remove
        const userFiles = await fileSchema.findOne({ userId });
        if (!userFiles) {
            return {
                success: false,
                message: 'User files not found'
            };
        }

        const filesToRemove = userFiles.uploadedFiles.filter(file => 
            fileIds.includes(file.fileId)
        );

        if (filesToRemove.length === 0) {
            return {
                success: false,
                message: 'No matching files found'
            };
        }

        const totalSizeToRemove = filesToRemove.reduce((sum, file) => sum + file.fileSize, 0);

        const result = await fileSchema.findOneAndUpdate(
            { userId },
            {
                $pull: { uploadedFiles: { fileId: { $in: fileIds } } },
                $inc: { 
                    totalFiles: -filesToRemove.length,
                    totalSize: -totalSizeToRemove
                },
                $set: { lastModified: new Date() }
            },
            { new: true }
        );

        return {
            success: true,
            data: result,
            filesRemoved: filesToRemove.length,
            totalSizeRemoved: totalSizeToRemove,
            message: `${filesToRemove.length} files removed successfully`
        };
    } catch (error) {
        console.error('Error removing multiple files from database:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to remove files from database'
        };
    }
};