"use client";

import { useState, useRef } from "react";
import { axiosInstance } from "@/lib/axios";
import { bucketFunc } from "@/store/bucketFunc";
import { toast } from "sonner";

function UploadForm() {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const selectedBucket = bucketFunc((state) => state.selectedBucket);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleFilenameChange = (e) => {
        setFilename(e.target.value);
    };

    const getFinalFilename = () => {
        if (!file) return "";
        const extension = file.name.split(".").pop();
        const base = filename.trim() === "" ? file.name.replace(/\s+/g, "_") : filename.trim();
        return `${base}.${extension}`;
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedBucket) {
            toast.error("Please select a bucket first.");
            return;
        }

        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("bucketName", selectedBucket);
        formData.append("image", file);

        if (filename.trim() !== "") {
            formData.append("filename", `${filename.trim()}.${file.name.split(".").pop()}`);
        }

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
            toast.success("File uploaded successfully!");

            setTimeout(() => {
                setProgress(0);
                setFile(null);
                setFilename("");
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
                        className="mt-2 w-full p-4 bg-zinc-800 text-white border border-dashed border-zinc-600 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:border-cyan-400 hover:bg-zinc-800 transition-all"
                    />
                </label>

                {file && (
                    <>
                        <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-full h-48 object-contain rounded-lg border border-zinc-700"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setFile(null);
                                setProgress(0);
                            }}
                            className="text-sm text-red-400 bg-zinc-800 border border-zinc-600 p-2 rounded-lg transition-all"
                        >
                            ❌ Remove selected file
                        </button>
                    </>
                )}
            </div>

            {/* Right: Filename + Upload + Progress */}
            <div className="w-full md:w-1/2 flex flex-col justify-between gap-4">
                <div>
                    <input
                        value={filename}
                        onChange={handleFilenameChange}
                        type="text"
                        placeholder="Rename file before uploading (optional)"
                        className="w-full p-3 rounded-lg text-sm bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                        This name will be used in the signed URL. If left empty, the original filename is used.
                    </p>
                    {file && (
                        <p className="text-sm text-cyan-400 font-mono mt-2">
                            🗂️ File will be saved as: <span className="font-bold">{getFinalFilename()}</span>
                        </p>
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
                            disabled={!file || isUploading}
                            className={`w-full mt-4 py-3 text-white text-sm font-medium rounded-lg transition-all ${isUploading || !file
                                ? "bg-cyan-800 cursor-not-allowed"
                                : "bg-cyan-600 hover:bg-cyan-500"
                                }`}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>

                        {!file && (
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
