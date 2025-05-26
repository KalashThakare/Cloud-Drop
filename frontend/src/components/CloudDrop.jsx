"use client";
import "@/app/globals.css";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { bucketFunc } from "@/store/bucketFunc";
import { toast } from "sonner";
import { FiX } from "react-icons/fi";
import { useAuthStore } from "@/store/useAuthStore.js";
import { getErrorMessage } from "@/lib/errorUtils";

function UploadForm() {
  const [files, setFiles] = useState([]);
  const [customFilenames, setCustomFilenames] = useState({});
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);

  const selectedBucket = bucketFunc((state) => state.selectedBucket);
  const authUser = useAuthStore((state) => state.authUser);
  const currentUserId = authUser?._id;

  // react-hook-form for validation
  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setCustomFilenames({});
    setSelectedFileIndex(null);
    if (selectedFiles.length === 0) {
      setError("files", {
        type: "manual",
        message: "Please select files to upload.",
      });
    } else {
      clearErrors("files");
    }
  };

  const handleFilenameChange = (index, newFilename) => {
    setCustomFilenames((prev) => ({
      ...prev,
      [index]: newFilename,
    }));
  };

  const getFinalFilename = (file, index) => {
    const extension = file.name.split(".").pop();
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    const custom = customFilenames[index];
    if (custom && custom.trim() !== "") {
      return `${custom.trim()}.${extension}`;
    }
    const timestamp = Date.now();
    return `${timestamp}-${nameWithoutExt}.${extension}`;
  };

  const onSubmit = async () => {
    if (!selectedBucket) {
      setError("bucket", {
        type: "manual",
        message: "Please select a bucket first.",
      });
      toast.warning("Please select a bucket first.");
      return;
    }
    if (!files || files.length === 0) {
      setError("files", {
        type: "manual",
        message: "Please select files to upload.",
      });
      toast.warning("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("bucketName", selectedBucket);
    formData.append("userId", currentUserId);
    files.forEach((file, index) => {
      const renamedFile = new File([file], getFinalFilename(file, index), {
        type: file.type,
      });
      formData.append("images", renamedFile);
    });

    setIsUploading(true);

    try {
      setProgress(1);

      await axiosInstance.post(
        "/use-platform-bucket/s3client/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );

      setProgress(100);
      toast.success("Files uploaded successfully!");

      setTimeout(() => {
        setProgress(0);
        setFiles([]);
        setCustomFilenames({});
        setSelectedFileIndex(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
      }, 1000);
    } catch (error) {
      if (error?.response?.status && error.response.status < 500) {
        toast.warning(getErrorMessage(error, "Upload failed."));
      } else {
        toast.error(getErrorMessage(error, "Upload failed."));
      }
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove a single file and update info panel if needed
  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setCustomFilenames((prev) => {
      const updated = { ...prev };
      delete updated[index];
      const reindexed = {};
      newFiles.forEach((_, i) => {
        if (prev[i < index ? i : i + 1]) {
          reindexed[i] = prev[i < index ? i : i + 1];
        }
      });
      return reindexed;
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
    if (selectedFileIndex === index) setSelectedFileIndex(null);
    else if (selectedFileIndex > index)
      setSelectedFileIndex(selectedFileIndex - 1);
  };

  // Remove all files and close info panel
  const handleRemoveAll = () => {
    setFiles([]);
    setCustomFilenames({});
    setSelectedFileIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-7xl mx-auto pl-2 pr-1 sm:pl-4 md:pl-6 sm:pr-2 md:pr-3 pt-4 md:pt-6 pb-2 rounded-xl bg-zinc-900 shadow-xl flex flex-col gap-4 sm:gap-6 border border-zinc-700 overflow-y-scroll hide-scrollbar max-h-[90vh]"
    >
      <div className="flex flex-col md:flex-row gap-6 justify-evenly">
        {/* Left: Image Upload and Preview */}
        <div
          className={`flex flex-col gap-2 sm:gap-3 transition-all duration-300 ${
            selectedFileIndex === null ? "w-full" : "w-full md:w-1/2"
          }`}
        >
          <label className="text-sm sm:text-base text-zinc-400 font-medium">
            Upload Image
            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              accept="image/*,video/*"
              multiple
              className="mt-2 w-full p-3 sm:p-4 bg-zinc-800 text-white border border-dashed border-zinc-600 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:border-cyan-400 hover:bg-zinc-800 transition-all text-xs sm:text-sm"
            />
          </label>
          {errors.files && (
            <span className="text-red-400 text-xs">{errors.files.message}</span>
          )}
          {errors.bucket && (
            <span className="text-red-400 text-xs">
              {errors.bucket.message}
            </span>
          )}
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 text-center">
            Supported formats: JPG, PNG, GIF, MP4 · Max size: 50MB
          </p>
          {files.length > 0 && (
            <button
              type="button"
              onClick={handleRemoveAll}
              className="w-full self-end mb-2 px-4 py-2 bg-zinc-600 hover:text-red-500 text-white text-xs sm:text-sm rounded-lg font-medium transition"
              aria-label="Remove all selected images"
            >
              Remove All
            </button>
          )}
          {files.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {files.map((file, index) => (
                <div
                  className={`relative cursor-pointer group border-2 ${
                    selectedFileIndex === index
                      ? "border-cyan-400"
                      : "border-transparent"
                  } rounded-lg`}
                  key={index}
                  tabIndex={0}
                  onClick={() => setSelectedFileIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelectedFileIndex(index);
                  }}
                  aria-label={`Show info for ${file.name}`}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-24 xs:h-28 sm:h-32 object-contain rounded-lg border border-zinc-700"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-zinc-800 bg-opacity-80 rounded-full p-1 hover:bg-red-500 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    aria-label="Remove image"
                  >
                    <FiX size={18} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: File Info Panel */}
        <div
          className={`transition-all duration-300 ${
            selectedFileIndex === null
              ? "w-0 opacity-0 pointer-events-none"
              : "w-full md:w-1/2 opacity-100"
          } flex items-center justify-center gap-3 sm:gap-4`}
        >
          {selectedFileIndex !== null && files[selectedFileIndex] && (
            <div className="relative bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-2 md:mt-0">
              <button
                type="button"
                className="absolute top-1.5 right-1.5 bg-zinc-700 bg-opacity-80 rounded-full p-1 hover:bg-red-500 transition"
                onClick={() => setSelectedFileIndex(null)}
                aria-label="Close file info"
              >
                <FiX size={18} className="text-white" />
              </button>
              <p className="text-xs sm:text-sm text-zinc-500 mb-3">
                This name will be used in the signed URL. If left empty, a
                default name will be used.
              </p>
              <div className="space-y-3">
                <div>
                  <span className="text-zinc-400">📂 File Name:</span>{" "}
                  <span className="text-white font-medium">
                    {files[selectedFileIndex].name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-cyan-400 font-semibold">
                    📝 Save As:
                  </label>
                  <input
                    type="text"
                    value={customFilenames[selectedFileIndex] || ""}
                    onChange={(e) =>
                      handleFilenameChange(selectedFileIndex, e.target.value)
                    }
                    placeholder="Enter filename"
                    className="bg-zinc-900 text-white px-2 py-1 rounded border border-cyan-300 focus:outline-none w-32 sm:w-40"
                  />
                </div>
                <div>
                  <span className="text-zinc-400">📏 File Size:</span>{" "}
                  <span className="text-white font-medium">
                    {(files[selectedFileIndex].size / 1024).toFixed(2)} KB
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400">🖼️ File Type:</span>{" "}
                  <span className="text-white font-medium">
                    {files[selectedFileIndex].type}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            {progress > 0 && (
              <div className="w-full bg-zinc-700 h-2 rounded-lg overflow-hidden mt-2">
                <div
                  className="bg-cyan-500 h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* upload button  */}
      <div className="sticky bottom-0 left-0 w-full flex justify-center z-10 pt-2 pb-2 bg-transparent">
        <button
          type="submit"
          disabled={files.length === 0 || isUploading}
          className={`w-3/4 py-3 text-white text-sm sm:text-base font-medium rounded-xl transition-all ${
            isUploading || files.length === 0
              ? "bg-cyan-800 cursor-not-allowed"
              : "bg-cyan-500 hover:bg-cyan-400"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {files.length === 0 && (
          <div
            className="absolute top-[-40px] left-1/2 -translate-x-1/2 px-4 py-2 text-xs font-medium text-cyan-300 bg-zinc-900 border border-cyan-400 rounded-lg 
                        opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none z-20 shadow-lg"
          >
            Select a file first
          </div>
        )}
      </div>
    </form>
  );
}

export default UploadForm;
