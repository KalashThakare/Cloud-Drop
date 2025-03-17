"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, Globe, Key, Lock } from "lucide-react";
import { bucketFunc } from "@/store/bucketFunc.js";

export default function AddBucket() {
  const router = useRouter();
  const [bucket, setBucket] = useState({
    bucketName: "",
    bucketRegion: "",
    bucketKey: "",
    bucketSecret: "",
  });

  const handleChange = (e) => {
    setBucket({ ...bucket, [e.target.name]: e.target.value });
  };

  const { addBucket } = bucketFunc();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("New Bucket Data:", bucket);
    addBucket(bucket);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 rounded-2xl shadow-xl text-white border border-cyan-300"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-100 tracking-wide flex items-center justify-center gap-2">
          <FolderPlus className="w-8 h-8 text-cyan-300" /> Add New Bucket
        </h2>

        {/* Bucket Name */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Bucket Name</label>
          <div className="relative">
            <input
              type="text"
              name="bucketName"
              placeholder="Enter bucket name"
              value={bucket.bucketName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg outline-none focus:border-cyan-400 transition-all pl-10"
              required
            />
            <FolderPlus className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Bucket Region */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Bucket Region</label>
          <div className="relative">
            <input
              type="text"
              name="bucketRegion"
              placeholder="Enter bucket region"
              value={bucket.bucketRegion}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg outline-none focus:border-cyan-400 transition-all pl-10"
              required
            />
            <Globe className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Bucket Key */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Bucket Key</label>
          <div className="relative">
            <input
              type="text"
              name="bucketKey"
              placeholder="Enter bucket key"
              value={bucket.bucketKey}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg outline-none focus:border-cyan-400 transition-all pl-10"
              required
            />
            <Key className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Bucket Secret */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-1">Bucket Secret</label>
          <div className="relative">
            <input
              type="password"
              name="bucketSecret"
              placeholder="Enter bucket secret"
              value={bucket.bucketSecret}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg outline-none focus:border-cyan-400 transition-all pl-10"
              required
            />
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg text-lg font-semibold cursor-pointer transition-all hover:bg-green-600 active:scale-95 shadow-lg flex items-center justify-center gap-2"
        >
          <FolderPlus className="w-5 h-5" /> Add Bucket
        </button>
      </form>
    </div>
  );
}
