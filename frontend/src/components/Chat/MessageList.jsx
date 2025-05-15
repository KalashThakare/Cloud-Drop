import React, { useRef, useEffect } from "react";
import { IconMessageReport } from "@tabler/icons-react"

const MessageList = ({ messages, currentUserId, selectedGroup }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedGroup]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-scroll space-y-4 pr-2"
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 10+
      }}
    >
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="hide-scrollbar"></div>

      {selectedGroup ? (
        messages.length > 0 ? (
          messages.map((msg, idx) => {
            const fromUser = msg.senderId === currentUserId;
            const showSender =
              idx === 0 || messages[idx - 1].senderId !== msg.senderId;

            return (
              <div
                key={`${msg._id}-${idx}`}
                className={`flex flex-col ${fromUser ? "items-end" : "items-start"
                  }`}
              >
                {!fromUser && showSender && (
                  <span className="text-xs text-zinc-400 mb-1">
                    {msg.senderId}
                  </span>
                )}

                <div
                  className={`max-w-sm px-4 py-2 rounded-lg ${fromUser
                      ? "bg-gray-500 text-white"
                      : "bg-zinc-800 text-white"
                    }`}
                >
                  <div className="text-sm">{msg.text}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-500 text-sm">
            <div>< IconMessageReport className="text-red-700" /></div>
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
