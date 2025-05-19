import React from "react";
import "@/app/globals.css";
import { Cloud, Shield, Users, Rocket } from "lucide-react";

const DashboardLanding = () => {
  return (
    <div className="h-[90vh] overflow-y-auto hide-scrollbar pb-4">
      <div
        id="Home"
        className="relative min-h-screen w-full px-4 xs:px-6 sm:px-8 md:px-10 pt-10 xs:pt-12 sm:pt-14 font-sans text-white"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-zinc-900 opacity-90 -z-10" />

        {/* Intro */}
        <div className="text-center mb-10 xs:mb-12 sm:mb-16 hover:shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02] cursor-pointer group">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight ">
            <span className="text-cyan-500 drop-shadow group-hover:animate-pulse">Welcome to </span>
            <span className="text-white">Cloud Drop</span>
          </h1>
          <p className="text-base xs:text-lg text-zinc-400 mt-3 xs:mt-4 max-w-xl xs:max-w-2xl mx-auto leading-relaxed">
            Seamlessly manage files, collaborate with your team, and securely
            share data — all from one intuitive cloud workspace.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 xs:gap-8 md:gap-10 max-w-2xl xs:max-w-3xl md:max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 xs:p-5 hover:shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02] cursor-pointer group">
            <div className="flex gap-2.5 text-2xl xs:text-3xl mb-3 xs:mb-4 text-cyan-400 group-hover:animate-pulse">
            <Cloud className="w-8 h-8" />
            <h3 className="text-lg xs:text-xl font-semibold mb-1 xs:mb-2 text-cyan-400">
              Switch Buckets
            </h3>
            </div>
            <p className="text-sm xs:text-md text-zinc-400">
              Use our secure platform bucket or connect your own S3 bucket for
              more control and visibility.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 xs:p-5 hover:shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02] cursor-pointer group">
            <div className="flex gap-2.5 text-2xl xs:text-3xl mb-3 xs:mb-4 text-blue-400 group-hover:animate-pulse">
            <Shield className="w-8 h-8" />
            <h3 className="text-lg xs:text-xl font-semibold mb-1 xs:mb-2 text-blue-400">
              Secure File Sharing
            </h3>
            </div>
            <p className="text-sm xs:text-md text-zinc-400">
              Upload files, generate signed URLs, set expiration and access
              filters with full control.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 xs:p-5 hover:shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02] cursor-pointer group">
            <div className="flex gap-2.5 text-2xl xs:text-3xl mb-3 xs:mb-4 text-green-400 group-hover:animate-pulse">
            <Users className="w-8 h-8" />
            <h3 className="text-lg xs:text-xl font-semibold mb-1 xs:mb-2 text-green-400">
              Collaborate with Teams
            </h3>
            </div>
            <p className="text-sm xs:text-md text-zinc-400">
              Join group chats, share project files, and discuss tasks with
              built-in team messaging.
            </p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="w-full flex items-center justify-center">
        <div className="mt-12 xs:mt-16 sm:mt-20 max-w-md xs:max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto bg-zinc-800 border border-zinc-700 p-4 xs:p-6 rounded-xl shadow-lg">
          <h4 className="text-lg xs:text-xl text-cyan-300 font-semibold mb-2 xs:mb-3 flex items-center gap-2">
            <i className="lucide lucide-rocket" /> Getting Started
          </h4>
          <ul className="list-disc pl-4 xs:pl-5 text-zinc-400 text-sm xs:text-md space-y-1">
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
    </div>
  );
};

export default DashboardLanding;
