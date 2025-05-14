"use client"

import React, { useState, useEffect } from 'react';
import { chatFunc, groupFunc } from '../../store/chatStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useSocketEventStore } from '../../store/socketEvents.js'; // Import the socket event store
import Sidebar from './Sidebar.jsx';
import ChatArea from './ChatArea.jsx';
import MemberDrawer from './MemberDrawer.jsx';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';
import AddMemberModal from './AddMember.jsx';

const ChatLayout = () => {
    const getGroups = groupFunc((state) => state.getGroups);
    const createdGroups = groupFunc((state) => state.createdGroups);
    const memberGroups = groupFunc((state) => state.memberGroups);
    const createGroup = groupFunc((state) => state.createGroup);
    const deleteGroup = groupFunc((state) => state.deleteGroup);
    const addMember = groupFunc((state) => state.addMember);
    const updateMemberRole = groupFunc((state) => state.updateMemberRole);

    const authUser = useAuthStore((state) => state.authUser);
    const currentUserId = authUser?._id;

    // Socket event store actions
    const setActiveChat = useSocketEventStore((state) => state.setActiveChat);
const clearActiveChat = useSocketEventStore((state) => state.clearActiveChat);
const subscribeToEvents = useSocketEventStore((state) => state.subscribeToEvents);
const initSocketEvents = useSocketEventStore((state) => state.initSocketEvents);
const cleanup = useSocketEventStore((state) => state.cleanup);


    const sendMessage = chatFunc((state) => state.sendMessage);
    const getMessages = chatFunc((state) => state.getMessages);
    const messages = chatFunc((state) => state.messages); // Get messages from the store

    useEffect(() => {
        getGroups();
        
        // Initialize socket events when component mounts
        initSocketEvents();
        
        // Cleanup socket events when component unmounts
        return () => {
            cleanup();
        };
    }, [getGroups, initSocketEvents, cleanup]);

    const [selectedGroup, setSelectedGroup] = useState('');
    const [input, setInput] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [memberEmail, setMemberEmail] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showGroupInfo, setShowGroupInfo] = useState(false);
    const [memberRoles, setMemberRoles] = useState({});
    const [isTyping, setIsTyping] = useState(false);

    const handleCreateGroup = () => {
        if (!groupName.trim()) return;

        createGroup({ groupName });
        console.log("Create group:", groupName);

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
        const groupId = selectedGroup._id;
        addMember({ groupId, memberEmail });
    };

    const onRemoveMember = () => {
        // Implementation for removing member
    };

    const handleGroupClick = (group) => {
        // Update the selected group in the component state
        setSelectedGroup(group);
        setShowGroupInfo(false); // Reset group info visibility when changing groups
        
        // Update the chat store with the selected group
        chatFunc.getState().selectGroup(group);
        
        // Set the active chat in the socket event store
        setActiveChat('group', group._id);
        
        // Subscribe to events relevant to this group
        subscribeToEvents();
    };

    const handleSend = () => {
        if (!input.trim()) return;
        
        // Clear input for immediate UI feedback
        setInput('');
        
        // Use the store to send the message
        if (selectedGroup && selectedGroup._id) {
            chatFunc.getState().sendMessage({
                groupId: selectedGroup._id,
                text: input
            });
        } else {
            console.error("No group selected");
        }
    };

    // Handle typing status
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInput(newValue);
        
        // Emit typing status if there's input
        const currentlyTyping = newValue.length > 0;
        if (currentlyTyping !== isTyping) {
            setIsTyping(currentlyTyping);
            emitTypingStatus(currentlyTyping);
        }
    };

    // Initialize member roles when group changes
    useEffect(() => {
        if (selectedGroup?.members) {
            const roles = {};
            selectedGroup.members.forEach(member => {
                roles[member._id] = member.role || 'member';
            });
            setMemberRoles(roles);
        }
    }, [selectedGroup]);

    // Clear active chat when unmounting
    useEffect(() => {
        return () => {
            clearActiveChat();
            chatFunc.getState().clearSelectedGroup();
        };
    }, [clearActiveChat]);

    const handleRoleChange = (memberId, newRole) => {
        setMemberRoles(prev => ({
            ...prev,
            [memberId]: newRole
        }));
    };

    const saveRole = async (memberId) => {
        try {
            await updateMemberRole({
                groupId: selectedGroup._id,
                memberId,
                role: memberRoles[memberId]
            });
            // Optionally show success message
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    };

    const toggleGroupInfo = () => {
        setShowGroupInfo(!showGroupInfo);
    };

    // Get typing status from chat store
    const typingUsers = chatFunc((state) => state.isTyping);
    
    // Filter typing users to only show those in the current group
    const activeTypingUsers = Object.entries(typingUsers || {})
        .filter(([userId, isTyping]) => isTyping && userId !== currentUserId)
        .map(([userId]) => userId);

    return (
        <div className="flex h-screen w-full text-white">
            <Sidebar
                createdGroups={createdGroups}
                memberGroups={memberGroups}
                selectedGroup={selectedGroup}
                handleGroupClick={handleGroupClick}
                showInput={showInput}
                setShowInput={setShowInput}
                groupName={groupName}
                setGroupName={setGroupName}
                handleCreateGroup={handleCreateGroup}
            />
            
            <ChatArea
                selectedGroup={selectedGroup}
                messages={messages}
                currentUserId={currentUserId}
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                handleDeleteClick={handleDeleteClick}
                toggleGroupInfo={toggleGroupInfo}
                showGroupInfo={showGroupInfo}
                setShowAddMember={setShowAddMember}
                memberRoles={memberRoles}
                handleRoleChange={handleRoleChange}
                saveRole={saveRole}
                typingUsers={activeTypingUsers}
            />

            <MemberDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                members={selectedGroup?.members || []}
                onRemove={onRemoveMember}
            />

            {showConfirm && (
                <ConfirmDeleteModal
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={confirmDelete}
                />
            )}

            {showAddMember && (
                <AddMemberModal
                    memberEmail={memberEmail}
                    setMemberEmail={setMemberEmail}
                    onCancel={() => setShowAddMember(false)}
                    onAdd={handleAddMember}
                />
            )}
        </div>
    );
};

export default ChatLayout;