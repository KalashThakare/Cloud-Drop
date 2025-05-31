"use client";
import { useState, useEffect } from "react";
import { useLocomotiveScroll } from "@/components/hooks/useLocomotiveScroll.js";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { useRouter } from "next/navigation";
import { isTokenValid } from "../lib/utils.js";
import { useAuthStore } from "@/store/useAuthStore.js";
import { subscriptionStore } from "@/store/subscriptionStore.js";
import "@/app/custom.css"; 

// Responsive, attractive dashboard/landing page for CloudDrop
export default function Home() {
  const [scrollRef, locoInstance] = useLocomotiveScroll();
  const router = useRouter();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const getPlans = subscriptionStore((state) => state.getPlans);

  // Mobile nav state
  const [navOpen, setNavOpen] = useState(false);
  function isDesktop() {
  if (typeof window === "undefined") return false;
  return window.innerWidth === 1920 || window.innerWidth === 2560 || window.innerWidth === 2880 || window.innerWidth === 1680 || window.innerWidth === 1440 || window.innerWidth === 1536 || window.innerWidth === 1366;
}
  useEffect(() => {
  getPlans();
  const handleAnchorClick = (e) => {
    const href = e.currentTarget.getAttribute("href");
    if (href?.startsWith("#")) {
      const el = document.querySelector(href);
      if (isDesktop() && el && locoInstance.current) {
        e.preventDefault();
        locoInstance.current.scrollTo(el, { offset: 10 });
      }
      // On mobile, let the browser handle the anchor normally (no preventDefault)
    }
  };
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => link.addEventListener("click", handleAnchorClick));
  return () => {
    links.forEach((link) =>
      link.removeEventListener("click", handleAnchorClick)
    );
  };
}, [locoInstance, getPlans]);

  const handleFreeClick = async () => {
    const token = localStorage.getItem("authToken");
    if (token && isTokenValid(token)) {
      checkAuth();
      router.push("/Main?useDefault=true");
    } else {
      router.push("/Auth");
    }
  };

  // const handleYourClick = () => {
  //   const token = localStorage.getItem("authToken");
  //   const authUser = useAuthStore.getState().authUser;
  //   if (token && isTokenValid(token) && authUser) {
  //     router.push("/Own?useDefault=false");
  //   } else {
  //     localStorage.setItem("redirectAfterLogin", "/Own?useDefault=false");
  //     router.push("/Auth");
  //   }
  // };

  const words = [
    { text: "Transform" },
    { text: "Your", className: "text-cyan-500/80 dark:text-cyan-400/80" },
    { text: "Cloud" },
    { text: "Workflow", className: "text-cyan-500/80 dark:text-cyan-400/80" },
  ];

  // Enhanced features for CloudDrop
  const features = [
    {
      title: "Secure File Management",
      description:
        "Upload files securely with end-to-end encryption and manage them in personal or platform-provided S3 buckets.",
      icon: "🔒",
    },
    {
      title: "Smart Collaboration",
      description:
        "Real-time group chat, role-based access, and team management. Add, remove, and assign roles to members instantly.",
      icon: "💬",
    },
    {
      title: "AI-Powered Insights",
      description:
        "Generate document summaries and extract key insights using advanced AI for faster decision-making.",
      icon: "🧠",
    },
    {
      title: "Flexible Storage",
      description:
        "Switch between CloudDrop's secure platform bucket and your own AWS S3 with a single click.",
      icon: "🔄",
    },
    {
      title: "Secure Sharing",
      description:
        "Generate time-limited signed URLs with granular access controls for safe file distribution.",
      icon: "🔗",
    },
    {
      title: "Integrated Platform",
      description:
        "Modern stack: Next.js frontend, Node.js/Express backend, AWS S3, MongoDB, and Tailwind CSS for performance and scalability.",
      icon: "⚡",
    },
  ];

  // Add a testimonials section
  const testimonials = [
    {
      name: "Amit S.",
      company: "Acme Corp",
      quote:
        "CloudDrop made our team collaboration seamless and secure. The signed URL feature is a game changer for sharing sensitive files.",
      avatar: "🧑‍💼",
    },
    {
      name: "Priya K.",
      company: "DataWorks",
      quote:
        "The ability to switch between platform and personal buckets is unique and super useful. Highly recommended!",
      avatar: "👩‍💻",
    },
    {
      name: "Rahul D.",
      company: "TechFlow",
      quote:
        "AI-powered summaries save us hours every week. CloudDrop is the best cloud collaboration tool we've used.",
      avatar: "👨‍💼",
    },
  ];

  return (
    <div ref={scrollRef} data-scroll-container className="relative min-h-screen bg-zinc-950 text-white overflow-hidden font-sans">
      {/* Decorative background */}
      <div className="absolute top-40 left-1/8 w-3/4 h-0.5 bg-cyan-700/30 rounded-3xl blur-lg opacity-30 shadow-[0_0_150px_150px_rgba(8,145,178,0.15)]"></div>
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-zinc-700/80 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-900/30 rounded-full filter blur-3xl opacity-15"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-2 backdrop-blur-sm bg-zinc-950/80 border-b border-zinc-800/50">
        <div className="relative flex flex-row justify-between items-center">
        <img src="Logo.png" alt="Logo" className="h-[4rem] -top-2"/>  
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="text-zinc-300">Cloud</span>
          <span className="text-cyan-600">Drop</span>
        </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#features"
            className="text-base lg:text-lg text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-base lg:text-lg text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="text-base lg:text-lg text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            Testimonials
          </a>
          <a
            href="#technology"
            className="text-base lg:text-lg text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            Technology
          </a>
        </nav>
        {/* Mobile menu button */}
        <button
          className="md:hidden text-zinc-400 focus:outline-none"
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Open navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Mobile nav drawer */}
        {navOpen && (
          <div className="absolute top-full left-0 w-full bg-zinc-950/95 border-b border-zinc-800/50 flex flex-col items-center py-4 space-y-2 md:hidden z-50">
            <a
              href="#features"
              className="text-base text-zinc-400 hover:text-cyan-400 transition-colors"
              onClick={() => setNavOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-base text-zinc-400 hover:text-cyan-400 transition-colors"
              onClick={() => setNavOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-base text-zinc-400 hover:text-cyan-400 transition-colors"
              onClick={() => setNavOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#technology"
              className="text-base text-zinc-400 hover:text-cyan-400 transition-colors"
              onClick={() => setNavOpen(false)}
            >
              Technology
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 mt-4 z-10 relative">
        <TypewriterEffectSmooth
          className="
            text-3xl
            sm:text-4xl
            md:text-4xl
            lg:text-5xl
            xl:text-6xl
            font-extrabold
            leading-tight
          "
          words={words}
        />
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-md sm:max-w-xl md:max-w-2xl mx-auto mb-8 leading-relaxed">
          The ultimate cloud collaboration platform with secure file sharing,
          AI-powered insights, and seamless bucket management. Built for teams
          that demand performance and security.
        </p>
        <div className="w-full max-w-xs sm:max-w-md justify-center">
          {/* <button
            onClick={handleFreeClick}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] shadow-lg shadow-zinc-900/50 focus:outline-none group transition-all hover:shadow-cyan-900/20 w-full sm:w-48"
          >
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(8,145,178,0.2)_0%,rgba(8,145,178,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="w-full relative flex items-center justify-center space-x-2 z-10 rounded-full bg-zinc-900 py-2 px-4 ring-1 ring-zinc-700/50 group-hover:ring-cyan-800/30 transition-all">
              <span className="text-sm font-semibold text-white">
                Try Free Bucket
              </span>
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
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-cyan-800/0 via-cyan-800/70 to-cyan-800/0 transition-opacity duration-500 group-hover:opacity-40" />
          </button> */}
          <button
            onClick={handleFreeClick}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none group transition-all hover:shadow-[0_0_15px_5px_rgba(8,145,178,0.1)] w-full sm:w-48"
          >
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3f3f46_0%,#0891b2_30%,#3f3f46_60%)]" />
            <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-zinc-900 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl group-hover:bg-zinc-800 hover:text-cyan-500 transition-all">
              Get Started
            </span>
          </button>
        </div>
        <div className="flex justify-center mt-12 animate-pulse">
          <a
            href="#features"
            className="text-zinc-500 hover:text-cyan-400 transition-colors flex flex-col items-center"
          >
            <span className="text-base sm:text-lg">Explore Features</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mt-2 animate-bounce"
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
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/80 to-zinc-950 z-0">
          <div className="absolute left-1/4 top-1/4 w-1/2 h-1/2 bg-cyan-900/5 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">
            Powerful Features
          </h2>
          <p className="text-zinc-400 text-center max-w-lg sm:max-w-xl md:max-w-2xl mx-auto mb-8 sm:mb-12 text-sm sm:text-base">
            CloudDrop combines enterprise-grade security with intuitive
            collaboration tools.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 sm:p-6 hover:border-cyan-900/30 transition-all hover:shadow-lg hover:shadow-cyan-950/10 flex flex-col items-center text-center"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <SubscriptionPlans handleFreeClick={handleFreeClick} />

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-16 sm:py-20 bg-gradient-to-b from-zinc-950/80 to-zinc-900/90 border-t border-zinc-800/40"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-cyan-900/10 transition-all"
              >
                <div className="text-4xl mb-3">{t.avatar}</div>
                <blockquote className="text-zinc-300 italic mb-3">
                  "{t.quote}"
                </blockquote>
                <div className="text-cyan-400 font-semibold">{t.name}</div>
                <div className="text-zinc-500 text-xs">{t.company}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section
        id="technology"
        className="py-16 sm:py-20 bg-gradient-to-b from-zinc-900/50 to-zinc-950 relative"
      >
        <div className="absolute right-0 top-1/3 w-32 h-32 bg-cyan-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-cyan-950/10 filter blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Built With Modern Technology
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
            {[
              {
                name: "Next.js",
                category: "Frontend Framework",
              },
              {
                name: "Node.js",
                category: "Backend Runtime",
              },
              {
                name: "Express",
                category: "API Framework",
              },
              {
                name: "AWS S3",
                category: "Cloud Storage",
              },
              {
                name: "MongoDB",
                category: "Database",
              },
              {
                name: "Tailwind CSS",
                category: "Styling",
              },
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 sm:p-4 text-center hover:border-cyan-900/20 transition-all"
              >
                <div className="text-cyan-100 font-mono text-sm sm:text-base">
                  {tech.name}
                </div>
                <div className="text-zinc-500 text-xs sm:text-sm mt-1">
                  {tech.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full bg-gradient-to-t from-zinc-900/50 to-zinc-950 py-6 sm:py-8 text-center border-t border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">
            Ready to Transform Your Cloud Workflow?
          </h3>
          <button
            onClick={handleFreeClick}
            className="bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-2 px-4 sm:px-6 rounded-full transition-colors mb-4 sm:mb-6 border border-cyan-900/20 hover:border-cyan-800/30 shadow-sm shadow-cyan-950/10"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-zinc-900/70 py-8 sm:py-10 border-t border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="grid grid-cols-2 grid-rows-2 md:grid-rows-1 md:grid-cols-3 gap-10 md:gap-8 mb-8 justify-between items-start"
            // style={{ gridTemplateColumns: "30% 25% 45%" }}
          >
            {/* Column 1: About Us, Pricing, Policy */}
            <div className="flex flex-col gap-8 col-span-1">
              {/* About Us */}
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-lg">
                  About Us
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  CloudDrop is a modern cloud collaboration platform enabling
                  secure file management, team chat, and seamless AWS S3
                  integration. Built for teams and individuals who value
                  privacy, security, and productivity.
                </p>
              </div>
              {/* Pricing */}
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-lg">
                  Pricing
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Flexible plans for every need.
                  <br />
                  <a href="#pricing" className="text-cyan-300 hover:underline">
                    View Pricing
                  </a>
                </p>
              </div>
              {/* Policies (links only) */}
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-lg">
                  Policies
                </h4>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>
                    <button
                      className="hover:underline text-cyan-300 text-left"
                      onClick={() =>
                        window.scrollTo({
                          top: document.body.scrollHeight,
                          behavior: "smooth",
                        })
                      }
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      className="hover:underline text-cyan-300 text-left"
                      onClick={() =>
                        window.scrollTo({
                          top: document.body.scrollHeight,
                          behavior: "smooth",
                        })
                      }
                    >
                      Terms &amp; Conditions
                    </button>
                  </li>
                  <li>
                    <button
                      className="hover:underline text-cyan-300 text-left"
                      onClick={() =>
                        window.scrollTo({
                          top: document.body.scrollHeight,
                          behavior: "smooth",
                        })
                      }
                    >
                      Cancellation/Refund Policy
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            {/* Column 2: Quick Links, Contact */}
            <div className="flex flex-col gap-8 col-span-1">
              {/* Quick Links */}
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-lg">
                  Quick Links
                </h4>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>
                    <a
                      href="#features"
                      className="hover:underline text-cyan-300"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#testimonials"
                      className="hover:underline text-cyan-300"
                    >
                      Testimonials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#technology"
                      className="hover:underline text-cyan-300"
                    >
                      Technology
                    </a>
                  </li>
                </ul>
              </div>
              {/* Contact Us */}
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-lg">
                  Contact Us
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Have questions or need support?
                  <br />
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=clouddrop.s3@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 hover:underline break-all"
                  >
                    clouddrop.s3@gmail.com
                  </a>
                  <br />
                  <span className="text-zinc-500">Mon-Fri, 9am-6pm IST</span>
                </p>
              </div>
            </div>
            {/* Column 3: Policy Descriptions */}
            <div className="flex flex-col flex-1 gap-6 col-span-2 md:col-span-1">
              <div>
                <h5 className="text-cyan-300 font-semibold mb-1">
                  Privacy Policy
                </h5>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  CloudDrop values your privacy. We do not share your files or
                  personal data with third parties. All files are encrypted in
                  transit and at rest. You control your data at all times. For
                  more details, contact us at{" "}
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=clouddrop.s3@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 hover:underline break-all"
                  >
                    clouddrop.s3@gmail.com
                  </a>
                  .
                </p>
              </div>
              <div>
                <h5 className="text-cyan-300 font-semibold mb-1">
                  Terms &amp; Conditions
                </h5>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  By using CloudDrop, you agree to use the service for lawful
                  purposes only. You are responsible for the content you upload
                  and share. CloudDrop is not liable for data loss due to user
                  actions or third-party integrations. Please review our full
                  terms before using the platform.
                </p>
              </div>
              <div>
                <h5 className="text-cyan-300 font-semibold mb-1">
                  Cancellation/Refund Policy
                </h5>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  You may cancel your subscription at any time from your account
                  dashboard. Premium plan payments are non-refundable once the
                  billing cycle has started. If you experience issues, contact{" "}
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=clouddrop.s3@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 hover:underline break-all"
                  >
                    clouddrop.s3@gmail.com
                  </a>{" "}
                  for assistance.
                </p>
              </div>
            </div>
          </div>
          {/* Copyright */}
          <div className="mt-10 border-t border-zinc-800 px-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <span className="text-zinc-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} CloudDrop. All rights reserved.
            </span>
            <span className="text-xs text-zinc-500 text-center md:text-right">
              Built with Next.js, AWS S3, MongoDB, and Tailwind CSS.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
