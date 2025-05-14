"use client"

import React, { useState, useEffect } from 'react';
import { chatFunc, groupFunc } from '../../store/chatStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
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

    const sendMessage = chatFunc((state) => state.sendMessage);
    const getMessages = chatFunc((state) => state.getMessages);

    useEffect(() => {
        getGroups();
    }, [getGroups]);

    const [selectedGroup, setSelectedGroup] = useState('');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [memberEmail, setMemberEmail] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showGroupInfo, setShowGroupInfo] = useState(false);
    const [memberRoles, setMemberRoles] = useState({});

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
        const groupId = selectedGroup._id;
        addMember({ groupId, memberEmail });
    };

    const onRemoveMember = () => {
        // Implementation for removing member
    };

    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        setShowGroupInfo(false); // Reset group info visibility when changing groups
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = { sender: 'You', content: input, fromUser: true };
        const updated = [...messages, newMsg];
        setMessages(updated);
        setInput('');

        const groupId = selectedGroup._id;
        sendMessage({ groupId, text: input });
    };

    useEffect(() => {
        if (!selectedGroup?._id) return;

        const fetchMessages = async () => {
            try {
                const msgs = await getMessages(selectedGroup._id);
                console.log("Fetched messages:", msgs);
                setMessages(msgs || []);
            } catch (err) {
                console.error("Failed to fetch messages:", err);
            }
        };

        fetchMessages();
    }, [selectedGroup]);

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