import mongoose from "mongoose";

const fileInfoSchema = new mongoose.Schema({
    fileId: {
        type: String,
        required: true,
        unique: true 
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

const fileSchema = new mongoose.model("FileSchema",filesSchema);

export default fileSchema;