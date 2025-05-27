"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore.js";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { OTPstore } from "@/store/otpVerificaton.js";
import { toast } from "sonner";

export default function Auth() {
  const router = useRouter();
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);

  // Login form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLogin,
  } = useForm();

  // Signup form
  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    watch: signupWatch,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
    reset: resetSignup,
  } = useForm();

  const signupPassword = signupWatch("password", "");

  // Login handler
  const onLogin = async (data) => {
    const authUser = await login({
      email: data.email,
      password: data.password,
    });
    if (authUser) {
      const redirectTo =
        localStorage.getItem("redirectAfterLogin") || "/Main?useDefault=true";
      localStorage.removeItem("redirectAfterLogin");
      router.replace(redirectTo);
    }
  };

  // Signup handler
  const onSignup = async (data) => {
    const authUser = await signup({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    if (authUser) {
      setIsLoginPage(true);
      resetSignup();
    }
  };

  const togglePage = () => {
    setIsLoginPage(!isLoginPage);
    resetLogin();
    resetSignup();
  };

  // Send OTP handler
  const handleSendOtp = async () => {
  const name = signupWatch("name");
  const email = signupWatch("email");
  const password = signupWatch("password");
  const confirmPassword = signupWatch("confirmPassword");
  const agreeToTerms = signupWatch("agreeToTerms");

  if (!name || !email || !password || !confirmPassword) {
    toast.warning("Please fill in all fields.");
    return;
  }
  if (password !== confirmPassword) {
    toast.warning("Passwords do not match.");
    return;
  }
  if (!agreeToTerms) {
    toast.warning("You must agree to the Terms of Service and Privacy Policy.");
    return;
  }

  const sent = await OTPstore.getState().sendOTP(email);
  if (sent) {
    setOtpEmail(email);
    setIsOtpStep(true);
    setResendTimer(60);
  }
};

  // Resend OTP handler
  const handleResendOtp = async () => {
    await OTPstore.getState().resendOTP(otpEmail);
    setResendTimer(60);
  };

  // Timer effect
  useEffect(() => {
    if (isOtpStep && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOtpStep, resendTimer]);

  // OTP verification handler
  const handleVerifyOtp = async (otp) => {
    const verified = await OTPstore.getState().verifyOTP(otpEmail, otp);
    if (verified !== false) {
      // Now create the user
      const data = signupGetValues();
      const authUser = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (authUser) {
        setIsLoginPage(true);
        setIsOtpStep(false);
        resetSignup();
      }
    }
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
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-6">
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                    {...loginRegister("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {loginErrors.email && (
                    <span className="text-red-400 text-xs">
                      {loginErrors.email.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                    {...loginRegister("password", {
                      required: "Password is required",
                    })}
                  />
                  {loginErrors.password && (
                    <span className="text-red-400 text-xs">
                      {loginErrors.password.message}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoginSubmitting}
                  className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition duration-200"
                >
                  {isLoginSubmitting ? "Signing in..." : "Sign In Securely"}
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
              {!isOtpStep ? (
                <form
                  onSubmit={handleSignupSubmit((data) => {})}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                      {...signupRegister("name", {
                        required: "Name is required",
                      })}
                    />
                    {signupErrors.name && (
                      <span className="text-red-400 text-xs">
                        {signupErrors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                      {...signupRegister("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {signupErrors.email && (
                      <span className="text-red-400 text-xs">
                        {signupErrors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                      {...signupRegister("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    {signupErrors.password && (
                      <span className="text-red-400 text-xs">
                        {signupErrors.password.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white"
                      {...signupRegister("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === signupPassword || "Passwords do not match",
                      })}
                    />
                    {signupErrors.confirmPassword && (
                      <span className="text-red-400 text-xs">
                        {signupErrors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 text-cyan-500 border-gray-700 rounded"
                      {...signupRegister("agreeToTerms", {
                        required: "You must agree to the terms and conditions",
                      })}
                    />
                    <label
                      htmlFor="terms"
                      className="ml-3 text-sm text-gray-400"
                    >
                      I agree to the Terms of Service and Privacy Policy.
                    </label>
                  </div>
                  {signupErrors.agreeToTerms && (
                    <span className="text-red-400 text-xs">
                      {signupErrors.agreeToTerms.message}
                    </span>
                  )}
                  <div className="flex justify-center items-center gap-2">
                    <button
                      type="button"
                      className="py-2 px-4 w-full bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition duration-200"
                      onClick={handleSendOtp}
                    >
                      Send OTP
                    </button>
                  </div>
                </form>
              ) : (
                <OtpVerificationStep
                  email={otpEmail}
                  onVerify={handleVerifyOtp}
                  onResend={handleResendOtp}
                  resendTimer={resendTimer}
                  onBack={() => setIsOtpStep(false)}
                />
              )}
              <div className="text-center pt-4">
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                  onClick={togglePage}
                >
                  Already a member? Sign in securely
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// OTP Verification Step Component
function OtpVerificationStep({
  email,
  onVerify,
  onResend,
  resendTimer,
  onBack,
}) {
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onVerify(otp);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center text-gray-300 mb-2">
        Enter the OTP sent to <span className="text-cyan-400">{email}</span>
      </div>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        className="w-full p-3 bg-gray-900 rounded border border-gray-800 text-white tracking-widest text-center text-xl"
        placeholder="Enter 6-digit OTP"
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition duration-200"
      >
        {submitting ? "Verifying..." : "Verify OTP"}
      </button>
      <button
        type="button"
        className="w-full py-2 px-4 bg-gray-800 text-cyan-400 rounded mt-2"
        onClick={onResend}
        disabled={resendTimer > 0}
      >
        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
      </button>
      <button
        type="button"
        className="w-full py-2 px-4 bg-gray-700 text-gray-300 rounded mt-2"
        onClick={onBack}
      >
        Back to Signup
      </button>
    </form>
  );
}
