import { useState, useEffect } from "react";
import axios from "axios";

export default function FileSelector({ userBucket }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");


  return (
    <div className="w-full max-w-sm p-4 bg-black text-white rounded-2xl shadow-lg border-[0.5px] border-cyan-300">
      <h2 className="text-xl font-semibold text-center text-blue-100 mb-4">
        Select a File
      </h2>

      <div className="relative">
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg outline-none focus:border-cyan-400 transition-all cursor-pointer"
        >
          <option value="" disabled>
            Choose a file
          </option>
          {files.map((file) => (
            <option key={file.name} value={file.name}>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </option>
          ))}
        </select>
      </div>

      <button
        className={`w-full p-3 mt-4 bg-blue-600 text-white rounded-lg text-lg font-semibold transition-all ${
          selectedFile ? "hover:bg-green-600 active:scale-95" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!selectedFile}
      >
        Continue
      </button>
    </div>
  );
}
