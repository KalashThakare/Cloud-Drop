"use client"

import React, { useState, useEffect } from 'react';
import { IconLink, IconSend, IconPlus } from "@tabler/icons-react"
import { chatFunc, groupFunc } from '@/store/chatStore';
import MemberDrawer from '../MemberDrawer.jsx';

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
    const deleteGroup = groupFunc((state) => state.deleteGroup);
    const addMember = groupFunc((state) => state.addMember);

    const sendMessage = chatFunc((state)=>state.sendMessage);

    useEffect(() => {
        getGroups();
    }, [getGroups])

    const [selectedGroup, setSelectedGroup] = useState('');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState(groupMessages[selectedGroup]);
    const [showInput, setShowInput] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [memberEmail, setMemberEmail] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false)



    const handleCreateGroup = () => {
        if (!groupName.trim()) return;

        createGroup({ groupName });
        console.log("Create group:", groupName);

        createdGroups.push(groupName);
        setSelectedGroup(groupName);
        setMessages([]);
        setGroupName('');
        setShowInput(false);
    };

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        console.log(selectedGroup._id);
        deleteGroup(selectedGroup._id);
        setShowConfirm(false);
    };

    const handleAddMember = () => {

        const groupId = selectedGroup._id
        addMember({ groupId, memberEmail });

    }

    const onRemoveMember = () => {

    }




    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        setMessages(groupMessages[group.groupName] || []);
        console.log(selectedGroup.members)
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = { sender: 'You', content: input, fromUser: true };
        const updated = [...messages, newMsg];
        setMessages(updated);
        groupMessages[selectedGroup] = updated;
        setInput('');

        const groupId = selectedGroup._id

        sendMessage({groupId,text:input})
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
                            <span><IconPlus size={25} /></span> New Group
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
                                    <span className="text-white text-sm">{group.groupName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>



            {/* Chat Area */}
            <div className="flex flex-col flex-1 bg-zinc-950 p-6">
                {!selectedGroup && (
                    <div className="flex flex-col items-center justify-center text-center text-white h-full px-6 sm:px-10 py-12">
                        <div className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Welcome to SecureChat
                        </div>
                        <div className="text-base sm:text-lg text-zinc-400 max-w-2xl mb-12">
                            Create secure team spaces, collaborate efficiently, and share files safely — with AI-enhanced productivity.
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3 w-full max-w-5xl">
                            {/* Team Creation */}
                            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 transition hover:border-cyan-500 hover:shadow-md">
                                <h3 className="text-lg font-semibold text-cyan-300 mb-2">Team Creation</h3>
                                <p className="text-sm text-zinc-400">Set up a new workspace for your team to collaborate and innovate effortlessly.</p>
                            </div>

                            {/* Secure File Sharing */}
                            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 transition hover:border-emerald-400 hover:shadow-md">
                                <h3 className="text-lg font-semibold text-emerald-300 mb-2">Secure File Sharing</h3>
                                <p className="text-sm text-zinc-400">Share files with time-limited secure links and granular access controls.</p>
                            </div>

                            {/* AI Summaries */}
                            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 transition hover:border-purple-400 hover:shadow-md">
                                <h3 className="text-lg font-semibold text-purple-300 mb-2">AI-Powered Summaries</h3>
                                <p className="text-sm text-zinc-400">Let AI extract key insights from your documents — stay focused, act faster.</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* Header */}
                {/* Header */}
                {selectedGroup && (
                    <>
                        <div className="mb-4 border-b border-zinc-800 pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xl font-semibold">{selectedGroup.groupName}</div>
                                    <div className="text-sm text-zinc-400">
                                        {selectedGroup.members?.length} members • Created on{' '}
                                        {new Date(selectedGroup.createdAt).toLocaleDateString()}
                                        {selectedGroup.createdBy !== 'You' && selectedGroup.members?.length > 0 && (
                                            <> • Created by {selectedGroup.members[0].email}</>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowAddMember(true)}
                                    className="text-emerald-500 text-sm border border-emerald-600 px-3 py-1 rounded hover:bg-emerald-600 hover:text-white transition"
                                >
                                    Add Member
                                </button>

                                <button
                                    onClick={handleDeleteClick}
                                    className="text-red-600 text-sm border border-red-700 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
                                >
                                    Delete Group
                                </button>
                            </div>
                        </div>

                        {/* Move this outside the flex container */}
                        <MemberDrawer
                            isOpen={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                            members={selectedGroup.members}
                            onRemove={onRemoveMember}
                        />
                    </>
                )}




                {/* Confirm Delete Modal */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-xl max-w-sm w-full border border-zinc-700">
                            <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
                            <p className="mb-4">Are you sure you want to delete this group? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showAddMember && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-xl max-w-sm w-full border border-zinc-700">
                            <h2 className="text-lg font-bold mb-3">Add Member</h2>
                            <input
                                type="email"
                                placeholder="Enter member's email"
                                className="w-full p-2 mb-4 rounded bg-zinc-800 border border-zinc-600 text-white"
                                value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowAddMember(false)}
                                    className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMember}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}




                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {selectedGroup ? (
                        messages.map((msg, idx) => {
                            const showSender =
                                idx === 0 || messages[idx - 1].sender !== msg.sender;

                            return (
                                <div key={idx} className={`flex flex-col ${msg.fromUser ? 'items-end' : 'items-start'}`}>
                                    {!msg.fromUser && showSender && (
                                        <span className="text-xs text-zinc-400 mb-1">{msg.sender}</span>
                                    )}

                                    <div
                                        className={`max-w-sm px-4 py-2 rounded-lg ${msg.fromUser ? 'bg-gray-500 text-white' : 'bg-zinc-800 text-white'}`}
                                    >
                                        <div className="text-sm">{msg.content}</div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-zinc-500 text-sm">
                            Select a group to start chatting.
                        </div>
                    )}
                </div>



                {/* Message Input */}
                {selectedGroup && (
                    <div className="mt-4 flex items-center justify-center gap-2 border-t border-zinc-800 pt-4">
                        {/* File Upload */}
                        <label htmlFor="file" className="cursor-pointer text-xl text-zinc-400 hover:text-white">
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
                )}




            </div>
        </div>
    );
};

export default ChatLayout;
