import React from "react";
import { Users, Shield, Brain } from "lucide-react";
import "@/app/globals.css";

const WelcomeScreen = () => {
  return (
    <div className="h-[93vh] overflow-y-auto hide-scrollbar pb-4">
      <div className="relative flex flex-col justify-center items-center min-h-screen w-full px-4 xs:px-6 sm:px-8 md:px-10 font-sans text-white">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-zinc-900 opacity-90 -z-10" />

        {/* Intro */}
        <div className="text-center mb-10 xs:mb-12 sm:mb-16 hover:shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02] cursor-pointer group">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="text-cyan-500 drop-shadow group-hover:animate-pulse">
              Welcome to{" "}
            </span>
            <span className="text-white">SecureChat</span>
          </h1>
          <p className="text-base xs:text-lg text-zinc-400 mt-3 xs:mt-4 max-w-xl xs:max-w-2xl mx-auto leading-relaxed">
            Create secure team spaces, collaborate efficiently, and share files
            safely — with AI-enhanced productivity.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 xs:gap-8 md:gap-10 max-w-2xl xs:max-w-3xl md:max-w-6xl mx-auto">
          {/* Team Creation */}
          <div className="bg-zinc-900 border border-cyan-700/30 rounded-2xl p-4 xs:p-5 hover:shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02] cursor-pointer group">
            <div className="flex gap-2.5 text-2xl xs:text-3xl mb-3 xs:mb-4 text-cyan-400 group-hover:animate-pulse">
              <Users className="w-8 h-8" />
              <h3 className="text-lg xs:text-xl font-semibold mb-1 xs:mb-2 text-cyan-400">
                Team Creation
              </h3>
            </div>
            <p className="text-sm xs:text-md text-zinc-400">
              Set up a new workspace for your team to collaborate and innovate
              effortlessly.
            </p>
          </div>
          {/* Secure File Sharing */}
          <div className="bg-zinc-900 border border-emerald-700/30 rounded-2xl p-4 xs:p-5 hover:shadow-emerald-400/20 transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02] cursor-pointer group">
            <div className="flex gap-2.5 text-2xl xs:text-3xl mb-3 xs:mb-4 text-emerald-400 group-hover:animate-pulse">
              <Shield className="w-8 h-8" />
              <h3 className="text-lg xs:text-xl font-semibold mb-1 xs:mb-2 text-emerald-400">
                Secure File Sharing
              </h3>
            </div>
            <p className="text-sm xs:text-md text-zinc-400">
              Share files with time-limited secure links and granular access
              controls.
            </p>
          </div>
          {/* AI Summaries */}
          <div className="bg-zinc-900 border border-purple-700/30 rounded-2xl p-4 xs:p-5 hover:shadow-purple-400/20 transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02] cursor-pointer group">
            <div className="flex gap-2.5 text-2xl xs:text-3xl mb-3 xs:mb-4 text-purple-400 group-hover:animate-pulse">
              <Brain className="w-8 h-8" />
              <h3 className="text-lg xs:text-xl font-semibold mb-1 xs:mb-2 text-purple-400">
                AI-Powered Summaries
              </h3>
            </div>
            <p className="text-sm xs:text-md text-zinc-400">
              Let AI extract key insights from your documents — stay focused,
              act faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
