"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { bucketFunc } from "@/store/bucketFunc";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar.jsx";
import {
  IconCloudUp,
  IconShieldHalfFilled,
  IconUsersGroup,
  IconFolderOpen,
  IconBellRinging,
  IconLogout2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import SignedUrlGenerator from "@/components/SignedUrlGenerator";
import ChatPage from "@/components/Chat/page";
import DashboardLanding from "@/components/ui/DashboardLanding.jsx";
import UploadForm from "@/components/CloudDrop.jsx";
import { useSocketEventStore } from "@/store/socketEvents";
import Notification from "@/components/Notification";
import FileManagerPage from "@/components/FileManagerPage";

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
  const hasUnreadNotification = useSocketEventStore(
    (s) => s.hasUnreadNotification
  );

  const router = useRouter();
  const viewHistory = useRef([]);
  const isNavigating = useRef(false);
  const authUser = useAuthStore((state) => state.authUser);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isloggingin = useAuthStore((state) => state.isloggingin);
  const logout = useAuthStore((state) => state.logout);
  const fetchedBuckets = bucketFunc((state) => state.fetchedBuckets);
  const fetchBucket = bucketFunc((state) => state.fetchBucket);
  const connectPlatformBucket = bucketFunc(
    (state) => state.connectPlatformBucket
  );
  const selectedBucket = bucketFunc((state) => state.selectedBucket);
  const deleteBucket = bucketFunc((state) => state.deleteBucket);
  const addBucket = bucketFunc((state) => state.addBucket);
  
const changeView = (newView) => {
  isNavigating.current = true;
  
  // Special case: when coming from auth, ensure home is in history
  if (viewHistory.current.length === 0) {
    viewHistory.current = ["home", newView];
  } else {
    viewHistory.current.push(newView);
  }
  
  window.history.pushState({ view: newView }, "");
  setActiveView(newView);
  setTimeout(() => isNavigating.current = false, 100);
};

useEffect(() => {

  // Reset everything on reload
  viewHistory.current = ["home"];
  window.history.replaceState({ view: "home" }, "");
  setActiveView("home");
  
  // Clear forward history
  if (window.history.length > 1) {
    window.history.go(1);
  }
}, []);

useEffect(() => {
  const handlePopState = (event) => {
    if (isNavigating.current){ return;}
    if (viewHistory.current.length > 1) {
      viewHistory.current.pop();
      const prevView = viewHistory.current[viewHistory.current.length - 1];
      setActiveView(prevView);
    } else {
      router.replace("/");
    }
  };

  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, [router]);

  // Initialize socket events and check authentication
  useEffect(() => {
    checkAuth(router);
    useSocketEventStore.getState().initSocketEvents();
    return () => useSocketEventStore.getState().cleanup();
  }, [checkAuth]);

  // Fetch buckets and connect to platform bucket if needed
  useEffect(() => {
    if (isloggingin) return;

    if (authUser === null) {
      if (useDefault) {
        localStorage.setItem("useDefaultAfterLogin", "true");
      }
      router.push("/Auth");
    } else {
      if (useDefault === true) {
        connectPlatformBucket();
      }
      // fetchBucket();
    }
  }, [authUser, router, fetchBucket, isloggingin, connectPlatformBucket]);

  // Fetch buckets when authUser changes
  if (isloggingin)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-6 w-6 rounded-full border-2 border-cyan-300 border-t-transparent" />
          <span className="text-lg font-semibold">
            Loading your dashboard...
          </span>
        </div>
      </div>
    );

  // If user is not authenticated, show access denied message
  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-950 to-slate-950">
        <div className="bg-black text-white p-8 rounded-2xl shadow-xl border-[1px] border-cyan-300 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-3 text-cyan-500">
            Access Denied
          </h2>
          <p className="text-base text-gray-300">Please log in to continue.</p>
        </div>
      </div>
    );
  }

  const links = [
    {
    label: "Cloud Drop",
    href: "#",
    icon: (
      <IconCloudUp className="h-6 w-6 text-xl shrink-0 text-cyan-600 dark:text-cyan-300" />
    ),
    // onClick: () => setActiveView("cloud_drop"),
    onClick: (e) => {
        e.preventDefault();
        changeView("cloud_drop");
        // setOpen(false);
      },
    className: "px-4 py-2 text-md",
  },
  {
    label: "Signed URL",
    href: "#",
    icon: (
      <IconShieldHalfFilled className="h-6 w-6 text-xl shrink-0 text-emerald-600 dark:text-emerald-300" />
    ),
    // onClick: () => setActiveView("signed_url"),
    onClick: (e) => {
        e.preventDefault();
        changeView("signed_url");
        // setOpen(false);
      },
    className: "px-4 py-2 text-md",
  },
  {
    label: "Chat Room",
    href: "#",
    icon: (
      <IconUsersGroup className="h-6 w-6 text-xl shrink-0 text-fuchsia-600 dark:text-fuchsia-300" />
    ),
    // onClick: () => setActiveView("Chat_Room"),
    onClick: (e) => {
        e.preventDefault();
        changeView("Chat_Room");
        // setOpen(false);
      },
    className: "px-4 py-2 text-md",
  },
  {
    label: "File Manager",
    href: "#",
    icon: (
      <IconFolderOpen className="h-6 w-6 text-xl shrink-0 text-yellow-600 dark:text-yellow-300" />
    ),
    // onClick: () => setActiveView("file_manager"),
    onClick: (e) => {
        e.preventDefault();
        changeView("file_manager");
        // setOpen(false);
      },
    className: "px-4 py-2 text-md",
  },
  {
    label: (
      <span className="relative">
        Notification
        {hasUnreadNotification && (
          <span className="absolute -top-1 -right-3 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
        )}
      </span>
    ),
    href: "#",
    icon: (
      <IconBellRinging className="h-6 w-6 text-xl shrink-0 text-orange-500 dark:text-orange-300" />
    ),
    onClick: (e) => {
        e.preventDefault();
        changeView("notification");
      useSocketEventStore.getState().clearNotifications();
    },
    className: "px-4 py-2 text-md",
  },
    {
    label: "Logout",
    href: "#",
    icon: (
      <IconLogout2 className="h-6 w-6 text-xl shrink-0 text-red-500 dark:text-red-400" />
    ),
    onClick: (e) => {
      e.preventDefault();
      logout();
      router.replace("/");
    },
    className:
      "hover:bg-zinc-900 hover:px-5 hover:py-3 w-fit px-4 mt-3 py-2 text-md rounded-full",
  },
  ];

  const handleConnectClick = (bucketName) => {
    setHasInteracted(true);
    setConnectingBucket(bucketName);
  };

  const connectToBucket = async (bucketName, secret) => {
    setHasInteracted(true);
    try {
      await connectBucket({ bucketName, secret });
      toast.success("Bucket connected successfully");
      setConnectingBucket(null);
      setSecret("");
    } catch (error) {
      if (error?.response?.status && error.response.status < 500) {
        toast.warning(getErrorMessage(error, "Failed to connect bucket"));
      } else {
        toast.error(getErrorMessage(error, "Failed to connect bucket"));
      }
      // console.error(error);
    }
  };

  const deleteBucketId = async (bucketName) => {
    setHasInteracted(true);
    try {
      await deleteBucket({ bucketName });
      fetchBucket();
      toast.success("Bucket deleted successfully");
    } catch (error) {
      if (error?.response?.status && error.response.status < 500) {
        toast.warning(getErrorMessage(error, "Failed to delete bucket"));
      } else {
        toast.error(getErrorMessage(error, "Failed to delete bucket"));
      }
      // console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBucket((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasInteracted(true);
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
      if (error?.response?.status && error.response.status < 500) {
        toast.warning(getErrorMessage(error, "Failed to add bucket"));
      } else {
        toast.error(getErrorMessage(error, "Failed to add bucket"));
      }
      // console.error(error);
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
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={(e) => {
                    if (link.onClick) link.onClick(e);
                    setOpen(false);
                  }}
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
    <div
      className={`flex ${
        activeView === "Chat_Room" || activeView === "home"
          ? `${ activeView === "Chat_Room" ? "p-0" : "p-1" }`
          : "p-4 md:p-8"
      } border-0 items-center h-full w-full flex-1 flex-col gap-2 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-zinc-900`}
    >

          {activeView === "home" && <DashboardLanding />}
          {activeView === "cloud_drop" && <UploadForm />}
          {activeView === "file_manager" && <FileManagerPage />}
          {activeView === "signed_url" && <SignedUrlGenerator />}
          {activeView === "Chat_Room" && <ChatPage />}
          {activeView === "notification" && <Notification />}
    </div>
  );
};

export default Main;
