'use client'
import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore.js";
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state)=>state.login);

  const handleSubmit =async(e) => {
    e.preventDefault();
    console.log({email,password})
    const authUser = await login({email,password});
    router.replace("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 rounded-2xl shadow-xl text-white border border-cyan-300"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-100 tracking-wide">
          Welcome Back!
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg outline-none focus:border-cyan-400 transition-all"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg outline-none focus:border-cyan-400 transition-all"
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg text-lg font-semibold cursor-pointer transition-all hover:bg-green-600 active:scale-95 shadow-lg"
        >
          Login
        </button>

        {/* Extra Options */}
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-cyan-300 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
