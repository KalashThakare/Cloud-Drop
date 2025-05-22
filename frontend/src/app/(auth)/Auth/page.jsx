"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore.js";
import { useRouter } from "next/navigation";

export default function Auth() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(true);

  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoginPage) {
      // Signup logic
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      if (!agreeToTerms) {
        alert("You must agree to the terms and conditions!");
        return;
      }

      const authUser = await signup({ name, email, password });
      if (authUser) {
        setIsLoginPage(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setAgreeToTerms(false);
      }
    } else {
      // Login logic
      const authUser = await login({ email, password });
      if (authUser) {
        // Check for redirectAfterLogin in localStorage
        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/Main";
        localStorage.removeItem("redirectAfterLogin"); // Clear the redirect key
        router.replace(redirectTo); // Redirect to the saved route or default to /Main
      }
    }
  };

  const togglePage = () => {
    setIsLoginPage(!isLoginPage);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setAgreeToTerms(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-0">
      <div className="w-full h-screen relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-900 via-gray-950 to-black"></div>

        <div
          className="relative h-full w-[200%] flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: isLoginPage ? "translateX(0)" : "translateX(-50%)",
          }}
        >
          {/* Login Form */}
          <div className="w-1/2 h-full flex items-center">
            <div className="w-full md:w-[400px] bg-black bg-opacity-70 p-8 rounded-lg mx-auto border border-gray-800">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Welcome Back
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition duration-200"
                >
                  Sign In Securely
                </button>
                <div className="text-center pt-4">
                  <button
                    type="button"
                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                    onClick={togglePage}
                  >
                    New to our platform? Create an account
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Signup Form */}
          <div className="w-1/2 h-full flex items-center">
            <div className="w-full md:w-[400px] bg-black bg-opacity-70 p-8 rounded-lg mx-auto border border-gray-800">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Get Started
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                    required
                  />
                </div>
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-cyan-500 border-gray-700 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-400">
                    I agree to the Terms of Service and Privacy Policy.
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition duration-200"
                >
                  Create Your Account
                </button>
                <div className="text-center pt-4">
                  <button
                    type="button"
                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                    onClick={togglePage}
                  >
                    Already a member? Sign in securely
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}