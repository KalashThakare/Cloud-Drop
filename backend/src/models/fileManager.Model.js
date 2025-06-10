import mongoose from "mongoose";

const fileInfoSchema = new mongoose.Schema({
    fileId: {
        type: String,
        required: true
        // Remove unique: true from here
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
}, { _id: false });

const filesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true 
    },
    uploadedFiles: [fileInfoSchema], 
    totalFiles: {
        type: Number,
        default: 0
    },
    totalSize: {
        type: Number,
        default: 0 
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create a compound index for better performance and partial uniqueness
filesSchema.index({ 
    "uploadedFiles.fileId": 1 
}, { 
    sparse: true,
    background: true 
});

const fileSchema = mongoose.model("FileSchema", filesSchema);

export default fileSchema;