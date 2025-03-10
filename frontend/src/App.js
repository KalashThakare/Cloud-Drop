import "./FileUpload.css";
import { axiosInstance } from "./lib/axios.js";
import React, {useState} from "react";

export default function App() {

  const [file,setFile] = useState();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const data = new FormData();
    data.append("image",file)

    const response = await axiosInstance.post("/func/upload",data,{headers:{"Content-Type":'multipart/form-data'}});

    if(response.status===200){
      console.log("Success")
    }
    
  }



  return (
    <div className="file-upload-container">
      <input type="file" id="fileInput" className="file-input" onChange={(e)=>setFile(e.target.files[0])} accept="image/*"/>
      <label htmlFor="fileInput" className="file-label">
        Choose File
      </label>
      <button  className="upload-file-button" onSubmit={handleSubmit}>
        Upload File
      </button>
    </div>
  );
}
