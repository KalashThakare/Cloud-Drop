import React from 'react';
import { IconLink, IconSend } from "@tabler/icons-react";

const MessageInput = ({ selectedGroup, input, setInput, handleSend }) => {
    return (
        <div className="
            my-3 xs:my-4
            flex items-center gap-4
            border-t border-zinc-800
            py-3 xs:py-4
            bg-gradient-to-bl from-zinc-950/80 via-slate-950/80 to-zinc-950/60
            rounded-b-xl
            px-2 xs:px-4 sm:px-6
            w-full
            transition-all
        ">
            {/* File Upload */}
            <label
                htmlFor="file"
                className="cursor-pointer text-xl text-zinc-400 hover:text-cyan-400 transition-colors duration-150 flex-shrink-0"
                title="Attach file"
            >
                <IconLink size={26} className="xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
            </label>
            <input
                type="file"
                id="file"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        handleSend(`[File Uploaded: ${file.name}]`);
                    }
                }}
            />

            {/* Textarea */}
            <textarea
                className="
                    flex-1
                    bg-zinc-800
                    text-white
                    px-3 xs:px-4
                    py-1.5 xs:py-2
                    rounded-lg
                    h-8 xs:h-10 sm:h-12
                    resize-none
                    overflow-hidden
                    focus:outline-none
                    focus:ring-2 focus:ring-cyan-500/40
                    text-xs xs:text-sm sm:text-base
                    placeholder:text-zinc-400
                    transition-all
                    min-w-0
                    min-h-8
                "
                placeholder={`Message: ${selectedGroup.groupName}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                rows={1}
            />

            {/* Send Button */}
            <button
                onClick={handleSend}
                className="
                    bg-cyan-700 hover:bg-cyan-500 active:bg-cyan-800
                    text-white
                    px-3 xs:px-4 py-2
                    rounded-lg
                    shadow
                    transition-all duration-150
                    flex-shrink-0
                    focus:outline-none focus:ring-2 focus:ring-cyan-400/50
                    text-xs xs:text-sm sm:text-base
                    disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed
                "
                // disabled={!input.trim()}
                title="Send"
            >
                <IconSend size={20} className="xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
            </button>
        </div>
    );
};

export default MessageInput;