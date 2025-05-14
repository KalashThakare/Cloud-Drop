import React from 'react';
import { IconLink, IconSend } from "@tabler/icons-react";

const MessageInput = ({ selectedGroup, input, setInput, handleSend }) => {
    return (
        <div className="mt-4 flex items-center justify-center gap-2 border-t border-zinc-800 pt-4">
            {/* File Upload */}
            <label
                htmlFor="file"
                className="cursor-pointer text-xl text-zinc-400 hover:text-white"
            >
                <IconLink size={30} />
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
                className="flex-1 bg-zinc-800 text-white px-4 py-1 rounded-lg h-10 resize-none overflow-hidden focus:outline-none"
                placeholder={`Message ${selectedGroup.groupName}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
            />

            {/* Send Button */}
            <button
                onClick={handleSend}
                className="bg-cyan-700 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg"
            >
                <IconSend size={23} />
            </button>
        </div>
    );
};

export default MessageInput;