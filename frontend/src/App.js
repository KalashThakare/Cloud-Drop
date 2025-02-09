import "./FileUpload.css";

export default function App() {
  return (
    <div className="file-upload-container">
      <input type="file" id="fileInput" className="file-input" />
      <label htmlFor="fileInput" className="file-label">
        Choose File
      </label>
      <button className="upload-file-button">
        Upload File
      </button>
    </div>
  );
}
