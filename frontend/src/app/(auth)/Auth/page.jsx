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
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      if (!agreeToTerms) {
        alert("You must agree to the terms and conditions!");
        return;
      }

      const authUser = await signup({ name, email, password });
      console.log(authUser);
      if (authUser) {
        setIsLoginPage(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setAgreeToTerms(false);
      }
    } else {
      const authUser = await login({ email, password });
      if (authUser) {
        router.replace("/");
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
          <div className="w-1/2 h-full flex items-center">
            <div className="w-full md:w-[400px] bg-black bg-opacity-70 p-8 rounded-lg mx-auto border border-gray-800">
              <div className="flex items-center justify-center mb-8">
                <h1 className="text-4xl font-bold">
                  <span className="text-cyan-400">S3</span>
                  <span className="text-white">cureShare</span>
                </h1>
              </div>
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Welcome Back
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-gray-900 rounded border border-gray-800 focus-within:border-cyan-500 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-none w-full text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-gray-900 rounded border border-gray-800 focus-within:border-cyan-500 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent border-none w-full text-white focus:outline-none"
                      required
                    />
                  </div>
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

          <div className="w-1/2 h-full flex items-center">
            <div className="w-full md:w-[400px] bg-black bg-opacity-70 p-8 rounded-lg mx-auto border border-gray-800">
              <div className="flex items-center justify-center mb-8">
                <h1 className="text-4xl font-bold">
                  <span className="text-cyan-400">S3</span>
                  <span className="text-white">cureShare</span>
                </h1>
              </div>
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Get Started
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-gray-900 rounded border border-gray-800 focus-within:border-cyan-500 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent border-none w-full text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-gray-900 rounded border border-gray-800 focus-within:border-cyan-500 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-none w-full text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-gray-900 rounded border border-gray-800 focus-within:border-cyan-500 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent border-none w-full text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-gray-900 rounded border border-gray-800 focus-within:border-cyan-500 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-transparent border-none w-full text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="h-4 w-4 text-cyan-500 border-gray-700 rounded focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-400">
                      I agree to S3cureShare's Terms of Service, Privacy Policy,
                      and Security Practices.
                    </label>
                  </div>
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
