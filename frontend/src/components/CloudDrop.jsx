"use client";
import "@/app/globals.css";
import { useState, useRef } from "react";
import { axiosInstance } from "@/lib/axios";
import { bucketFunc } from "@/store/bucketFunc";
import { toast } from "sonner";
import { FiX } from "react-icons/fi";

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
        className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pt-4 md:pt-6 pb-2 rounded-xl bg-zinc-900 shadow-xl flex flex-col gap-4 sm:gap-6 border border-zinc-700 overflow-y-scroll hide-scrollbar max-h-[90vh]"
      >
        <div className="flex flex-col md:flex-row gap-4">
        {/* Left: Image Upload and Preview */}
        <div className="w-full flex flex-col gap-2 sm:gap-3">
          <label className="text-sm sm:text-base text-zinc-400 font-medium">
            Upload Image
            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              multiple
              className="mt-2 w-full p-3 sm:p-4 bg-zinc-800 text-white border border-dashed border-zinc-600 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:border-cyan-400 hover:bg-zinc-800 transition-all text-xs sm:text-sm"
            />
          </label>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 text-center">
              Supported formats: JPG, PNG, GIF · Max size: 5MB
            </p>
          {files.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {files.map((file, index) => (
                  <div className="relative" key={index}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-24 xs:h-28 sm:h-32 object-cover rounded-lg border border-zinc-700"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-zinc-800 bg-opacity-80 rounded-full p-1 hover:bg-red-500 transition"
                      onClick={() => {
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

        {/* Right: Filename + Upload + Progress */}
        <div className={`${files.length === 0 ? "w-0" : "w-full"} flex flex-col justify-between gap-3 sm:gap-4`}>
            {files.length > 0 && (<div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-3 md:mt-5">
              This name will be used in the signed URL. If left empty, a default
              name is generated.
            </p>
              <div className="mt-3 md:mt-5 space-y-3 md:space-y-5">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="space-y-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border border-zinc-700 p-2 sm:p-3 rounded-lg"
                  >
                    <div>
                      <span className="text-zinc-400">📂 File Name:</span>{" "}
                      <span className="text-white font-medium">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-cyan-400 font-semibold">
                        📝 Save As:
                      </label>
                      <input
                        type="text"
                        value={customFilenames[index] || ""}
                        onChange={(e) =>
                          handleFilenameChange(index, e.target.value)
                        }
                        placeholder="Enter filename"
                        className="bg-zinc-800 text-white px-2 py-1 rounded border border-cyan-300 focus:outline-none w-32 sm:w-40"
                      />
                    </div>
                    <div>
                      <span className="text-zinc-400">📏 File Size:</span>{" "}
                      <span className="text-white font-medium">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400">🖼️ File Type:</span>{" "}
                      <span className="text-white font-medium">
                        {file.type}
                      </span>
                    </div>
                  </div>
                ))}
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
