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

    // subscribeToMessages: () => {

    //     const { activeGroupId } = get();
    //     const socket = useAuthStore.getState().socket;
    //     if (!socket) return;

    //     socket.on('newMessage', (newMessage) => {
    //         if (activeGroupId && newMessage.groupId === activeGroupId) {
    //             chatFunc.getState().addMessage(newMessage);
    //         }
    //     })
    // },

    unsubscribeFromMessages: () => {

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");

    },

    subscribeToGroupEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newGroupCreated", (groupData) => {
            groupFunc.getState().addGroup(groupData);
        });

        socket.on("groupUpdated", (updatedGroup) => {
            groupFunc.getState().updateGroup(updatedGroup);
        });

        socket.on("groupDeleted", (groupId) => {
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
        if (!socket) return;

        socket.on('userAddedToGroup', ({ groupId, user }) => {
            groupFunc.getState().addUserToGroup(groupId, user);
        });

        socket.on("userRemovedFromGroup", ({ groupId, userId }) => {
            groupFunc.getState().removeUserFromGroup(groupId, userId);

            if (userId === useAuthStore.getState().user?._id) {
                if (get().activeGroupId === groupId) {
                    get().clearActiveChat();
                    chatFunc.getState().clearSelectedGroup();
                }
            }
        });

        //user Role change code to written here !!!

    },

    unsubscribeFromUserEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("userAddedToGroup");
        socket.off("userRemovedFromGroup");

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

}))