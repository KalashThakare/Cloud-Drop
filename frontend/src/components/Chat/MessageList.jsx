import React, { useRef, useEffect } from "react";
import {
  IconMessageReport,
  IconCopy,
  IconExternalLink,
} from "@tabler/icons-react";

const MessageList = ({ messages, currentUserId, selectedGroup }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedGroup]);

  // Helper to detect and extract signed URL from message text
  const extractSignedUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  };

  // Copy to clipboard utility
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };

  // Helper to format time as HH:mm
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-3 xs:space-y-4 sm:space-y-5 px-1 xs:px-2 custom-scroll min-h-0 bg-gradient-to-br from-zinc-950/80 via-slate-950/80 to-zinc-950/60"
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 10+
      }}
    >
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="custom-scroll"></div>

      {selectedGroup ? (
        messages.length > 0 ? (
          messages.map((msg, idx) => {
            const fromUser = msg.senderId === currentUserId;
            const showSender =
              idx === 0 || messages[idx - 1].senderId !== msg.senderId;

            // Check for signed URL in message
            const signedUrl = extractSignedUrl(msg.text);

            return (
              <div
                key={`${msg._id}-${idx}`}
                className={`flex flex-col ${
                  fromUser
                    ? "items-end ml-6 xs:ml-8 sm:ml-10"
                    : "items-start mr-6 xs:mr-8 sm:mr-10"
                }`}
              >
                {!fromUser && showSender && (
                  <span className="text-xs xs:text-sm text-zinc-400 mb-1 pl-1">
                    {msg.senderRole}
                  </span>
                )}

                <div
                  className={`relative max-w-md w-auto break-all text-sm px-4 py-2 rounded-lg 
                    ${
                      fromUser
                        ? "bg-slate-800 border border-slate-700 text-white"
                        : "bg-neutral-800 border border-neutral-700 text-white"
                    }
                    ${fromUser ? "rounded-br-none" : "rounded-bl-none"}
                  `}
                >
                  {signedUrl ? (
                    <div className="flex flex-col gap-1">
                      <span>
                        {msg.text.split(signedUrl)[0]}
                        <a
                          href={signedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 underline break-all hover:text-cyan-300 transition"
                        >
                          {signedUrl}
                        </a>
                        {msg.text.split(signedUrl)[1]}
                      </span>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => handleCopy(signedUrl)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-xs text-white transition"
                          title="Copy URL"
                        >
                          <IconCopy size={16} /> Copy
                        </button>
                        <a
                          href={signedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-700 hover:bg-cyan-600 text-xs text-white transition"
                          title="Open in new tab"
                        >
                          <IconExternalLink size={16} /> View
                        </a>
                      </div>
                    </div>
                  ) : (
                    msg.text
                  )}
                  {/* Message time at the bottom right inside rounded brackets */}
                  <span className="block text-[0.65rem] xs:text-[0.70rem] text-zinc-400 mt-2 text-right">
                    ({formatTime(msg.createdAt)})
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-500 text-sm">
            <div>
              <IconMessageReport className="text-red-700" />
            </div>
            <span className="p-1">
              No messages yet. Start the conversation!
            </span>
          </div>
        )
      ) : (
        <div className="h-full w-full flex items-center justify-center text-zinc-500 text-sm">
          Select a group to start chatting.
        </div>
      )}
    </div>
  );
};

export default MessageList;
