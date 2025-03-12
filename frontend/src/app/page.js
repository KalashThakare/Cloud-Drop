'use client'
import { axiosInstance } from "@/lib/axios.js";
import React, { useState } from "react";

export default function App() {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    
    await axiosInstance.post("/func/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return (
    <form 
      onSubmit={submit} 
      className="max-w-md mx-auto mt-12 p-6 rounded-xl bg-black shadow-lg flex flex-col gap-4 text-center border border-gray-700"
    >
      <h1 className="text-2xl font-bold mb-2 text-cyan-300">Cloud-drop</h1>

      <input
        onChange={(e) => setFile(e.target.files[0])}
        type="file"
        accept="image/*"
        className="p-5 border-2 border-dashed border-gray-600 rounded-xl bg-gray-900 cursor-pointer text-white transition-all hover:border-blue-400 hover:bg-gray-800"
      />

      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        type="text"
        placeholder="Caption"
        className="p-3 border border-gray-600 rounded-lg text-lg text-white bg-gray-900 focus:border-blue-400 focus:outline-none transition-all"
      />

      <button 
        type="submit" 
        className="p-3 bg-blue-600 text-white rounded-lg text-lg cursor-pointer transition-all hover:bg-blue-500 active:translate-y-0"
      >
        Upload
      </button>
    </form>
  );
}
