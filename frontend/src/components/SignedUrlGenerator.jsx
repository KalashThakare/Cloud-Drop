import { useEffect, useState } from "react";
import { bucketFunc } from "@/store/bucketFunc.js";
import { Clipboard, Mail } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function SignedUrlGenerator() {

  const searchParams = useSearchParams();
  const useDefault = searchParams.get("useDefault") === "true";


  const [fileName, setFileName] = useState("");
  const [expiration, setExpiration] = useState(60);
  const [viewOnce, setViewOnce] = useState(false);
  const [maxUses, setMaxUses] = useState(1);
  const [allowDownload, setAllowDownload] = useState(true);
  const [signedUrl, setSignedUrl] = useState("");
  const [recipients, setRecipient] = useState("");

  const generateDefaultBucketUrl = bucketFunc((state) => state.generateDefaultBucketUrl);
  const generatedUrl = bucketFunc((state) => state.generatedUrl);
  const selectedBucket = bucketFunc((state) => state.selectedBucket);
  const sendMail = bucketFunc((state) => state.sendMail);

  const generateSignedUrl = async () => {
    if (!fileName || !expiration) {
      toast.warning("Please enter a file name and expiration Time");
      return;
    }

    if (useDefault === true) {
      generateDefaultBucketUrl(fileName, expiration);
    } else {

    }


  };

  const sendEmail = async () => {
    if (!recipients) {
      toast.warning("Please enter at least one recipient email address");
      return;
    }

    const emailArray = recipients.split(",").map((email) => email.trim());

    const recipient = emailArray

    await sendMail(fileName, expiration, recipient);
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
    <div className="w-full h-full flex justify-center items-center px-4 py-6 overflow-y-auto bg-zinc-950">
      <div className="w-full max-w-5xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-6">

        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          {/* Signed URL */}
          <div className="space-y-3">
            <h2 className="text-lg text-white font-semibold">Signed URL</h2>
            <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg min-h-[80px] text-sm text-zinc-300 break-all">
              {signedUrl ? signedUrl : "Your signed URL will appear here..."}
            </div>
            {signedUrl && (
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white py-2 rounded-lg transition-all text-sm"
              >
                <Clipboard className="w-4 h-4" />
                Copy Link
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-700" />

          {/* Email Sharing */}
          <div className="space-y-3">
            <label className="text-sm text-zinc-400">Send Link via Email</label>
            <textarea
              value={recipients}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter emails separated by commas..."
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-sm text-white resize-none"
              rows={3}
            />
            <button
              onClick={sendEmail}
              className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white py-2 rounded-lg transition-all text-sm"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          {/* File Name */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">File Name</label>
            <input
              type="text"
              placeholder="example.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-sm text-white"
            />
          </div>

          {/* Expiration Time */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Expiration Time (minutes)</label>
            <input
              type="number"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-sm text-white"
            />
          </div>

          {/* Max Uses */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Max Uses</label>
            <input
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              disabled={viewOnce}
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-sm text-white disabled:opacity-50"
            />
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3 mt-2">
            <label className="flex items-center gap-3 text-sm text-white">
              <input
                type="checkbox"
                checked={allowDownload}
                onChange={() => setAllowDownload(!allowDownload)}
                className="accent-cyan-400"
              />
              Allow Download
            </label>
            <label className="flex items-center gap-3 text-sm text-white">
              <input
                type="checkbox"
                checked={viewOnce}
                onChange={() => setViewOnce(!viewOnce)}
                className="accent-cyan-400"
              />
              Allow View Only Once
            </label>
          </div>

          {/* Generate URL */}
          <button
            onClick={generateSignedUrl}
            className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Generate Signed URL
          </button>
        </div>
      </div>
    </div>



  );
}
