import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { chatFunc, groupFunc } from "./chatStore";

export const useSocketEventStore = create((set, get) => ({

    activeGroupId: null,
    activeUserId: null,
    notifications: [],
    hasUnreadNotification: false,

    setActiveChat: (type, id) => {
        if (type === 'group') {
            set({
                activeGroupId: id, activeUserId: null
            });
        } else if (type === 'user') {
            set({
                activeUserId: id, activeGroupId: null
            });
        }
    },

    clearActiveChat: () => {
        set({ activeGroupId: null, activeUserId: null })
    },

    subscribeToEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        get().unsubscribeFromEvents();
        get().subscribeToMessages();
        get().subscribeToGroupEvents();
        get().subscribeToUserEvents();
    },

    unsubscribeFromEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        get().unsubscribeFromMessages();
        get().unsubscribeFromGroupEvents();
        get().unsubscribeFromUserEvents();
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        // Always remove previous listener to avoid duplicates
        socket.off('newMessage');

        socket.on('newMessage', (newMessage) => {
            const { activeGroupId } = get();
            if (activeGroupId && newMessage.groupId === activeGroupId) {
                chatFunc.getState().addMessage(newMessage);
            } else {
                get().addNotification({
                    type: 'message',
                    text: `New message in group: ${newMessage.groupName || newMessage.groupId}`,
                    time: new Date().toISOString(),
                });
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
    },

    subscribeToGroupEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        // Remove existing listeners first
        socket.off("newGroupCreated");
        socket.off("groupUpdated");
        socket.off("groupDeleted");

        socket.on("newGroupCreated", (groupData) => {
            console.log("New group created:", groupData);
            groupFunc.getState().addGroup(groupData);
        });

        socket.on("groupUpdated", (updatedGroup) => {
            console.log("Group updated:", updatedGroup);
            groupFunc.getState().updateGroup(updatedGroup);
        });

        socket.on("groupDeleted", (data) => {
            console.log("Group deleted:", data);
            const groupId = data.groupId || data;
            groupFunc.getState().removeGroup(groupId);

            if (get().activeGroupId === groupId) {
                get().clearActiveChat();
                chatFunc.getState().clearSelectedGroup();
            }
        });
    },

    unsubscribeFromGroupEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newGroupCreated");
        socket.off("groupUpdated");
        socket.off("groupDeleted");
    },

    subscribeToUserEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
        console.log("❌ No socket available for user events");
        return;
    }

    console.log("🔄 Subscribing to user events...");

    // Remove existing listeners first
    socket.off('userAddedToGroup');
    socket.off("userRemovedFromGroup");
    socket.off("roleUpdated");

    socket.on('userAddedToGroup', ({ groupId, user }) => {
        console.log("✅ RECEIVED userAddedToGroup:", { groupId, user });
        groupFunc.getState().addUserToGroup(groupId, user);
    });

    socket.on("userRemovedFromGroup", ({ groupId, userId }) => {
        console.log("✅ RECEIVED userRemovedFromGroup:", { groupId, userId });
        groupFunc.getState().removeUserFromGroup(groupId, userId);

        // Check if current user was removed
        const currentUser = useAuthStore.getState().user;
        if (userId === currentUser?._id) {
            console.log("🚨 Current user was removed from group");
            if (get().activeGroupId === groupId) {
                get().clearActiveChat();
                chatFunc.getState().clearSelectedGroup();
            }
        }
    });

    socket.on("roleUpdated", ({ groupId, memberId, role, updatedMember }) => {
        console.log("✅ RECEIVED roleUpdated:", { groupId, memberId, role, updatedMember });
        groupFunc.getState().updateMemberRole(groupId, memberId, role);
    });

    console.log("✅ User events subscribed successfully");
},

    unsubscribeFromUserEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("userAddedToGroup");
        socket.off("userRemovedFromGroup");
        socket.off("roleUpdated"); // ADD THIS
    },

    initSocketEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("connect", () => {
            console.log("Socket connected");
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        get().subscribeToEvents();
    },

    cleanup: () => {
        get().unsubscribeFromEvents();

        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("connect");
            socket.off("disconnect");
        }
    },

    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        hasUnreadNotification: true,
    })),
    
    clearNotifications: () => set({ hasUnreadNotification: false }),

    testSocketConnection: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
        console.log("❌ No socket connection");
        return false;
    }
    
    console.log("🔍 Socket connected:", socket.connected);
    console.log("🔍 Socket ID:", socket.id);
    
    // Test emit
    socket.emit('test', 'Hello from frontend');
    
    return socket.connected;
}
}))