import { useEffect, useState } from "react";
import { bucketFunc } from "@/store/bucketFunc.js";
import { Clipboard, Mail } from "lucide-react";
import { toast } from "sonner";

export default function SignedUrlGenerator() {
  const [fileName, setFileName] = useState("");
  const [expiration, setExpiration] = useState(60);
  const [viewOnce, setViewOnce] = useState(false);
  const [maxUses, setMaxUses] = useState(1);
  const [allowDownload, setAllowDownload] = useState(true);
  const [signedUrl, setSignedUrl] = useState("");
  const [recipients, setRecipient] = useState("");

  const generateUrl = bucketFunc((state) => state.generateUrl);
  const generatedUrl = bucketFunc((state) => state.generatedUrl);
  const selectedBucket = bucketFunc((state) => state.selectedBucket);
  const sendMail = bucketFunc((state)=>state.sendMail);

  const generateSignedUrl = async () => {
    if (!fileName || !expiration) {
      toast.warning("Please enter a file name and expiration Time");
      return;
    }

    generateUrl(fileName, expiration);
  };

  const sendEmail = async () => {
    if (!recipients) {
      toast.warning("Please enter at least one recipient email address");
      return;
    }

    const emailArray = recipients.split(",").map((email) => email.trim());

    const emailData = {
      bucketName: selectedBucket.bucketName,
      fileName,
      expiration,
      viewOnce,
      maxUses,
      allowDownload,
      recipients: emailArray,
    };

    console.log("Email Data:", emailData);

    sendMail(emailData);
  }  

  useEffect(() => {
    if (generatedUrl) {
      setSignedUrl(generatedUrl.Url || "Invalid URL response");
    }
  }, [generatedUrl]);

  const copyToClipboard = () => {
    if (signedUrl) {
      navigator.clipboard.writeText(signedUrl);
      toast.success("URL Copied");
    }
  };

  return (
    <div className="flex items-center justify-between gap-5 bg-black p-6 rounded-2xl border-[0.5px] border-cyan-300 shadow-lg w-[50vw] max-w-3xl mx-auto">
{/* Left Side: Signed URL Display */}
      <div className="w-[60%] p-4">
        <h2 className="text-xl font-semibold text-white mb-2">Signed URL</h2>
        <div className="mt-7 p-3 bg-gray-800 text-cyan-300 border-2 border-cyan-300 rounded-md min-h-[80px] break-all flex items-center justify-between">
          <span className="truncate">
            {signedUrl ? signedUrl : "URL will appear here..."}
          </span>
        </div>


{/* Copy Link Button */}
        <div
          className="mt-7 bg-gray-900/50 backdrop-blur-md shadow-lg transition-all duration-300"
          onClick={signedUrl ? copyToClipboard : undefined}
        >
          {signedUrl && (
            <div className="flex justify-center w-full px-4 py-2 cursor-pointer rounded-lg border border-purple-500 text-purple-400 hover:bg-gray-800 hover:border-orange-400 hover:text-orange-400">
              <Clipboard className="w-5 h-5 transition-colors duration-300" />
              <span className="ml-2 font-medium text-sm transition-colors duration-300">
                Copy Link
              </span>
            </div>
          )}
        </div>

        <div className="w-[full] h-0.5 mt-8 bg-cyan-300"></div>

{/* Add Email Recipients and Send Link Button */}
        <div className="mt-8">
          <textarea
            placeholder="Enter recipient emails (comma-separated)..."
            value={recipients}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 bg-gray-900 text-white border-2 border-cyan-300 rounded"
          />

          <div
            className="mt-7 bg-gray-900/50 backdrop-blur-md shadow-lg transition-all duration-300"
            onClick={sendEmail}
          >
              <div className="flex justify-center w-full px-4 py-2 cursor-pointer rounded-lg border border-purple-500 text-purple-400 hover:bg-gray-800 hover:border-orange-400 hover:text-orange-400">
                <Mail className="w-5 h-5 transition-colors duration-300" />
                <span className="ml-2 font-medium text-sm transition-colors duration-300">
                  Send Link via Email
                </span>
              </div>
          </div>
        </div>

      </div>

  <div className="w-0.5 h-full my-52 bg-cyan-300"></div>

{/* Right Side: Actions & Inputs */}
  <div className="w-1/2 p-4 flex flex-col space-y-3">
        <label className="text-white text-sm">Enter File Name:</label>
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

        

        <label className="text-white text-sm">Max Uses:</label>
        <input
          type="number"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          className="w-full p-2 bg-gray-900 text-white border-2 border-cyan-300 rounded"
          disabled={viewOnce}
        />

        <div className="flex items-center space-x-2 mt-1">
          <input
            type="checkbox"
            checked={allowDownload}
            onChange={() => setAllowDownload(!allowDownload)}
            className="accent-cyan-300"
          />
          <span className="text-white text-sm">Allow Download</span>
        </div>


        <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={viewOnce}
                    onChange={() => setViewOnce(!viewOnce)}
                    className="accent-cyan-300"
                  />
                  <span className="text-white text-sm">Allow View Only Once</span>
        </div>


        <button
          onClick={generateSignedUrl}
          className="w-full bg-blue-600 text-white p-2 rounded-2xl border-2 border-cyan-300 hover:bg-blue-700"
        >
          Generate URL
        </button>
      </div>
    </div>
  );
}
