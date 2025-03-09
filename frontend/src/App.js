import "./FileUpload.css";
import { axiosInstance } from "./lib/axios.js";

export default async function App() {

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const data={
      
    }
  }

  const response = await axiosInstance.post("/func/upload",data);


  return (
    <div className="file-upload-container">
      <input type="file" id="fileInput" className="file-input" />
      <label htmlFor="fileInput" className="file-label">
        Choose File
      </label>
      <button  className="upload-file-button">
        Upload File
      </button>
    </div>
  );
}
