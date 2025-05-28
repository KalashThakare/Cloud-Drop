"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { useAuthStore } from "@/store/useAuthStore";
import { fileManagementStore } from "@/store/fileManagement.Store";
import {
  FiRefreshCw,
  FiChevronDown,
  FiTrash2,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";
import "@/app/globals.css";
import { bucketFunc } from "@/store/bucketFunc";

const breakpoints = "w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-4";

export default function FileManagerPage() {
  const authUser = useAuthStore((s) => s.authUser);
  const userId = authUser?._id;
  if (!userId) {
    return (
      <div className={`${breakpoints} text-center text-red-500`}>
        Please log in to manage your files.
      </div>
    );
  }

  const files = fileManagementStore((s) => s.files);
  const fileStats = fileManagementStore((s) => s.fileStats);
  const getUserFiles = fileManagementStore((s) => s.getUserFiles);
  const getFileStats = fileManagementStore((s) => s.getFileStats);

  const deleteFiles = bucketFunc((s)=>s.deleteFiles);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDownArrow, setShowDownArrow] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const tableContainerRef = useRef(null);

  // Fetch files and stats
  const fetchFilesAndStats = async () => {
    setLoading(true);
    try {
      await getUserFiles({ userId });
      await getFileStats({ userId });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to fetch files or stats."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFilesAndStats();
    }
  }, [userId]);

  // Detect vertical overflow and show arrow if needed
  useEffect(() => {
    const checkOverflow = () => {
      const el = tableContainerRef.current;
      if (el) {
        setShowDownArrow(
          el.scrollHeight > el.clientHeight &&
            el.scrollTop + el.clientHeight < el.scrollHeight - 2
        );
      }
    };
    checkOverflow();
    const el = tableContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkOverflow);
      window.addEventListener("resize", checkOverflow);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkOverflow);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [files, loading]);

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFilesAndStats();
    setRefreshing(false);
    toast.success("File list refreshed.");
  };

  // Select single file
  const handleSelectFile = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((file) => file.fileId));
    }
  };

  // Remove single file
  // const handleRemoveFile = (fileId) => {
  //   console.log("Remove file with id:", fileId);
    
  // };


const handleRemoveSelected =async () => {
  if (selectedFiles.length === 0) {
    toast.warning("No files selected.");
    return;
  }
  
  const selectedFileDetails = files.filter(file => 
    selectedFiles.includes(file.fileId)
  ).map(file => ({
    fileId: file.fileId,
    fileName: file.fileName,
    fileType: file.mimeType ? getFileTypeFromMimeType(file.mimeType) : getFileTypeFromExtension(file.fileName)
  }));
  
  console.log("Remove files with details:", selectedFileDetails);

  deleteFiles({
    userId,
    files: selectedFileDetails
  });
  
  setSelectedFiles([]);

  await new Promise(resolve => setTimeout(resolve, 3000));

  await fetchFilesAndStats();

};

const getFileTypeFromMimeType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType.startsWith('video/')) return 'videos';
  return 'other';
};


const getFileTypeFromExtension = (fileName) => {
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'];
  
  if (imageExtensions.includes(fileExtension)) return 'images';
  if (videoExtensions.includes(fileExtension)) return 'videos';
  return 'other';
};

  return (
    <div
      className={`${breakpoints} flex flex-col gap-6 md:h-full h-[93vh] [@media(max-width:360px)]:gap-2 overflow-y-auto hide-scrollbar`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 [@media(max-width:360px)]:gap-2">
        <h1 className="text-3xl font-bold text-cyan-400">Your Files</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleRemoveSelected}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-60"
            disabled={selectedFiles.length === 0}
            title="Remove Selected"
          >
            <FiTrash2 className="w-5 h-5" />
            <span>Remove Selected</span>
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition"
            disabled={refreshing}
          >
            <FiRefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>{refreshing ? "Refreshing" : "Refresh"}</span>
          </button>
        </div>
      </div>
      {fileStats && (
        <div className="flex flex-wrap gap-4 text-sm text-zinc-300 [@media(max-width:360px)]:gap-2">
          <div className="bg-zinc-800 rounded-lg px-4 py-2">
            <span className="font-semibold text-cyan-300">Total Files:</span>{" "}
            {fileStats.totalFiles}
          </div>
          <div className="bg-zinc-800 rounded-lg px-4 py-2">
            <span className="font-semibold text-cyan-300">Total Size:</span>{" "}
            {(fileStats.totalSize / 1024 / 1024).toFixed(2)} MB
          </div>
          <div className="bg-zinc-800 rounded-lg px-4 py-2">
            <span className="font-semibold text-cyan-300">Last Modified:</span>{" "}
            {fileStats.lastModified
              ? new Date(fileStats.lastModified).toLocaleString()
              : "N/A"}
          </div>
        </div>
      )}
      <div className="relative">
        <div
          ref={tableContainerRef}
          className="relative overflow-x-auto overflow-y-auto hide-scrollbar rounded-lg shadow border border-zinc-700 bg-zinc-900 max-h-[60vh] h-auto [@media(max-width:360px)]:h-[50vh]"
        >
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-zinc-900 z-10">
              <tr className="bg-zinc-800 text-cyan-200">
                <th className="p-3 text-left w-10">
                  <button
                    onClick={handleSelectAll}
                    className="focus:outline-none"
                    title="Select All"
                  >
                    {selectedFiles.length === files.length &&
                    files.length > 0 ? (
                      <FiCheckSquare className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <FiSquare className="w-5 h-5 text-zinc-400" />
                    )}
                  </button>
                </th>
                <th className="p-3 text-left">File Name</th>
                <th className="p-3 text-left">Original Name</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Uploaded At</th>
                {/* <th className="p-3 text-left">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-400">
                    Loading files...
                  </td>
                </tr>
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-400">
                    No files found.
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr
                    key={file.fileId}
                    className="border-b border-zinc-800 hover:bg-zinc-800/60 transition"
                  >
                    <td className="p-3">
                      <button
                        onClick={() => handleSelectFile(file.fileId)}
                        className="focus:outline-none"
                        title={
                          selectedFiles.includes(file.fileId)
                            ? "Deselect"
                            : "Select"
                        }
                      >
                        {selectedFiles.includes(file.fileId) ? (
                          <FiCheckSquare className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <FiSquare className="w-5 h-5 text-zinc-400" />
                        )}
                      </button>
                    </td>
                    <td className="p-3">{file.fileName}</td>
                    <td className="p-3">{file.originalName}</td>
                    <td className="p-3">
                      {(file.fileSize / 1024).toFixed(2)} KB
                    </td>
                    <td className="p-3">{file.mimeType}</td>
                    <td className="p-3">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </td>
                    {/* <td className="p-3 flex gap-2">
                      <button
                        className="p-2 bg-red-700 hover:bg-red-600 rounded text-white"
                        onClick={() => handleRemoveFile(file.fileId)}
                        title="Remove"
                      >
                        <FiTrash2 />
                      </button>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {showDownArrow && (
          <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none">
            <FiChevronDown className="text-cyan-500 text-3xl animate-bounce" />
          </div>
        )}
      </div>
    </div>
  );
}
