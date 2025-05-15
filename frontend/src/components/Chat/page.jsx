"use client"

import React, { useState, useEffect } from 'react';
import { chatFunc, groupFunc } from '../../store/chatStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useSocketEventStore } from '../../store/socketEvents.js'; 
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
    const assignRole = groupFunc((state) => state.assignRole);
    const removeUserFromGroup = groupFunc((state) => state.removeUserFromGroup);

    const authUser = useAuthStore((state) => state.authUser);
    const currentUserId = authUser?._id;

    const setActiveChat = useSocketEventStore((state) => state.setActiveChat);
    const clearActiveChat = useSocketEventStore((state) => state.clearActiveChat);
    const subscribeToEvents = useSocketEventStore((state) => state.subscribeToEvents);
    const subscribeToUserEvents = useSocketEventStore((state) => state.subscribeToUserEvents)
    const initSocketEvents = useSocketEventStore((state) => state.initSocketEvents);
    const cleanup = useSocketEventStore((state) => state.cleanup);


    const sendMessage = chatFunc((state) => state.sendMessage);
    const getMessages = chatFunc((state) => state.getMessages);
    const messages = chatFunc((state) => state.messages); 

    useEffect(() => {
        getGroups();

        initSocketEvents();

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
   

    const handleCreateGroup = () => {
  if (!groupName.trim()) return;

  
  createGroup({ groupName }, () => {
    
    getGroups();
    
    cleanup();
    initSocketEvents();
  });
  
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
        subscribeToUserEvents({ groupId, userId: currentUserId })
    };

    const onRemoveMember = () => {
        const userId = currentUserId;
        const groupId = selectedGroup._id;
        removeUserFromGroup({ groupId, userId, memberEmail });
    };

    const handleGroupClick = (group) => {
        
        setSelectedGroup(group);
        setShowGroupInfo(false); 

        chatFunc.getState().selectGroup(group);

        setActiveChat('group', group._id);

        subscribeToEvents();
    };

    const handleSend = () => {
        if (!input.trim()) return;

        setInput('');

        if (selectedGroup && selectedGroup._id) {
            chatFunc.getState().sendMessage({
                groupId: selectedGroup._id,
                text: input
            });
        } else {
            console.error("No group selected");
        }
    };

    useEffect(() => {
        if (selectedGroup?.members) {
            const roles = {};
            selectedGroup.members.forEach(member => {
                roles[member._id] = member.role || 'member';
            });
            setMemberRoles(roles);
        }
    }, [selectedGroup]);

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
        
        await assignRole({
            groupId: selectedGroup._id,
            memberId,
            role: memberRoles[memberId]
        });
        
    };

    const toggleGroupInfo = () => {
        setShowGroupInfo(!showGroupInfo);
    };

    return (
        <div className="flex h-full w-full text-white">
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
                onRemoveMember={onRemoveMember}
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