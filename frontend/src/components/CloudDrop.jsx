"use client";

import { useState, useRef } from "react";
import { axiosInstance } from "@/lib/axios";
import { bucketFunc } from "@/store/bucketFunc";
import { toast } from "sonner";

function UploadForm() {
    const [files, setFiles] = useState([]);
    const [customFilenames, setCustomFilenames] = useState({});
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const selectedBucket = bucketFunc((state) => state.selectedBucket);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(selectedFiles);
        setCustomFilenames({});
    };

    const handleFilenameChange = (index, newFilename) => {
        setCustomFilenames((prev) => ({
            ...prev,
            [index]: newFilename,
        }));
    };

    const getFinalFilename = (file, index) => {
        const extension = file.name.split('.').pop();
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        const custom = customFilenames[index];
        if (custom && custom.trim() !== "") {
            return `${custom.trim()}.${extension}`;
        }
        const timestamp = Date.now();
        return `${timestamp}-${nameWithoutExt}.${extension}`;
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedBucket) {
            toast.error("Please select a bucket first.");
            return;
        }

        if (!files || files.length === 0) {
            toast.error("Please select files to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("bucketName", selectedBucket);

        files.forEach((file, index) => {
            const renamedFile = new File([file], getFinalFilename(file, index), {
                type: file.type,
            });
            formData.append("images", renamedFile);
        });

        setIsUploading(true);

        try {
            setProgress(1);

            await axiosInstance.post("/use-platform-bucket/s3client/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percent);
                },
            });

            setProgress(100);
            toast.success("Files uploaded successfully!");

            setTimeout(() => {
                setProgress(0);
                setFiles([]);
                setCustomFilenames({});
                if (fileInputRef.current) fileInputRef.current.value = null;
            }, 1000);
        } catch (error) {
            toast.error("Upload failed.");
            console.error(error);
            setProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form
            onSubmit={handleUpload}
            className="w-full max-w-5xl p-6 rounded-2xl bg-zinc-900 shadow-xl flex flex-col md:flex-row gap-6 border border-zinc-700"
        >
            {/* Left: Image Upload and Preview */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
                <label className="text-sm text-zinc-400">
                    Upload Image
                    <input
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        type="file"
                        accept="image/*"
                        multiple
                        className="mt-2 w-full p-4 bg-zinc-800 text-white border border-dashed border-zinc-600 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:border-cyan-400 hover:bg-zinc-800 transition-all"
                    />
                </label>

                {files.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            {files.map((file, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(file)}
                                    alt={`preview-${index}`}
                                    className="w-full h-48 object-contain rounded-lg border border-zinc-700"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setFiles([]);
                                setProgress(0);
                                setCustomFilenames({});
                                if (fileInputRef.current) fileInputRef.current.value = null;
                            }}
                            className="text-sm text-red-400 bg-zinc-800 border border-zinc-600 p-2 rounded-lg transition-all mt-3"
                        >
                            ❌ Remove selected files
                        </button>
                    </>
                )}
            </div>

            {/* Right: Filename + Upload + Progress */}
            <div className="w-full md:w-1/2 flex flex-col justify-between gap-4">
                <div>
                    <p className="text-xs text-zinc-500 mt-5">
                        This name will be used in the signed URL. If left empty, a default name is generated.
                    </p>

                    {files.length > 0 && (
                        <div className="mt-5 space-y-5">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="space-y-2 text-sm text-zinc-300 leading-relaxed border border-zinc-700 p-3 rounded-lg"
                                >
                                    <div>
                                        <span className="text-zinc-400">📂 File Name:</span>{' '}
                                        <span className="text-white font-medium">{file.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-cyan-400 font-semibold">📝 Save As:</label>
                                        <input
                                            type="text"
                                            value={customFilenames[index] || ""}
                                            onChange={(e) => handleFilenameChange(index, e.target.value)}
                                            placeholder="Enter filename"
                                            className="bg-zinc-800 text-white px-2 py-1 rounded border border-cyan-300 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-zinc-400">📏 File Size:</span>{' '}
                                        <span className="text-white font-medium">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-400">🖼️ File Type:</span>{' '}
                                        <span className="text-white font-medium">{file.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {progress > 0 && (
                        <div className="w-full bg-zinc-700 h-2 rounded-lg overflow-hidden mt-2">
                            <div
                                className="bg-cyan-500 h-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    )}
                    <p className="text-xs text-zinc-500 mt-2">
                        Supported formats: JPG, PNG, GIF · Max size: 5MB
                    </p>

                    <div className="group w-full relative">
                        <button
                            type="submit"
                            disabled={files.length === 0 || isUploading}
                            className={`w-full mt-4 py-3 text-white text-sm font-medium rounded-lg transition-all ${isUploading || files.length === 0
                                ? "bg-cyan-800 cursor-not-allowed"
                                : "bg-cyan-600 hover:bg-cyan-500"
                                }`}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>

                        {files.length === 0 && (
                            <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 px-4 py-2 text-xs font-medium text-cyan-300 bg-zinc-900 border border-cyan-400 rounded-lg 
                            opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none z-20 shadow-lg">
                                Select a file first
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

export default UploadForm;
