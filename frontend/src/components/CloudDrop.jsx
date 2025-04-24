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
      setProgress(1); // Ensure progress bar appears even for fast uploads

      await axiosInstance.post("/use-platform-bucket/s3client/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      setProgress(100);
      toast.success("File uploaded successfully!");

      // Hold the final state briefly before clearing
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
    }finally {
        setIsUploading(false);
      }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 shadow-xl flex flex-col gap-5 border border-zinc-700"
    >
      <h1 className="text-2xl font-semibold text-white text-center">📤 Cloud-drop</h1>

      <label className="w-full text-sm text-zinc-400">
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
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="w-full h-48 object-contain rounded-lg border border-zinc-700 mt-2"
        />
      )}

      <input
        value={filename}
        onChange={handleFilenameChange}
        type="text"
        placeholder="Rename file before uploading (optional)"
        className="w-full p-3 rounded-lg text-sm bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
      />
      <p className="text-xs text-zinc-500 text-left -mt-2">
        This name will be used in the signed URL. If left empty, the original filename is used.
      </p>

      {file && (
        <p className="text-sm text-cyan-400 font-mono mt-1">
          🗂️ File will be saved as: <span className="font-bold">{getFinalFilename()}</span>
        </p>
      )}

      {progress > 0 && (
        <div className="w-full bg-zinc-700 h-2 rounded-lg overflow-hidden mt-2">
          <div
            className="bg-cyan-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <p className="text-xs text-zinc-500 text-left mt-2">
        Supported formats: JPG, PNG, GIF · Max size: 5MB
      </p>

      <button
        type="submit"
        disabled={isUploading}
        className={`w-full py-3 text-white text-sm font-medium rounded-lg transition-all ${
          isUploading
            ? "bg-cyan-800 cursor-not-allowed"
            : "bg-cyan-600 hover:bg-cyan-500"
        }`}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

    </form>
  );
}

export default UploadForm;
