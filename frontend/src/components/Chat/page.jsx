"use client";

import React, { useState, useEffect } from "react";
import { chatFunc, groupFunc } from "../../store/chatStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useSocketEventStore } from "../../store/socketEvents.js";
import Sidebar from "./Sidebar.jsx";
import ChatArea from "./ChatArea.jsx";
import MemberDrawer from "./MemberDrawer.jsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.jsx";
import AddMemberModal from "./AddMember.jsx";
import { useSearchParams } from "next/navigation";
import { bucketFunc } from "@/store/bucketFunc.js";
import { toast } from "sonner";
import { debounce } from "lodash";

const ChatLayout = () => {
  const searchParams = useSearchParams();
  const useDefault = searchParams.get("useDefault") === "true";

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
  const subscribeToEvents = useSocketEventStore(
    (state) => state.subscribeToEvents
  );
  const subscribeToUserEvents = useSocketEventStore(
    (state) => state.subscribeToUserEvents
  );
  const initSocketEvents = useSocketEventStore(
    (state) => state.initSocketEvents
  );
  const cleanup = useSocketEventStore((state) => state.cleanup);

  const sendMessage = chatFunc((state) => state.sendMessage);
  const getMessages = chatFunc((state) => state.getMessages);
  const messages = chatFunc((state) => state.messages);

  const generateDefaultBucketUrl = bucketFunc(
    (state) => state.generateDefaultBucketUrl
  );
  const generatedUrl = bucketFunc((state) => state.generatedUrl);

  useEffect(() => {
    getGroups();
    initSocketEvents();

    return () => {
      cleanup();
    };
  }, [getGroups, initSocketEvents, cleanup]);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
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

    setGroupName("");
    setShowInput(false);
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    // console.log(selectedGroup._id);
    deleteGroup(selectedGroup._id);
    setShowConfirm(false);
  };

  const handleAddMember = () => {
    const groupId = selectedGroup._id;
    addMember({ groupId, memberEmail });
    subscribeToUserEvents({ groupId, userId: currentUserId });
  };

  const onRemoveMember = debounce((member) => {
    const groupId = selectedGroup._id;
    const memberId = member.userId;
    removeUserFromGroup({ groupId, memberId });
  }, 300);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setShowGroupInfo(false);

    chatFunc.getState().selectGroup(group);
    setActiveChat("group", group._id);
    subscribeToEvents();

    // Join the group room for real-time updates
    const socket = useSocketEventStore.getState().socket;
    if (socket) {
      socket.emit("joinGroup", group._id);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) {
      toast.warning("Please enter a message");
      return;
    }
    
    if (input.startsWith("/signedUrl") || input.startsWith("/signedurl") || 
        input.startsWith("/SignedUrl") || input.startsWith("/signedURL") || 
        input.startsWith("/SIGNEDURL")) {
      handleSignedUrlCommand(input);
    } else {
      setInput("");
      if (selectedGroup && selectedGroup._id) {
        await chatFunc.getState().sendMessage({
          groupId: selectedGroup._id,
          text: input,
        });
      }
    }
  };

  const handleSignedUrlCommand = async (input) => {
    try {
      const parts = input.split(" ").filter((part) => part.trim());

      if (parts.length < 2) {
        sendMessage({
          groupId: selectedGroup._id,
          text: "Usage: /signedUrl filename [expiration in minutes]",
        });
        return;
      }

      const fileName = parts[1];
      const expiration = parts[2] ? parseInt(parts[2]) : 60;
      let urlData = null;

      if (useDefault === true) {
        urlData = await generateDefaultBucketUrl({
          fileName,
          expiration,
          userId: currentUserId,
        });
      }

      if (urlData && urlData.Url) {
        await sendMessage({
          groupId: selectedGroup._id,
          text: `Signed URL for ${fileName} (expires in ${expiration} minutes): ${urlData.Url}`,
        });
      } else {
        await sendMessage({
          groupId: selectedGroup._id,
          text: `Failed to generate signed URL for ${fileName}. Please try again.`,
        });
      }

      // console.log(generatedUrl);
      setInput("");
    } catch (error) {
      console.error("Error generating signed URL:", error);
      sendMessage({
        groupId: selectedGroup._id,
        text: `Error generating signed URL: ${error.message}`,
      });
    }
  };

  // Initialize member roles when selectedGroup changes
  useEffect(() => {
    if (selectedGroup?.members) {
      const roles = {};
      selectedGroup.members.forEach((member) => {
        roles[member._id] = member.role || "";
      });
      // console.log("Initial roles:", roles);
      setMemberRoles(roles);
    }
  }, [selectedGroup]);

  // Add socket event listener for role updates
  useEffect(() => {
    const socket = useSocketEventStore.getState().socket;
    
    if (socket) {
      const handleRoleUpdate = (data) => {
        // console.log("Received role update:", data);
        
        // Update local state
        setMemberRoles(prev => ({
          ...prev,
          [data.memberId]: data.role
        }));

        // Update selectedGroup if it matches
        if (selectedGroup && selectedGroup._id === data.groupId) {
          setSelectedGroup(prevGroup => ({
            ...prevGroup,
            members: prevGroup.members.map(member => 
              member._id === data.memberId 
                ? { ...member, role: data.role }
                : member
            )
          }));
        }

        // Refresh groups to get updated data
        getGroups();
      };

      socket.on("roleUpdated", handleRoleUpdate);

      return () => {
        socket.off("roleUpdated", handleRoleUpdate);
      };
    }
  }, [selectedGroup, getGroups]);

  useEffect(() => {
    return () => {
      clearActiveChat();
      chatFunc.getState().clearSelectedGroup();
    };
  }, [clearActiveChat]);

  const handleRoleChange = (memberId, newRole) => {
    setMemberRoles((prev) => ({
      ...prev,
      [memberId]: newRole,
    }));
  };

  const saveRole = async (memberId) => {
    try {
      await assignRole({
        groupId: selectedGroup._id,
        memberId,
        role: memberRoles[memberId],
      });

      // Emit socket event for real-time update
      const socket = useSocketEventStore.getState().socket;
      if (socket) {
        socket.emit("roleUpdated", {
          groupId: selectedGroup._id,
          memberId,
          role: memberRoles[memberId]
        });
      }

    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error("Failed to assign role");
    }
  };

  const toggleGroupInfo = () => {
    setShowGroupInfo(!showGroupInfo);
  };

  useEffect(() => {
    // Test socket connection
    const testConnection = useSocketEventStore.getState().testSocketConnection;
    testConnection();
    
    getGroups();
    initSocketEvents();
    
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="flex md:h-full h-[96vh] w-full text-white">
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