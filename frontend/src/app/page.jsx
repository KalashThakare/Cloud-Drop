// "use client";
// import React, { useEffect } from "react";
// import ScrollAnimation from "@/components/ScrollAnimation";
// import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
// import Link from "next/link";
// import SubscriptionPlans from "@/components/SubscriptionPlans";
// import { useRouter } from "next/navigation";
// import { isTokenValid } from "../lib/utils.js";
// import { useAuthStore } from "@/store/useAuthStore.js";

// export default function Home() {
//   const router = useRouter();
//   const checkAuth = useAuthStore((state) => state.checkAuth);

//   const handleClick = () => {
//     const token = localStorage.getItem("authToken");
//     console.log(token);
//     if (token && isTokenValid(token)) {
//       checkAuth();
//       router.push("/Main?useDefault=true");
//     } else {
//       router.push("/Auth");
//     }
//   };

//   const words = [
//     { text: "AWS" },
//     { text: "S3", className: "text-cyan-500 dark:text-cyan-500" },
//     { text: " with " },
//     { text: "SecureShare", className: "text-cyan-500 dark:text-cyan-500" },
//   ];

//   return (
//     <div className="relative min-h-screen bg-black text-white overflow-hidden">
//       <div className="absolute top-40 left-1/8 w-3/4 h-0.5 bg-cyan-400 rounded-3xl blur-lg opacity-30 shadow-[0_0_150px_150px_rgba(6,150,212,0.75)]"></div>

//       <header className="flex justify-between items-center px-8 py-6">
//         <h1 className="text-2xl font-bold">
//           <span className="text-cyan-400">S3</span>cureShare
//         </h1>
//         <nav className="flex items-center space-x-6">
//           <a href="#blog" className="text-lg hover:underline">
//             Blog
//           </a>
//         </nav>
//       </header>

//       <main className="flex flex-col items-center justify-center text-center px-6 py-20 mt-4">
//         <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-white opacity-100">
//           Unleash the power of <br />
//           <TypewriterEffectSmooth
//             className="text-center flex justify-center items-center"
//             words={words}
//           />
//         </h2>

//         <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
//           It is a long established fact that a reader will be distracted by the
//           readable content of a page when looking at its layout.
//         </p>

//         <div className="space-x-4">
//           {/* Use Free Bucket Button */}
//           <button
//             onClick={handleClick}
//             className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[2px] shadow-2xl shadow-zinc-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group"
//           >
//             <span className="absolute inset-0 overflow-hidden rounded-full">
//               <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
//             </span>
//             <div className="w-full relative flex items-center justify-center space-x-2 z-10 rounded-full bg-zinc-950 py-2 px-4 ring-1 ring-white/10">
//               <span className="text-sm font-semibold text-white">
//                 Use Free Bucket
//               </span>
//               <svg
//                 fill="none"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 width="16"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M10.75 8.75L14.25 12L10.75 15.25"
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1.5"
//                 />
//               </svg>
//             </div>
//             <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-cyan-500/0 via-cyan-500/90 to-cyan-500/0 transition-opacity duration-500 group-hover:opacity-40" />
//           </button>

//           {/* Use your own Bucket Button */}
//           <Link href={{ pathname: "/Main", query: { useDefault: "false" } }}>
//             <button className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
//               <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FFFF_0%,#007BFF_50%,#00FFFF_100%)]" />
//               <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
//                 Use your own Bucket
//               </span>
//             </button>
//           </Link>
//         </div>

//         <div className="flex justify-center mt-12">
//           <a
//             href="#Dashboard"
//             className="text-gray-400 hover:text-white transition"
//           >
//             <span className="text-lg">Learn More</span>
//             <br />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 mx-auto mt-2 animate-bounce"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 9l-7 7-7-7"
//               />
//             </svg>
//           </a>
//         </div>

//         <ScrollAnimation />
//         <SubscriptionPlans />
//       </main>

//       <footer className="absolute bottom-0 w-full bg-gray-800 py-4 text-center text-gray-400">
//         <p>© 2025 Cobalt. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// "use client";
// import React from "react";
// import ScrollAnimation from "@/components/ScrollAnimation";
// import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
// import Link from "next/link";
// import SubscriptionPlans from "@/components/SubscriptionPlans";
// import { useRouter } from "next/navigation";
// import { isTokenValid } from "../lib/utils.js";
// import { useAuthStore } from "@/store/useAuthStore.js";

// export default function Home() {
//   const router = useRouter();
//   const checkAuth = useAuthStore((state) => state.checkAuth);

//   const handleClick = () => {
//     const token = localStorage.getItem("authToken");
//     if (token && isTokenValid(token)) {
//       checkAuth();
//       router.push("/Main?useDefault=true");
//     } else {
//       router.push("/Auth");
//     }
//   };

//   const words = [
//     { text: "AWS" },
//     { text: "S3", className: "text-cyan-500 dark:text-cyan-500" },
//     { text: " with " },
//     { text: "SecureShare", className: "text-cyan-500 dark:text-cyan-500" },
//   ];

//   return (
//     <div className="relative min-h-screen bg-black text-white overflow-hidden">
//       {/* Background Glow */}
//       <div className="absolute top-40 left-1/8 w-3/4 h-0.5 bg-cyan-400 rounded-3xl blur-lg opacity-30 shadow-[0_0_150px_150px_rgba(6,150,212,0.75)]"></div>

//       {/* Header */}
//       <header className="flex justify-between items-center px-8 py-6">
//         <h1 className="text-4xl font-bold">
//           <span className="text-cyan-400">S3</span>cureShare
//         </h1>
//         <nav className="flex items-center space-x-6">
//           <a href="#features" className="text-lg hover:underline">
//             Features
//           </a>
//           <a href="#pricing" className="text-lg hover:underline">
//             Pricing
//           </a>
//           <a href="#contact" className="text-lg hover:underline">
//             Contact Us
//           </a>
//         </nav>
//       </header>

//       {/* Hero Section */}
//       <main className="flex flex-col items-center justify-center text-center px-6 py-20 mt-4">
//         <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-white opacity-100">
//           Unleash the power of <br />
//           <TypewriterEffectSmooth
//             className="text-center flex justify-center items-center"
//             words={words}
//           />
//         </h2>

//         <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
//           Effortlessly manage your files, collaborate with your team, and share
//           securely with S3cureShare.
//         </p>

//         <div className="space-x-4">
//           {/* Use Free Bucket Button */}
//           <button
//             onClick={handleClick}
//             className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[2px] shadow-2xl shadow-zinc-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group"
//           >
//             <span className="absolute inset-0 overflow-hidden rounded-full">
//               <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
//             </span>
//             <div className="w-full relative flex items-center justify-center space-x-2 z-10 rounded-full bg-zinc-950 py-2 px-4 ring-1 ring-white/10">
//               <span className="text-sm font-semibold text-white">
//                 Use Free Bucket
//               </span>
//               <svg
//                 fill="none"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 width="16"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M10.75 8.75L14.25 12L10.75 15.25"
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1.5"
//                 />
//               </svg>
//             </div>
//             <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-cyan-500/0 via-cyan-500/90 to-cyan-500/0 transition-opacity duration-500 group-hover:opacity-40" />
//           </button>

//           {/* Use your own Bucket Button */}
//           <Link href={{ pathname: "/Main", query: { useDefault: "false" } }}>
//             <button className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
//               <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FFFF_0%,#007BFF_50%,#00FFFF_100%)]" />
//               <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
//                 Use your own Bucket
//               </span>
//             </button>
//           </Link>
//         </div>

//         <div className="flex justify-center mt-12">
//           <a
//             href="#features"
//             className="text-gray-400 hover:text-white transition"
//           >
//             <span className="text-lg">Learn More</span>
//             <br />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 mx-auto mt-2 animate-bounce"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 9l-7 7-7-7"
//               />
//             </svg>
//           </a>
//         </div>
//       </main>

//       {/* Features Section */}
//       <section id="features" className="bg-gray-900 text-white py-20">
//         <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           <div className="feature-card">
//             <h3 className="text-xl font-semibold">Secure File Sharing</h3>
//             <p className="text-gray-400">
//               Share files with time-limited secure links and granular access
//               controls.
//             </p>
//           </div>
//           <div className="feature-card">
//             <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
//             <p className="text-gray-400">
//               Extract key insights from your documents with AI.
//             </p>
//           </div>
//           <div className="feature-card">
//             <h3 className="text-xl font-semibold">Team Collaboration</h3>
//             <p className="text-gray-400">
//               Create secure team spaces and collaborate efficiently.
//             </p>
//           </div>
//           <div className="feature-card">
//             <h3 className="text-xl font-semibold">Bucket Management</h3>
//             <p className="text-gray-400">
//               Switch between platform-provided and personal AWS S3 buckets.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <SubscriptionPlans />

//       {/* Footer */}
//       <footer className="w-full bg-gray-800 py-4 text-center text-gray-400">
//         <p>© 2025 S3cureShare. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

"use client";
import React, { useEffect } from "react";
import ScrollAnimation from "@/components/ScrollAnimation";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Link from "next/link";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { useRouter } from "next/navigation";
import { isTokenValid } from "../lib/utils.js";
import { useAuthStore } from "@/store/useAuthStore.js";

export default function Home() {
  const router = useRouter();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  useEffect(() => {
    // Smooth scroll with offset for hash links
    const handleHashClick = (e) => {
      const targetId = e.currentTarget.getAttribute('href');
      if (targetId?.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // 80px offset for header
            behavior: 'smooth'
          });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', handleHashClick);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleHashClick);
      });
    };
  }, []);

  const handleFreeClick = () => {
    const token = localStorage.getItem("authToken");
    if (token && isTokenValid(token)) {
      checkAuth();
      router.push("/Main?useDefault=true");
    } else {
      router.push("/Auth");
    }
  };
  const handleYourClick = () => {
    const token = localStorage.getItem("authToken");
  const authUser = useAuthStore.getState().authUser; // Access the authUser state

  if (token && isTokenValid(token) && authUser) {
    // User is authenticated, redirect to /Own
    router.push("/Own?useDefault=false");
  } else {
    // User is not authenticated, redirect to /Auth and then to /Own
    localStorage.setItem("redirectAfterLogin", "/Own?useDefault=false"); // Save the target route
    router.push("/Auth");
  }
  };

  const words = [
    { text: "Transform" },
    { text: "Your", className: "text-cyan-500 dark:text-cyan-500" },
    { text: "Cloud" },
    { text: "Workflow", className: "text-cyan-500 dark:text-cyan-500" },
  ];

  const features = [
    {
      title: "Secure File Management",
      description: "Upload files securely with end-to-end encryption and manage them in personal or platform-provided S3 buckets.",
      icon: "🔒"
    },
    {
      title: "Smart Collaboration",
      description: "Real-time group chat with role-based access controls and team management features.",
      icon: "💬"
    },
    {
      title: "AI-Powered Insights",
      description: "Automatically generate document summaries and extract key insights using advanced AI.",
      icon: "🧠"
    },
    {
      title: "Flexible Storage",
      description: "Seamlessly switch between platform buckets and your own AWS S3 storage with full control.",
      icon: "🔄"
    },
    {
      title: "Secure Sharing",
      description: "Generate time-limited signed URLs with granular access permissions for safe file distribution.",
      icon: "🔗"
    },
    {
      title: "Integrated Platform",
      description: "Full-stack solution combining Next.js frontend with Node.js/Express backend for optimal performance.",
      icon: "⚡"
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-40 left-1/8 w-3/4 h-0.5 bg-cyan-400 rounded-3xl blur-lg opacity-30 shadow-[0_0_150px_150px_rgba(6,150,212,0.75)]"></div>
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl opacity-10"></div>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 backdrop-blur-sm bg-black/50">
        <h1 className="text-4xl font-bold">
          <span className="text-cyan-400">Cloud</span>Drop
        </h1>
        <nav className="flex items-center space-x-6">
          <a href="#features" className="text-lg hover:text-cyan-400 transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-lg hover:text-cyan-400 transition-colors">
            Pricing
          </a>
          <a href="#technology" className="text-lg hover:text-cyan-400 transition-colors">
            Technology
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-20 mt-4 z-10 relative">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-white opacity-100">
          <TypewriterEffectSmooth
            className="text-center flex justify-center items-center"
            words={words}
          />
        </h2>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
          The ultimate cloud collaboration platform with secure file sharing, AI-powered insights, 
          and seamless bucket management. Built for teams that demand performance and security.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Use Free Bucket Button */}
          <button
            onClick={handleFreeClick}
            className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[2px] shadow-2xl shadow-cyan-900/50 focus:outline-none group transition-all hover:shadow-cyan-500/30"
          >
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="w-full relative flex items-center justify-center space-x-2 z-10 rounded-full bg-zinc-950 py-2 px-4 ring-1 ring-white/10 group-hover:ring-cyan-400/30 transition-all">
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
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-cyan-500/0 via-cyan-500/90 to-cyan-500/0 transition-opacity duration-500 group-hover:opacity-40" />
          </button>

          {/* Use your own Bucket Button */}
          {/* <Link href={{ pathname: "/Own", query: { useDefault: "false" } }}> */}
            <button onClick={handleYourClick} className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[1px] focus:outline-none group transition-all hover:shadow-[0_0_15px_5px_rgba(0,255,255,0.3)]">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FFFF_0%,#007BFF_50%,#00FFFF_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl group-hover:bg-slate-900 transition-all">
                Connect Your Bucket
              </span>
            </button>
          {/* </Link> */}
        </div>

        <div className="flex justify-center mt-12 animate-pulse">
          <a
            href="#features"
            className="text-gray-400 hover:text-cyan-400 transition-colors flex flex-col items-center"
          >
            <span className="text-lg">Explore Features</span>
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
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/80 to-black z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            CloudDrop combines enterprise-grade security with intuitive collaboration tools
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="technology" className="py-20 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Built With Modern Technology</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="tech-card">
              <div className="text-cyan-400 font-mono">Next.js</div>
              <div className="text-gray-400 text-sm">Frontend Framework</div>
            </div>
            <div className="tech-card">
              <div className="text-cyan-400 font-mono">Node.js</div>
              <div className="text-gray-400 text-sm">Backend Runtime</div>
            </div>
            <div className="tech-card">
              <div className="text-cyan-400 font-mono">Express</div>
              <div className="text-gray-400 text-sm">API Framework</div>
            </div>
            <div className="tech-card">
              <div className="text-cyan-400 font-mono">AWS S3</div>
              <div className="text-gray-400 text-sm">Cloud Storage</div>
            </div>
            <div className="tech-card">
              <div className="text-cyan-400 font-mono">MongoDB</div>
              <div className="text-gray-400 text-sm">Database</div>
            </div>
            <div className="tech-card">
              <div className="text-cyan-400 font-mono">Tailwind CSS</div>
              <div className="text-gray-400 text-sm">Styling</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <SubscriptionPlans />

      {/* Footer */}
      <footer className="w-full bg-gray-900/50 py-8 text-center border-t border-gray-800">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Cloud Workflow?</h3>
          <button
            onClick={handleFreeClick}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-6 rounded-full transition-colors mb-6"
          >
            Get Started Now
          </button>
          <p className="text-gray-400">© {new Date().getFullYear()} CloudDrop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Tech card component (could be moved to separate file)
function TechCard({ children }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center min-w-[120px] hover:border-cyan-500/30 transition-all">
      {children}
    </div>
  );
}