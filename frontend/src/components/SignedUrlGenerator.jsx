import { useEffect, useState } from "react";
import { bucketFunc } from "@/store/bucketFunc.js";
import { Clipboard, Mail, ArrowLeftCircle } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import "@/app/globals.css";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@/lib/errorUtils";
import { subscriptionHandler } from "@/store/subscriptionHandle.Store";
import { useRouter } from "next/navigation";

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
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const generateDefaultBucketUrl = bucketFunc(
    (state) => state.generateDefaultBucketUrl
  );
  const generatedUrl = bucketFunc((state) => state.generatedUrl);
  const selectedBucket = bucketFunc((state) => state.selectedBucket);
  const sendMail = bucketFunc((state) => state.sendMail);

  const authUser = useAuthStore((state) => state.authUser);
  const userId = authUser?._id;

  const checkLimits = subscriptionHandler((s) => s.checkLimits);
  const incrementUsage = subscriptionHandler((s) => s.incrementUsage);
  const router = useRouter();

  const generateSignedUrl = async () => {
    setHasInteracted(true);
    if (!fileName || !expiration) {
      toast.warning("Please enter a file name and expiration time.");
      return;
    }
    // 1. Check usage limit
    try {
      const result = await checkLimits(userId, "signedUrl");
      if (result.success === false) {
        toast.error(
          <>
            {result.message}
            <button
              style={{
                marginLeft: 8,
                color: "#00ffff",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => router.push("/subscribe")}
            >
              Upgrade Plan
            </button>
          </>
        );
        return;
      }
    } catch (err) {
      toast.error("Failed to check limits. Please try again.");
      return;
    }

    try {
      let urlResult = null;
      if (useDefault === true) {
        urlResult = await generateDefaultBucketUrl({
          fileName,
          expiration,
          userId,
        });
      } else {
        // Add your custom bucket logic here if needed
      }
      if (urlResult && urlResult.Url) {
        setShowLeftPanel(true);
        toast.success("Signed URL generated!");
        // 2. Increment usage after successful generation
        try {
          await incrementUsage(userId, "signedUrl");
        } catch (err) {
          // Optional: handle increment error
        }
      } else {
        setShowLeftPanel(false);
      }
    } catch (error) {
      if (error?.response?.status && error.response.status < 500) {
        toast.warning(getErrorMessage(error, "Failed to generate signed URL."));
      } else {
        toast.error(getErrorMessage(error, "Failed to generate signed URL."));
      }
      setShowLeftPanel(false);
    }
  };

  const sendEmail = async () => {
    setHasInteracted(true);
    if (!recipients) {
      toast.warning("Please enter at least one recipient email address.");
      return;
    }
    // Split and validate emails
    const emailArray = recipients
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    // Simple email validation (optional, for better UX)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      emailArray.length === 0 ||
      !emailArray.every((email) => emailRegex.test(email))
    ) {
      toast.warning(
        "Please enter valid email address(es), separated by commas."
      );
      return;
    }

    const fileExtension = fileName.split(".").pop().toLowerCase();
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const videoExtensions = ["mp4", "mov", "avi", "wmv", "flv", "webm", "mkv"];

    let fileCategory = "other";
    if (imageExtensions.includes(fileExtension)) fileCategory = "images";
    else if (videoExtensions.includes(fileExtension)) fileCategory = "videos";

    const filePath = `users/${userId}/${fileCategory}/${fileName}`;

    // try {
    await sendMail(filePath, expiration, emailArray);
    //   toast.success("Email sent!");
    // } catch (error) {
    //   if (error?.response?.status && error.response.status < 500) {
    //     toast.warning(getErrorMessage(error, "Failed to send email."));
    //   } else {
    //     toast.error(getErrorMessage(error, "Failed to send email."));
    //   }
    // }
  };

  useEffect(() => {
    if (generatedUrl) {
      setSignedUrl(generatedUrl.Url || "Invalid URL response");
    }
  }, [generatedUrl]);

  const copyToClipboard = () => {
    if (signedUrl) {
      navigator.clipboard.writeText(signedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("URL Copied");
    }
  };

  const handleGenerateAnother = () => {
    setShowLeftPanel(false);
    setSignedUrl("");
    setFileName("");
    setExpiration(60);
    setViewOnce(false);
    setMaxUses(1);
    setAllowDownload(true);
    setRecipient("");
    setHasInteracted(false);
  };

  return (
    <div className="w-full max-w-6xl min-h-[calc(100vh-2rem)] flex justify-center items-start py-16 md:items-center">
      <div className="w-full h-fit flex flex-col justify-center items-center bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl p-3 xs:p-4 sm:p-5 md:p-6 transition-all duration-300">
        {/* Show Right Panel (Form) if not showing left panel */}
        {!showLeftPanel && (
          <div className="w-full h-full flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6 mx-auto animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2 text-center drop-shadow-lg">
              Generate Signed URL
            </h2>

            {/* File Name */}
            <div className="space-y-1">
              <label
                htmlFor="fileName"
                className="text-sm sm:text-base text-zinc-400 font-medium"
              >
                File Name
              </label>
              <input
                id="fileName"
                type="text"
                placeholder="example.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-cyan-500 p-3 sm:p-3.5 rounded-lg text-sm sm:text-base text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
                autoComplete="off"
              />
              {hasInteracted && !fileName && (
                <div className="text-red-400 text-xs mt-1">
                  File name is required.
                </div>
              )}
            </div>

            {/* Expiration Time */}
            <div className="space-y-1">
              <label
                htmlFor="expiration"
                className="text-sm sm:text-base text-zinc-400 font-medium"
              >
                Expiration Time (minutes)
              </label>
              <input
                id="expiration"
                type="number"
                min="1"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-cyan-500 p-3 sm:p-3.5 rounded-lg text-sm sm:text-base text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
                autoComplete="off"
              />
              {hasInteracted && !expiration && (
                <div className="text-red-400 text-xs mt-1">
                  Expiration time is required.
                </div>
              )}
            </div>

            {/* Max Uses */}
            <div className="space-y-1">
              <label
                htmlFor="maxUses"
                className="text-sm sm:text-base text-zinc-400 font-medium"
              >
                Max Uses
              </label>
              <input
                id="maxUses"
                type="number"
                min="1"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                disabled={viewOnce}
                className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-cyan-500 p-3 sm:p-3.5 rounded-lg text-sm sm:text-base text-white disabled:opacity-60 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
                autoComplete="off"
              />
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3 mt-1">
              <label className="flex items-center gap-3 text-sm sm:text-base text-white cursor-pointer hover:text-cyan-300 transition-colors duration-150">
                <input
                  id="allowDownload"
                  type="checkbox"
                  checked={allowDownload}
                  onChange={() => setAllowDownload(!allowDownload)}
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-cyan-400 rounded focus:ring-cyan-500"
                />
                Allow Download
              </label>
              <label className="flex items-center gap-3 text-sm sm:text-base text-white cursor-pointer hover:text-cyan-300 transition-colors duration-150">
                <input
                  id="viewOnce"
                  type="checkbox"
                  checked={viewOnce}
                  onChange={() => {
                    setViewOnce(!viewOnce);
                    if (!viewOnce) setMaxUses(1);
                  }}
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-cyan-400 rounded focus:ring-cyan-500"
                />
                Allow View Only Once
              </label>
            </div>

            {/* Generate URL */}
            <button
              onClick={generateSignedUrl}
              disabled={!fileName || !expiration}
              className={`my-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white py-3 sm:py-3.5 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base 
              ${
                !fileName || !expiration ? "shadow-xs" : "shadow-lg"
              } hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-cyan-500/50 focus:outline-none`}
            >
              Generate Signed URL
            </button>
          </div>
        )}

        {/* Show Left Panel (Result) if signed url is generated */}
        {showLeftPanel && (
          <div className="w-full h-full flex flex-col gap-5 sm:gap-6 md:gap-7 animate-fade-in">
            {/* Back Button */}
            <button
              onClick={handleGenerateAnother}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm sm:text-base font-medium mb-1 self-start transition-all duration-200 hover:gap-3 group"
            >
              <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              Generate signed URL for another file
            </button>

            {/* Signed URL */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-lg sm:text-xl md:text-2xl text-white font-semibold">
                Signed URL
              </h2>
              <div className="bg-zinc-800 border border-zinc-700 hover:border-zinc-600 p-3 sm:p-4 rounded-lg min-h-[80px] sm:min-h-[100px] text-sm sm:text-base text-zinc-300 break-all transition-all duration-200 flex items-center">
                {signedUrl ? (
                  <span className="animate-fade-in">{signedUrl}</span>
                ) : (
                  <span className="text-zinc-500 italic">
                    Your signed URL will appear here...
                  </span>
                )}
              </div>
              {signedUrl && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-cyan-700/80 active:bg-cyan-700 border border-zinc-600 hover:border-cyan-500 text-white py-3 sm:py-3.5 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium shadow hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Clipboard className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-700 my-2 sm:my-3" />

            {/* Email Sharing */}
            <div className="space-y-2 sm:space-y-3">
              <label
                htmlFor="recipients"
                className="text-lg sm:text-xl md:text-2xl text-white font-semibold"
              >
                Send Link via Email
              </label>
              <textarea
                id="recipients"
                value={recipients}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter emails separated by commas..."
                className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-cyan-500 p-3 sm:p-3.5 rounded-lg text-sm sm:text-base text-white resize-none focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
                rows={3}
                autoComplete="off"
              />
              {hasInteracted && !recipients && (
                <div className="text-red-400 text-xs mt-1">
                  Recipient email(s) required.
                </div>
              )}
              <button
                onClick={sendEmail}
                disabled={!recipients || !signedUrl}
                className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-green-700/80 active:bg-green-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed border border-zinc-600 hover:border-green-500 text-white py-3 sm:py-3.5 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium shadow hover:shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
