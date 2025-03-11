import { axiosInstance } from "./lib/axios.js";
import React, { useState } from "react";
import './App.css'

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
    <form onSubmit={submit}>
      <h1>Cloud-drop</h1>
      <input
        onChange={(e) => setFile(e.target.files[0])}
        type="file"
        accept="image/*"
      />
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        type="text"
        placeholder="Caption"
      />
      <button type="submit">Upload</button>
    </form>
  );
}
