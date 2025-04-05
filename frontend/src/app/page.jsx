"use client";
import React from "react";
import ScrollAnimation from "@/components/ScrollAnimation";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Link from "next/link";

export default function Home() {

  const words = [
    {
      text: "AWS",
    },
    {
      text: "S3",
      className: "text-cyan-500 dark:text-cyan-500",
    },
    {
      text: " with ",
    },
    {
      text: "SecureShare",
      className: "text-cyan-500 dark:text-cyan-500",
    },
  ]

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute top-40 left-1/8 w-3/4 h-0.5 bg-cyan-500 rounded-3xl blur-lg opacity-30 shadow-[0_0_150px_150px_rgba(6,150,212,0.75)]"></div>

      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold">
          <span className="text-cyan-400">S3</span>cureShare
        </h1>
        <nav className="flex items-center space-x-6">
          <a href="#blog" className="text-lg hover:underline">
            Blog
          </a>
          {/* <button className="relative inline-flex h-10 w-28 overflow-hidden rounded-full p-[1px] shadow-2xl shadow-zinc-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group">
            <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="w-full relative flex items-center justify-center space-x-2 z-10 rounded-full bg-zinc-950 py-2 px-4 ring-1 ring-white/10">
            <span className="text-sm font-semibold text-white">Login</span>
            <svg
                fill="none"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                d="M10.75 8.75L14.25 12L10.75 15.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                />
            </svg>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-cyan-500/0 via-cyan-500/90 to-cyan-500/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button> */}

        </nav>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
          Unleash the power of <br />
          <TypewriterEffectSmooth className={"text-center flex justify-center items-center"} words={words} />
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </p>
    <div className="space-x-4">
        {/* Use Free Bucket Button */}
        <Link href={"/Auth"}>
        <button className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[1px] shadow-2xl shadow-zinc-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group">
            
            <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="w-full relative flex items-center justify-center space-x-2 z-10 rounded-full bg-zinc-950 py-2 px-4 ring-1 ring-white/10">
            <span className="text-sm font-semibold text-white">Use Free Bucket</span>
            <svg
                fill="none"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                d="M10.75 8.75L14.25 12L10.75 15.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                />
            </svg>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-cyan-500/0 via-cyan-500/90 to-cyan-500/0 transition-opacity duration-500 group-hover:opacity-40" />
            
            
        </button>
        </Link>

        {/* Use your own Bucket Button */}
        <Link href={"/Own"}>
        <button className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FFFF_0%,#007BFF_50%,#00FFFF_100%)]" />
        <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Use your own Bucket
            </span>
        </button>
        </Link>
    </div>

    <div className="flex justify-center mt-12">
        <a
          href="#Dashboard"
          className="text-gray-400 hover:text-white transition"
        >
          <span className="text-lg">Learn More</span>
          <br />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mx-auto mt-2 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </a>
      </div>


      <ScrollAnimation />


    </main>

      <footer className="absolute bottom-0 w-full bg-gray-800 py-4 text-center text-gray-400">
        <p>© 2025 Cobalt. All rights reserved.</p>
      </footer>
    </div>
  );
}
