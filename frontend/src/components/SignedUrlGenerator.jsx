// import { useEffect, useState } from "react";
// import { bucketFunc } from "@/store/bucketFunc.js";
// import { Clipboard, Mail } from "lucide-react";
// import { toast } from "sonner";
// import { useSearchParams } from "next/navigation";
// import "@/app/globals.css";

// export default function SignedUrlGenerator() {
//   const searchParams = useSearchParams();
//   const useDefault = searchParams.get("useDefault") === "true";

//   const [fileName, setFileName] = useState("");
//   const [expiration, setExpiration] = useState(60);
//   const [viewOnce, setViewOnce] = useState(false);
//   const [maxUses, setMaxUses] = useState(1);
//   const [allowDownload, setAllowDownload] = useState(true);
//   const [signedUrl, setSignedUrl] = useState("");
//   const [recipients, setRecipient] = useState("");

//   const generateDefaultBucketUrl = bucketFunc(
//     (state) => state.generateDefaultBucketUrl
//   );
//   const generatedUrl = bucketFunc((state) => state.generatedUrl);
//   const selectedBucket = bucketFunc((state) => state.selectedBucket);
//   const sendMail = bucketFunc((state) => state.sendMail);

//   const generateSignedUrl = async () => {
//     if (!fileName || !expiration) {
//       toast.warning("Please enter a file name and expiration Time");
//       return;
//     }

//     if (useDefault === true) {
//       generateDefaultBucketUrl(fileName, expiration);
//     } else {
//       // Add your custom bucket logic here if needed
//     }
//   };

//   const sendEmail = async () => {
//     if (!recipients) {
//       toast.warning("Please enter at least one recipient email address");
//       return;
//     }

//     const emailArray = recipients.split(",").map((email) => email.trim());
//     const recipient = emailArray;
//     await sendMail(fileName, expiration, recipient);
//   };

//   useEffect(() => {
//     if (generatedUrl) {
//       setSignedUrl(generatedUrl.Url || "Invalid URL response");
//     }
//   }, [generatedUrl]);

//   const copyToClipboard = () => {
//     if (signedUrl) {
//       navigator.clipboard.writeText(signedUrl);
//       toast.success("URL Copied");
//     }
//   };

//   return (
//     <div className="w-full h-screen overflow-y-auto hide-scrollbar flex justify-center items-start xs:items-center py-4 px-2 xs:px-4 bg-zinc-900">
//       <div className="w-full max-w-6xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl p-4 xs:p-6 flex flex-col md:flex-row gap-8 xs:gap-10 transition-all duration-300">
//         {/* Left Panel */}
//         <div className="w-full md:w-1/2 flex flex-col gap-6">
//           {/* Signed URL */}
//           <div className="space-y-3">
//             <h2 className="text-base xs:text-lg md:text-xl text-white font-semibold">
//               Signed URL
//             </h2>
//             <div className="bg-zinc-800 border border-zinc-700 p-3 xs:p-4 rounded-lg min-h-[60px] xs:min-h-[80px] text-xs xs:text-sm text-zinc-300 break-all transition-all duration-200">
//               {signedUrl ? signedUrl : "Your signed URL will appear here..."}
//             </div>
//             {signedUrl && (
//               <button
//                 onClick={copyToClipboard}
//                 className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-cyan-700 border border-zinc-600 text-white py-2 rounded-lg transition-all text-xs xs:text-sm font-medium shadow hover:scale-[1.03] active:scale-100"
//               >
//                 <Clipboard className="w-4 h-4" />
//                 Copy Link
//               </button>
//             )}
//           </div>

//           {/* Divider */}
//           <div className="border-t border-zinc-700" />

//           {/* Email Sharing */}
//           <div className="space-y-3">
//             <label className="text-xs xs:text-sm text-zinc-400">
//               Send Link via Email
//             </label>
//             <textarea
//               value={recipients}
//               onChange={(e) => setRecipient(e.target.value)}
//               placeholder="Enter emails separated by commas..."
//               className="w-full bg-zinc-800 border border-zinc-700 p-2 xs:p-3 rounded-lg text-xs xs:text-sm text-white resize-none"
//               rows={3}
//             />
//             <button
//               onClick={sendEmail}
//               className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-green-700 border border-zinc-600 text-white py-2 rounded-lg transition-all text-xs xs:text-sm font-medium shadow hover:scale-[1.03] active:scale-100"
//             >
//               <Mail className="w-4 h-4" />
//               Send Email
//             </button>
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="w-full md:w-1/2 flex flex-col gap-5">
//           {/* File Name */}
//           <div className="space-y-2">
//             <label className="text-xs xs:text-sm text-zinc-400">
//               File Name
//             </label>
//             <input
//               type="text"
//               placeholder="example.pdf"
//               value={fileName}
//               onChange={(e) => setFileName(e.target.value)}
//               className="w-full bg-zinc-800 border border-zinc-700 p-2 xs:p-3 rounded-lg text-xs xs:text-sm text-white"
//             />
//           </div>

//           {/* Expiration Time */}
//           <div className="space-y-2">
//             <label className="text-xs xs:text-sm text-zinc-400">
//               Expiration Time (minutes)
//             </label>
//             <input
//               type="number"
//               value={expiration}
//               onChange={(e) => setExpiration(e.target.value)}
//               className="w-full bg-zinc-800 border border-zinc-700 p-2 xs:p-3 rounded-lg text-xs xs:text-sm text-white"
//             />
//           </div>

//           {/* Max Uses */}
//           <div className="space-y-2">
//             <label className="text-xs xs:text-sm text-zinc-400">Max Uses</label>
//             <input
//               type="number"
//               value={maxUses}
//               onChange={(e) => setMaxUses(e.target.value)}
//               disabled={viewOnce}
//               className="w-full bg-zinc-800 border border-zinc-700 p-2 xs:p-3 rounded-lg text-xs xs:text-sm text-white disabled:opacity-50"
//             />
//           </div>

//           {/* Options */}
//           <div className="flex flex-col gap-3 mt-2">
//             <label className="flex items-center gap-3 text-xs xs:text-sm text-white">
//               <input
//                 type="checkbox"
//                 checked={allowDownload}
//                 onChange={() => setAllowDownload(!allowDownload)}
//                 className="accent-cyan-400"
//               />
//               Allow Download
//             </label>
//             <label className="flex items-center gap-3 text-xs xs:text-sm text-white">
//               <input
//                 type="checkbox"
//                 checked={viewOnce}
//                 onChange={() => setViewOnce(!viewOnce)}
//                 className="accent-cyan-400"
//               />
//               Allow View Only Once
//             </label>
//           </div>

//           {/* Generate URL */}
//           <button
//             onClick={generateSignedUrl}
//             className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white py-2 xs:py-3 rounded-lg font-semibold transition-all text-xs xs:text-sm shadow hover:scale-[1.03] active:scale-100"
//           >
//             Generate Signed URL
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { bucketFunc } from "@/store/bucketFunc.js";
import { Clipboard, Mail, ArrowLeftCircle } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import "@/app/globals.css";

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

  const generateDefaultBucketUrl = bucketFunc(
    (state) => state.generateDefaultBucketUrl
  );
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
      // Add your custom bucket logic here if needed
    }
    setShowLeftPanel(true);
  };

  const sendEmail = async () => {
    if (!recipients) {
      toast.warning("Please enter at least one recipient email address");
      return;
    }

    const emailArray = recipients.split(",").map((email) => email.trim());
    const recipient = emailArray;
    await sendMail(fileName, expiration, recipient);
  };

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

  const handleGenerateAnother = () => {
    setShowLeftPanel(false);
    setSignedUrl("");
    setFileName("");
    setExpiration(60);
    setViewOnce(false);
    setMaxUses(1);
    setAllowDownload(true);
    setRecipient("");
  };

  return (
  <div className="w-full max-w-6xl min-h-[calc(100vh-2rem)] flex justify-center items-center">
      <div className="w-full h-fit sm:h-[86.5vh] md:h-fit flex flex-col justify-center items-center bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl p-3 xs:p-4 sm:p-5 md:p-6 transition-all duration-300">
        {/* Show Right Panel (Form) if not showing left panel */}
        {!showLeftPanel && (
          <div className="w-full h-full flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6 mx-auto animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2 text-center drop-shadow-lg">
              Generate Signed URL
            </h2>
            
            {/* File Name */}
            <div className="space-y-1">
              <label className="text-sm sm:text-base text-zinc-400 font-medium">File Name</label>
              <input
                type="text"
                placeholder="example.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-cyan-500 p-3 sm:p-3.5 rounded-lg text-sm sm:text-base text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
              />
            </div>
            
            {/* Expiration Time */}
            <div className="space-y-1">
              <label className="text-sm sm:text-base text-zinc-400 font-medium">Expiration Time (minutes)</label>
              <input
                type="number"
                min="1"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-cyan-500 p-3 sm:p-3.5 rounded-lg text-sm sm:text-base text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
              />
            </div>
            
            {/* Max Uses */}
            <div className="space-y-1">
              <label className="text-sm sm:text-base text-zinc-400 font-medium">Max Uses</label>
              <input
                type="number"
                min="1"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                disabled={viewOnce}
                className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-cyan-500 p-3 sm:p-3.5 rounded-lg text-sm sm:text-base text-white disabled:opacity-60 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
              />
            </div>
            
            {/* Options */}
            <div className="flex flex-col gap-3 mt-1">
              <label className="flex items-center gap-3 text-sm sm:text-base text-white cursor-pointer hover:text-cyan-300 transition-colors duration-150">
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={() => setAllowDownload(!allowDownload)}
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-cyan-400 rounded focus:ring-cyan-500"
                />
                Allow Download
              </label>
              <label className="flex items-center gap-3 text-sm sm:text-base text-white cursor-pointer hover:text-cyan-300 transition-colors duration-150">
                <input
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
              ${!fileName || !expiration ? "shadow-xs" : "shadow-lg"} hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-cyan-500/50 focus:outline-none`}
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
                  <span className="text-zinc-500 italic">Your signed URL will appear here...</span>
                )}
              </div>
              {signedUrl && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-cyan-700/80 active:bg-cyan-700 border border-zinc-600 hover:border-cyan-500 text-white py-3 sm:py-3.5 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium shadow hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Clipboard className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              )}
            </div>
            
            {/* Divider */}
            <div className="border-t border-zinc-700 my-2 sm:my-3" />
            
            {/* Email Sharing */}
            <div className="space-y-2 sm:space-y-3">
              <label className="text-sm sm:text-base text-zinc-400 font-medium">
                Send Link via Email
              </label>
              <textarea
                value={recipients}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter emails separated by commas..."
                className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-cyan-500 p-3 sm:p-3.5 rounded-lg text-sm sm:text-base text-white resize-none focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
                rows={3}
              />
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