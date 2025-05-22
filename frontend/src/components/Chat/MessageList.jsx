import React, { useRef, useEffect } from "react";
import { IconMessageReport, IconPercentage100 } from "@tabler/icons-react"

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

                <p
                  className={`max-w-md w-auto break-all text-sm px-4 py-2 rounded-lg 
                    ${fromUser
                      ? "bg-slate-800 border border-slate-700 text-white"
                      : "bg-neutral-800 border border-neutral-700 text-white"
                    }
                    ${fromUser ? "rounded-br-none" : "rounded-bl-none"}
                    `}
                >{msg.text}</p>
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
