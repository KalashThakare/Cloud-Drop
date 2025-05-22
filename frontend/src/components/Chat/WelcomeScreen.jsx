import React from "react";
import "@/app/globals.css"; // Import global styles
const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center text-center rounded-md text-white min-h-[80vh] h-full px-3 xs:px-4 sm:px-8 md:px-12 py-8 xs:py-10 sm:py-14 md:py-20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-cyan-950 overflow-y-scroll hide-scrollbar">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 xs:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-600 drop-shadow-xl tracking-tight">
        Welcome to SecureChat
      </div>
      <div className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-300 max-w-md xs:max-w-xl sm:max-w-2xl mb-8 xs:mb-10 sm:mb-14 mx-auto">
        Create secure team spaces, collaborate efficiently, and share files
        safely — with AI-enhanced productivity.
      </div>

      <div
        className="
        grid 
        gap-5 xs:gap-6 sm:gap-7 md:gap-8 lg:gap-10
        w-full
        max-w-xs xs:max-w-2xl sm:max-w-4xl md:max-w-5xl lg:max-w-7xl
        grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        transition-all
      "
      >
        {/* Team Creation */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-cyan-950 border border-cyan-700/30 hover:scale-[1.015] hover:border-cyan-400/80 shadow-lg hover:shadow-cyan-400/30 rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col items-center h-full transition-all duration-200 group">
          <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-300 mb-1 xs:mb-2 group-hover:text-cyan-400 transition-colors">
            Team Creation
          </h3>
          <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-zinc-400 group-hover:text-cyan-200 transition-colors">
            Set up a new workspace for your team to collaborate and innovate
            effortlessly.
          </p>
        </div>

        {/* Secure File Sharing */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-emerald-950 border border-emerald-700/30 hover:scale-[1.015] hover:border-emerald-400/80 shadow-lg hover:shadow-emerald-400/30 rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col items-center h-full transition-all duration-200 group">
          <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-emerald-300 mb-1 xs:mb-2 group-hover:text-emerald-400 transition-colors">
            Secure File Sharing
          </h3>
          <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-zinc-400 group-hover:text-emerald-200 transition-colors">
            Share files with time-limited secure links and granular access
            controls.
          </p>
        </div>

        {/* AI Summaries */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-purple-950 border border-purple-700/30 hover:scale-[1.015] hover:border-purple-400/80 shadow-lg hover:shadow-purple-400/30 rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col items-center h-full transition-all duration-200 group md:col-span-2 lg:col-span-1">
          <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-purple-300 mb-1 xs:mb-2 group-hover:text-purple-400 transition-colors">
            AI-Powered Summaries
          </h3>
          <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-zinc-400 group-hover:text-purple-200 transition-colors">
            Let AI extract key insights from your documents — stay focused, act
            faster.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
