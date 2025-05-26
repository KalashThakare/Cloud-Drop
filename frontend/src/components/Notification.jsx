import { useSocketEventStore } from "@/store/socketEvents";
import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, Info, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";

function Notification() {
  const notifications = useSocketEventStore((s) => s.notifications);
  const clearNotifications = useSocketEventStore((s) => s.clearNotifications);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    setHasInteracted(true);
  }, []); // Set to true on mount (when user opens notifications)

  // Example: Clear all notifications with error handling
  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      // If clearNotifications is async, await it; otherwise, just call it
      await Promise.resolve(clearNotifications());
      toast.success("All notifications cleared!");
    } catch (error) {
      // If backend returns a handled error
      if (error?.response?.status && error.response.status < 500) {
        toast.warning(getErrorMessage(error, "Could not clear notifications."));
      } else {
        toast.error(getErrorMessage(error, "Failed to clear notifications."));
      }
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-950 text-white rounded-2xl shadow-2xl p-6 border border-cyan-700/60 mt-8 transition-all duration-300">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Bell className="text-cyan-400 w-7 h-7 animate-pulse" />
        <h2 className="text-2xl font-bold text-cyan-300 text-center tracking-tight drop-shadow">
          Notifications
        </h2>
      </div>
      <div className="flex justify-end mb-2">
        <button
          onClick={handleClearAll}
          disabled={isClearing || notifications.length === 0}
          className="text-xs px-3 py-1 rounded bg-cyan-800 hover:bg-cyan-700 disabled:bg-zinc-700 transition"
        >
          {isClearing ? "Clearing..." : "Clear All"}
        </button>
      </div>
      {notifications.length === 0 && hasInteracted ? (
        <div className="flex flex-col items-center text-center text-zinc-400 py-8">
          <Info className="w-8 h-8 mb-2 text-cyan-500/80" />
          <span className="font-medium mb-1">No new notifications</span>
          <span className="text-xs text-zinc-500">
            You’ll see updates here when someone sends a message to a group you
            are not currently viewing.
          </span>
        </div>
      ) : (
        <ul className="space-y-3 max-h-80 overflow-y-auto custom-scroll">
          {notifications.map((n, idx) => (
            <li
              key={idx}
              className="bg-zinc-800/90 border border-cyan-900/30 rounded-lg p-3 flex items-start gap-3 shadow hover:shadow-cyan-900/10 transition-all"
            >
              <div className="pt-1">
                {n.type === "success" ? (
                  <CheckCircle2 className="text-green-400 w-5 h-5" />
                ) : n.type === "error" ? (
                  <XCircle className="text-red-400 w-5 h-5" />
                ) : (
                  <Bell className="text-cyan-400 w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-cyan-100">{n.text}</span>
                <div className="text-xs text-zinc-400 mt-1">
                  {new Date(n.time).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;
