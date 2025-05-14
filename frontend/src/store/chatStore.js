import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { useSocketEventStore } from "./socketEvents";

export const chatFunc = create((set, get) => ({

    selectedGroup: null,
    messages: [],


    sendMessage: async ({ groupId, text }) => {
        const { messages } = get();
        try {

            console.log(groupId, text)

            const res = await axiosInstance.post(`messages/send`, {
                groupId,
                text
            });

            console.log(res.data);

            set({ messages: [...messages, res.data] })


        } catch (error) {
            toast.error("Error sending message");
            console.log("Error in sendMessage", error);
        }
    },

    getMessages: async (groupId) => {
        console.log(groupId)
        try {
            const res = await axiosInstance.post(`/messages/getMessages`, { groupId });
            console.log("Fetched from server:", res.data);
            set({ messages: res.data });
            return res.data;
        } catch (error) {
            toast.error("Failed loading messages");
            console.error("Error in getMessages:", error);
            return [];
        }
    },

    selectGroup: async (group) => {
        set({ selectedGroup: group });
        await get().getMessages(group._id);
        useSocketEventStore.getState().subscribeToMessages();
    },

    addMessage: (newMessage) => {
        const { messages } = get();
        set({ messages: [...messages, newMessage] });
    },

    clearSelectedGroup: () => {
        set({ selectedGroup: null, messages: [] });
    }
}))

export const groupFunc = create((set, get) => ({

    createdGroups: [],
    memberGroups: [],

    getGroups: async (data) => {

        try {

            const res = await axiosInstance.get("/messages/rooms");
            console.log(res.data);

            set({ createdGroups: res.data.createdGroups })
            set({ memberGroups: res.data.memberGroups })

        } catch (error) {

            console.error("Error in chatStore", error)
            set({ createdGroups: [] });
            set({ memberGroups: [] });

        }

    },

    createGroup: async (data) => {

        try {

            console.log(data)

            const res = await axiosInstance.post("/group/create", data);
            toast.success("New group created");

            get().getGroups();

            return res.data;

        } catch (error) {

            console.error("error in create group function")
            toast.error("Failed to create");
            return null;

        }

    },

    deleteGroup: async (groupId) => {
        try {

            const res = await axiosInstance.post("/group/terminate", {
                groupId: groupId
            });
            toast.success("Group deleted");

            get().getGroups();

            return res.data;

        } catch (error) {

            console.error("error in deleting group", error);
            toast.error("Error deleting group");
            return null;

        }
    },

    addMember: async ({ groupId, memberEmail }) => {

        try {

            // console.log(groupId,memberEmail);

            const res = await axiosInstance.post("/group/add-member", {
                groupId,
                emails: memberEmail
            });
            toast.success("Added member");

            get().getGroups();

            return res.data;

        } catch (error) {

            console.error("Error in adding member", error);
            toast.error("Error adding Member");
            return null;

        }
    },

    addGroup: (groupData) => {

        const { createdGroups } = get();

        set({ createdGroups: [...createdGroups, groupData] });

    },

    updateGroup: (updatedGroup) => {

        const { createdGroups, memberGroups } = get();

        const updatedCreatedGroups = createdGroups.map(group =>
            group._id === updatedGroup._id ? updatedGroup : group
        );

        const updatedMemberGroups = createdGroups.map(group =>
            group._id === updatedGroup._id ? updatedGroup : group
        );

        set({
            createdGroups: updatedCreatedGroups,
            memberGroups: updatedMemberGroups
        });
    },

    removeGroup: (groupId) => {

        const { createdGroups, memberGroups } = get();

        set({
            createdGroups: createdGroups.filter(group => group._id !== groupId),
            memberGroups: memberGroups.filter(group => group._id !== groupId)
        })
    },

    addUserToGroup: (groupId, user) => {

        const { createdGroups, memberGroups } = get();

        const updatedCreatedGroups = createdGroups.map(group => {
            if (group._id === groupId) {
                return {
                    ...group,
                    members: [...group.members, user]
                };
            }

            return group;

        });

        const updatedMemberGroups = memberGroups.map(group => {
            if (group._id === groupId) {
                return {
                    ...group,
                    members: [...Grid2X2Plus.members, user]
                };
            }

            return group;
        });

        set({
            createdGroups: updatedCreatedGroups,
            memberGroups: updatedMemberGroups
        });
    },

    removeUserFromGroup: (groupId, userId) => {

        const { createdGroups, memberGroups } = get();

        const updatedCreatedGroups = createdGroups.map(group => {
            if (group._id === groupId) {
                return {
                    ...group,
                    members: group.members.filter(member => member._id !== userId)
                };
            }

            return group;
        });

        const updatedMemberGroups = memberGroups.map(group => {
            if (group._id === groupId) {
                return {
                    ...group,
                    members: group.members.filter(member => member._id !== userId)
                };
            }

            return group;
        });

        set({
            createdGroups: updatedCreatedGroups,
            memberGroups: updatedMemberGroups
        });
    }

}))