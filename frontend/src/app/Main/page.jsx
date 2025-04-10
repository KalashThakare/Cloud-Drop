"use client";
import { axiosInstance } from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { useRouter , useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  LogOut,
  FilePlus2,
  Plug,
  Trash2,
} from "lucide-react";
import { bucketFunc } from "@/store/bucketFunc";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar.jsx";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import FileSelector from "@/components/FileSelector";
import SignedUrlGenerator from "@/components/SignedUrlGenerator";
import Link from "next/link";

function Main() {
  const searchParams = useSearchParams();
  const useDefault = searchParams.get("useDefault") === "true";
  const [activeView, setActiveView] = useState("home");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState();
  const [caption, setCaption] = useState("");
  const [connectingBucket, setConnectingBucket] = useState(null);
  const [secret, setSecret] = useState("");
  const [bucket, setBucket] = useState({
    bucketName: "",
    bucketRegion: "",
    bucketKey: "",
    bucketSecret: "",
  });

  const router = useRouter();
  const authUser = useAuthStore((state) => state.authUser);
  const checkAuth = useAuthStore((state)=>state.checkAuth);
  const isloggingin = useAuthStore((state) => state.isloggingin);
  const logout = useAuthStore((state) => state.logout);
  const fetchedBuckets = bucketFunc((state) => state.fetchedBuckets);
  const fetchBucket = bucketFunc((state) => state.fetchBucket);
  const connectPlatformBucket = bucketFunc((state) => state.connectPlatformBucket);
  const selectedBucket = bucketFunc((state) => state.selectedBucket);
  const deleteBucket = bucketFunc((state) => state.deleteBucket);
  const addBucket = bucketFunc((state) => state.addBucket);

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

   

  useEffect(() => {

    if (isloggingin) return;

    if (authUser === null) {
      router.replace("/Auth"); 
    } else {
      if (useDefault === true) {
        connectPlatformBucket()
      }
      fetchBucket(); 
    }
  }, [authUser, router, fetchBucket, isloggingin,connectPlatformBucket]);
  if (isloggingin)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-6 w-6 rounded-full border-2 border-cyan-300 border-t-transparent" />
          <span className="text-lg font-semibold">Loading your dashboard...</span>
        </div>
      </div>
    );
  
  
  

    if (!authUser) {
      return (
        <div className="flex items-center justify-center h-screen bg-black">
          <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl border-2 border-cyan-300 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-3 text-cyan-300">Access Denied</h2>
            <p className="text-base text-gray-300">Please log in to continue.</p>
          </div>
        </div>
      );
    }
    
  

  const links = [
    {
      label: "Your Buckets",
      href: "#",
      icon: (
        <IconBrandTabler className="h-6 w-6 text-xl shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => setActiveView("your_buckets"),
      className: "px-4 py-2 text-md",
    },
    {
      label: "Cloud Drop",
      href: "#",
      icon: (
        <IconUserBolt className="h-6 w-6 text-xl shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => setActiveView("cloud_drop"),
      className: "px-4 py-2 text-md",
    },
    {
      label: "File Upload",
      href: "#",
      icon: (
        <IconSettings className="h-6 w-6 text-xl shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => setActiveView("file_upload"),
      className: "px-4 py-2 text-md",
    },
    {
      label: "Signed URL",
      href: "#",
      icon: (
        <IconArrowLeft className="h-6 w-6 text-xl shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => setActiveView("signed_url"),
      className: "px-4 py-2 text-md",
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <LogOut className="h-6 w-6 text-xl shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => {
        logout();
        router.replace("/");
      },
      className:
        "hover:bg-red-500 hover:px-5 hover:py-3 w-fit px-4 mt-3 py-2 text-md rounded-full",
    },
  ];

  const handleConnectClick = (bucketName) => {
    setConnectingBucket(bucketName);
  };

  const connectToBucket = async (bucketName, secret) => {
    try {
      await connectBucket({ bucketName, secret });
      toast.success("Bucket connected successfully");
      setConnectingBucket(null);
      setSecret("");
    } catch (error) {
      toast.error("Failed to connect bucket");
      console.error(error);
    }
  };

  const deleteBucketId = async (bucketName) => {
    try {
      await deleteBucket({ bucketName });
      fetchBucket();
      toast.success("Bucket deleted successfully");
    } catch (error) {
      toast.error("Failed to delete bucket");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBucket((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBucket(bucket);
      toast.success("Bucket added successfully");
      setBucket({
        bucketName: "",
        bucketRegion: "",
        bucketKey: "",
        bucketSecret: "",
      });
      fetchBucket();
      setActiveView("your_buckets");
    } catch (error) {
      toast.error("Failed to add bucket");
      console.error(error);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedBucket) {
      toast.error("Please select bucket first");
      return;
    }

    const formData = new FormData();

    formData.append("bucketName", selectedBucket);
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      await axiosInstance.post("/use-platform-bucket/s3client/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully");
      setFile(null);
      setCaption("");
    } catch (error) {
      toast.error("Upload failed");
      console.error(error);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full h-screen flex-1 flex-col overflow-hidden border-0 border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true} className="w-2/9">
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div
              onClick={() => setActiveView("add_bucket")}
              className="relative z-20 flex items-center space-x-2 text-md font-normal text-black dark:text-white hover:bg-green-400 hover:text-black rounded-full w-fit hover:px-5 hover:py-3 px-4 py-2 cursor-pointer"
            >
              <FilePlus2 size={20} className="h-6 w-6" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre"
              >
                Switch Bucket
              </motion.span>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={link.onClick}
                  className={link.className}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard
        activeView={activeView}
        setActiveView={setActiveView}
        fetchedBuckets={fetchedBuckets}
        selectedBucket={selectedBucket}
        connectingBucket={connectingBucket}
        secret={secret}
        setSecret={setSecret}
        handleConnectClick={handleConnectClick}
        connectToBucket={connectToBucket}
        deleteBucketId={deleteBucketId}
        bucket={bucket}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        file={file}
        setFile={setFile}
        caption={caption}
        setCaption={setCaption}
        submit={submit}
      />
    </div>
  );
}

const Dashboard = ({
  activeView,
  setActiveView,
  fetchedBuckets,
  selectedBucket,
  connectingBucket,
  secret,
  setSecret,
  handleConnectClick,
  connectToBucket,
  deleteBucketId,
  setFile,
  caption,
  setCaption,
  submit,
}) => {
  return (
    <div className="flex justify-center border-0 items-center h-full w-full flex-1 flex-col gap-2 border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      {activeView === "home" && (
        <div id="Home">
          <h1>Welcome to Cloud Drop</h1>
        </div>
      )}
      {activeView === "add_bucket" && (
        <div className="flex flex-col gap-4 min-h-screen items-center justify-center">
        {/* Use Free Bucket Button */}
        
        <button className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[1px] shadow-2xl shadow-zinc-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group"
          onClick={() => setActiveView("home")}
        >
            
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
      )}
      {activeView === "your_buckets" && (
        <div className="w-96 p-6 rounded-xl bg-black shadow-lg text-white border border-gray-700">
          <h1 className="text-2xl font-bold mb-4 text-cyan-300 text-center">
            Your Buckets
          </h1>
          {selectedBucket && (
            <div className="p-3 mb-4 text-center text-white bg-green-700 rounded-lg">
              Connected to: <strong>{selectedBucket.bucketName}</strong>
            </div>
          )}

          <ul>
            {fetchedBuckets.length > 0 ? (
              fetchedBuckets.map((bucket) => (
                <li
                  key={bucket.bucketName}
                  className={`items-center p-3 border-b border-gray-600 
                    ${
                      selectedBucket?.bucketName === bucket.bucketName
                        ? "bg-green-900 text-cyan-300"
                        : ""
                    }`}
                >
                  <div className="flex flex-col">
                    <div className="flex">
                      <div className="flex-1 min-w-[150px]">
                        <p className="font-semibold truncate">
                          {bucket.bucketName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {bucket.bucketRegion}
                        </p>
                      </div>
                      <div className="flex gap-5">
                        <div>
                          <button
                            onClick={() =>
                              handleConnectClick(bucket.bucketName)
                            }
                            disabled={
                              selectedBucket?.bucketName === bucket.bucketName
                            }
                            className={`p-2 rounded-lg transition-all 
                              ${
                                selectedBucket?.bucketName === bucket.bucketName
                                  ? "bg-gray-500 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-500"
                              }`}
                          >
                            <Plug size={16} />
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() => deleteBucketId(bucket.bucketName)}
                            className="p-2 bg-red-600 text-white rounded-lg transition-all hover:bg-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {connectingBucket === bucket.bucketName && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="password"
                          placeholder="Enter password"
                          value={secret}
                          onChange={(e) => setSecret(e.target.value)}
                          className="p-2 w-full border border-gray-600 rounded-lg bg-gray-900 text-white focus:border-blue-400 focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            connectToBucket(bucket.bucketName, secret)
                          }
                          className="p-2 bg-blue-600 text-white rounded-lg transition-all hover:bg-green-600"
                        >
                          Connect
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400">No buckets found</p>
            )}
          </ul>
        </div>
      )}
      {activeView === "cloud_drop" && (
        <form
          onSubmit={submit}
          className="w-96 p-6 rounded-xl bg-black shadow-lg flex flex-col gap-4 text-center border border-gray-700"
        >
          <h1 className="text-2xl font-bold mb-2 text-cyan-300">Cloud-drop</h1>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            accept="image/*"
            className="p-5 border-2 border-dashed border-gray-600 rounded-xl bg-gray-900 cursor-pointer text-white transition-all hover:border-blue-400 hover:bg-gray-800"
          />
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            type="text"
            placeholder="Caption"
            className="p-3 border border-gray-600 rounded-lg text-lg text-white bg-gray-900 focus:border-blue-400 focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-lg text-lg cursor-pointer transition-all hover:bg-blue-500 active:translate-y-0"
          >
            Upload
          </button>
        </form>
      )}
      {activeView === "file_upload" && <FileSelector />}
      {activeView === "signed_url" && <SignedUrlGenerator />}
    </div>
  );
};

export default Main;
