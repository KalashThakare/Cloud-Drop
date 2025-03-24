import { useEffect, useState } from "react";
import { bucketFunc } from "@/store/bucketFunc.js";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";

export default function SignedUrlGenerator() {
  const [fileName, setFileName] = useState("");
  const [expiration, setExpiration] = useState(60);
  const [viewOnce, setViewOnce] = useState(false);
  const [maxUses, setMaxUses] = useState(1);
  const [allowDownload, setAllowDownload] = useState(true);
  const [signedUrl, setSignedUrl] = useState("");

  const generateUrl = bucketFunc((state) => state.generateUrl);
  const generatedUrl = bucketFunc((state) => state.generatedUrl);
  const selectedBucket = bucketFunc((state) => state.selectedBucket);

  const generateSignedUrl = async () => {
    if (!fileName || !expiration) {
      alert("Please enter a file name and expiration Time");
      return;
    }

    generateUrl(fileName, expiration);
  };

  useEffect(() => {
    if (generatedUrl) {
      setSignedUrl(generatedUrl.Url || "Invalid URL response");
    }
  }, [generatedUrl]);

  const copyToClipboard = () => {
    if (signedUrl) {
      navigator.clipboard.writeText(signedUrl);
      toast.success('URL Copied')
    }
  };

  return (
    <div className="flex items-center justify-between bg-black p-6 rounded-xl border-[0.5px] border-cyan-300 shadow-lg w-[50vw] max-w-3xl mx-auto">
      {/* Left Side: Signed URL Display */}
      <div className="w-[70%] p-4">
        <h2 className="text-lg font-semibold text-white mb-2">Signed URL</h2>
        <div className="mt-7 p-3 bg-gray-800 text-cyan-300 border-2 border-cyan-300 rounded-md min-h-[80px] break-all flex items-center justify-between">
          <span className="truncate">{signedUrl ? signedUrl : "URL will appear here..."}</span>
        </div>
        <div className="mt-7">
          {signedUrl && (
            <button
              onClick={copyToClipboard}
              className="flex items-center px-4 py-2 rounded-lg border border-purple-500 bg-gray-900/50 backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-gray-800 hover:border-orange-400"
            >
              <Clipboard className="w-5 h-5 text-purple-400 transition-colors duration-300 hover:text-orange-400" />
              <span className="ml-2 text-purple-400 font-medium text-sm transition-colors duration-300 hover:text-orange-400">
                Copy Link
              </span>
            </button>
          )}
        </div>


      </div>

      {/* Right Side: Actions & Inputs */}
      <div className="w-1/2 p-4 flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Enter file name..."
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full p-2 bg-gray-900 text-white border-2 border-cyan-300 rounded"
        />

        <label className="text-white text-sm">Expiration Time (minutes):</label>
        <input
          type="number"
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}
          className="w-full p-2 bg-gray-900 text-white border-2 border-cyan-300 rounded"
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={viewOnce}
            onChange={() => setViewOnce(!viewOnce)}
            className="accent-cyan-300"
          />
          <span className="text-white text-sm">Allow View Only Once</span>
        </div>

        <label className="text-white text-sm">Max Uses:</label>
        <input
          type="number"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          className="w-full p-2 bg-gray-900 text-white border-2 border-cyan-300 rounded"
          disabled={viewOnce}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={allowDownload}
            onChange={() => setAllowDownload(!allowDownload)}
            className="accent-cyan-300"
          />
          <span className="text-white text-sm">Allow Download</span>
        </div>

        <button
          onClick={generateSignedUrl}
          className="w-full bg-blue-600 text-white p-2 rounded border-2 border-cyan-300 hover:bg-blue-700"
        >
          Generate URL
        </button>
      </div>
    </div>
  );
}
