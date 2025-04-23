"use client"

import React, { useState, useEffect } from 'react';
import { IconLink, IconSend, IconPlus } from "@tabler/icons-react"
import { chatFunc, groupFunc } from '@/store/chatStore';

const mockGroups = {
    created: ['Dev Room', 'Design Hub'],
    memberOf: ['Frontend Squad', 'AI Lab'],
};

const groupDetails = {
    'Dev Room': {
        createdBy: 'You',
        createdOn: '2025-03-15',
        members: ['You', 'Alice', 'Bob'],
    },
    'Design Hub': {
        createdBy: 'You',
        createdOn: '2025-03-20',
        members: ['You', 'Charlie'],
    },
    'Frontend Squad': {
        createdBy: 'Alice',
        createdOn: '2025-04-02',
        members: ['Alice', 'You', 'Bob'],
    },
    'AI Lab': {
        createdBy: 'Eve',
        createdOn: '2025-03-29',
        members: ['Eve', 'You'],
    },
};


const groupMessages = {
    'Dev Room': [
        { sender: 'Alice', content: 'Did we finish the upload logic?', fromUser: false },
        { sender: 'You', content: 'Yes, the logic is complete.', fromUser: true },
    ],
    'Frontend Squad': [
        { sender: 'Bob', content: 'Hey team!', fromUser: false },
    ],
};

const ChatLayout = () => {

    const getGroups = groupFunc((state) => state.getGroups);
    const createdGroups = groupFunc((state) => state.createdGroups);
    const memberGroups = groupFunc((state) => state.memberGroups);
    const createGroup = groupFunc((state) => state.createGroup);

    useEffect(() => {
        getGroups();
    }, [getGroups])

    const [selectedGroup, setSelectedGroup] = useState('Dev Room');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState(groupMessages[selectedGroup]);
    const [showInput, setShowInput] = useState(false);
    const [groupName, setGroupName] = useState("");

    // Dummy group creation (replace with your real logic/store)
    const handleCreateGroup = () => {
        if (!groupName.trim()) return;

        createGroup({ groupName });
        console.log("Create group:", groupName);

        createdGroups.push(groupName); // Ideally update via store
        setSelectedGroup(groupName);
        setMessages([]);
        setGroupName('');
        setShowInput(false);
    };




    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        setMessages(groupMessages[group.groupName] || []);
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = { sender: 'You', content: input, fromUser: true };
        const updated = [...messages, newMsg];
        setMessages(updated);
        groupMessages[selectedGroup] = updated;
        setInput('');
    };

    return (
        <div className="flex h-screen w-full text-white">
            {/* Sidebar */}
            <div className="w-72 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 tracking-tight">Your Groups</h2>

                {/* Create Group UI */}
                <div className="mb-4">
                    {!showInput ? (
                        <button
                            onClick={() => setShowInput(true)}
                            className="w-full bg-cyan-700 hover:bg-cyan-600 text-white py-2 rounded-lg transition flex justify-center items-center gap-2"
                        >
                            <span><IconPlus size={30} /></span> New Group
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Group name"
                                className="bg-zinc-800 border border-cyan-500 text-white px-3 py-2 rounded-lg focus:outline-none"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCreateGroup}
                                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => {
                                        setGroupName('');
                                        setShowInput(false);
                                    }}
                                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Created Groups */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
                    <div className="mb-6">
                        <h4 className="text-sm text-zinc-400 mb-2 uppercase tracking-widest">Created By You</h4>
                        <div className="space-y-1">
                            {createdGroups.map(group => (
                                <div
                                    key={group._id}
                                    className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${selectedGroup === group
                                        ? 'bg-zinc-800 border-l-4 border-sky-400 shadow'
                                        : 'hover:bg-zinc-800'
                                        }`}
                                    onClick={() => handleGroupClick(group)}
                                >
                                    <span className="text-blue-400 text-sm mr-2">📁</span>
                                    <span className="text-white text-sm">{group.groupName}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Member Groups */}
                    <div>
                        <h4 className="text-sm text-zinc-400 mb-2 uppercase tracking-widest">Member Of</h4>
                        <div className="space-y-1">
                            {memberGroups.map(group => (
                                <div
                                    key={group}
                                    className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${selectedGroup === group
                                        ? 'bg-zinc-800 border-l-4 border-blue-500 shadow'
                                        : 'hover:bg-zinc-800'
                                        }`}
                                    onClick={() => handleGroupClick(group)}
                                >
                                    <span className="text-green-400 text-sm mr-2">👥</span>
                                    <span className="text-white text-sm">{group}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>



            {/* Chat Area */}
            <div className="flex flex-col flex-1 bg-zinc-950 p-6">
                {/* Header */}
                {selectedGroup && (
                    <div className="mb-4 border-b border-zinc-800 pb-3">
                        <div className="text-xl font-semibold">{selectedGroup.groupName}</div>
                        <div className="text-sm text-zinc-400">
                            {selectedGroup.members?.length} members • Created on{' '}
                            {new Date(selectedGroup.createdAt).toLocaleDateString()}
                            {selectedGroup.createdBy !== 'You' && (
                                <> • Created by {selectedGroup.createdBy}</>
                            )}
                        </div>
                    </div>
                )}



                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {messages.map((msg, idx) => {
                        const showSender =
                            idx === 0 || messages[idx - 1].sender !== msg.sender;

                        return (
                            <div key={idx} className={`flex flex-col ${msg.fromUser ? 'items-end' : 'items-start'}`}>
                                {!msg.fromUser && showSender && (
                                    <span className="text-xs text-zinc-400 mb-1">{msg.sender}</span>
                                )}

                                <div
                                    className={`max-w-sm px-4 py-2 rounded-lg ${msg.fromUser ? 'bg-gray-500 text-white' : 'bg-zinc-800 text-white'
                                        }`}
                                >
                                    <div className="text-sm">{msg.content}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                    

                {/* Message Input */}
                <div className="mt-4 flex items-center gap-2 border-t border-zinc-800 pt-4">
                    {/* File Upload */}
                    <label htmlFor="file" className="cursor-pointer text-xl text-zinc-400 hover:text-white">
                        <IconLink size={34} />
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

                    {/* Textarea without scrollbars or border highlight */}
                    <textarea
                        className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg h-12 resize-none overflow-hidden focus:outline-none"
                        placeholder={`Message ${selectedGroup}`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
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



            </div>
        </div>
    );
};

export default ChatLayout;
