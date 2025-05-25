import React from "react";
import "@/app/globals.css";
import { Cloud, Shield, Users, Rocket } from "lucide-react";

const DashboardLanding = () => {
  return (
    <div className="h-full w-full md:min-h-[90vh] flex flex-col items-center bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 px-3 xs:px-4 sm:px-8 md:px-12 py-8 xs:py-10 sm:py-14 md:py-20 rounded-md text-white overflow-y-auto hide-scrollbar">
      {/* Title */}
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 xs:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-600 drop-shadow-xl tracking-tight text-center">
        Welcome to CloudDrop
      </div>
      {/* Subtitle */}
      <div className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-300 max-w-md xs:max-w-xl sm:max-w-2xl mb-8 xs:mb-10 sm:mb-14 mx-auto text-center">
        Seamlessly manage files, collaborate with your team, and securely share
        data — all from one intuitive cloud workspace.
      </div>

      {/* Feature Cards */}
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
        {/* Switch Buckets */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-cyan-950 border border-cyan-700/30 hover:scale-[1.015] hover:border-cyan-400/80 shadow-lg hover:shadow-cyan-400/30 rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col items-center h-full transition-all duration-200 group">
          <div className="mb-2">
            <Cloud className="w-10 h-10 text-cyan-400 group-hover:animate-pulse" />
          </div>
          <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-300 mb-1 xs:mb-2 group-hover:text-cyan-400 transition-colors">
            Switch Buckets
          </h3>
          <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-zinc-400 group-hover:text-cyan-200 transition-colors text-center">
            Use our secure platform bucket or connect your own S3 bucket for
            more control and visibility.
          </p>
        </div>
        {/* Secure File Sharing */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-emerald-950 border border-emerald-700/30 hover:scale-[1.015] hover:border-emerald-400/80 shadow-lg hover:shadow-emerald-400/30 rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col items-center h-full transition-all duration-200 group">
          <div className="mb-2">
            <Shield className="w-10 h-10 text-emerald-400 group-hover:animate-pulse" />
          </div>
          <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-emerald-300 mb-1 xs:mb-2 group-hover:text-emerald-400 transition-colors">
            Secure File Sharing
          </h3>
          <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-zinc-400 group-hover:text-emerald-200 transition-colors text-center">
            Upload files, generate signed URLs, set expiration and access
            filters with full control.
          </p>
        </div>
        {/* Collaborate with Teams */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-purple-950 border border-purple-700/30 hover:scale-[1.015] hover:border-purple-400/80 shadow-lg hover:shadow-purple-400/30 rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col items-center h-full transition-all duration-200 group md:col-span-2 lg:col-span-1">
          <div className="mb-2">
            <Users className="w-10 h-10 text-purple-400 group-hover:animate-pulse" />
          </div>
          <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-purple-300 mb-1 xs:mb-2 group-hover:text-purple-400 transition-colors">
            Collaborate with Teams
          </h3>
          <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-zinc-400 group-hover:text-purple-200 transition-colors text-center">
            Join group chats, share project files, and discuss tasks with
            built-in team messaging.
          </p>
        </div>
      </div>

      {/* Getting Started */}
      <div className="w-full flex items-center justify-center mb-4">
        <div className="mt-12 xs:mt-16 sm:mt-20 max-w-md xs:max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 via-zinc-800 to-cyan-950 border border-cyan-700/30 p-4 xs:p-6 rounded-xl shadow-lg">
          <h4 className="text-lg xs:text-xl text-cyan-300 font-semibold mb-2 xs:mb-3 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyan-400" /> Getting Started
          </h4>
          <ul className="list-disc pl-4 xs:pl-5 text-zinc-400 text-sm xs:text-md space-y-1 text-left">
            <li>
              Go to <strong>File Upload</strong> to start uploading your files.
            </li>
            <li>
              Use <strong>Signed URL</strong> to generate secure, temporary
              links.
            </li>
            <li>
              Switch between <strong>Platform</strong> and{" "}
              <strong>Personal Buckets</strong>.
            </li>
            <li>
              Head into <strong>Chat Rooms</strong> and collaborate with your
              team.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
