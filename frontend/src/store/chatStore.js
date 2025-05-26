import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { getErrorMessage } from "@/lib/errorUtils";

export const chatFunc = create((set, get) => ({
  selectedGroup: null,
  messages: [],

  sendMessage: async ({ groupId, text }) => {
    const { messages } = get();
    try {
      const res = await axiosInstance.post(`messages/send`, {
        groupId,
        text,
      });

      set({ messages: [...messages, res.data] });
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400 || status === 404) {
        toast.warning(getErrorMessage(error, "Error sending message"));
      } else {
        toast.error(getErrorMessage(error, "Error sending message"));
      }
    }
  },

  getMessages: async (groupId) => {
    try {
      const res = await axiosInstance.post(`/messages/getMessages`, {
        groupId,
      });
      set({ messages: res.data });
      return res.data;
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        toast.warning(getErrorMessage(error, "No messages found"));
      } else {
        toast.error(getErrorMessage(error, "Failed loading messages"));
      }
      return [];
    }
  },

  selectGroup: async (group) => {
    set({ selectedGroup: group });
    await get().getMessages(group._id);
  },

  addMessage: (newMessage) => {
    const { messages } = get();
    set({ messages: [...messages, newMessage] });
  },

  clearSelectedGroup: () => {
    set({ selectedGroup: null, messages: [] });
  },
}));

export const groupFunc = create((set, get) => ({
  createdGroups: [],
  memberGroups: [],

  getGroups: async (data) => {
    try {
      const res = await axiosInstance.get("/messages/rooms");
      console.log(res.data);

      set({ createdGroups: res.data.createdGroups });
      set({ memberGroups: res.data.memberGroups });
    } catch (error) {
      console.error("Error in chatStore", error);
      set({ createdGroups: [] });
      set({ memberGroups: [] });
    }
  },

  createGroup: async (data) => {
    try {
      const res = await axiosInstance.post("/group/create", data);
      toast.success("New group created");

      get().getGroups();

      return res.data;
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400) {
        toast.warning(getErrorMessage(error, "Failed to create group"));
      } else {
        toast.error(getErrorMessage(error, "Failed to create group"));
      }
      return null;
    }
  },

  deleteGroup: async (groupId) => {
    try {
      const res = await axiosInstance.post("/group/terminate", {
        groupId: groupId,
      });
      toast.success("Group deleted");

      get().getGroups();

      return res.data;
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        toast.warning(
          getErrorMessage(
            error,
            "You don't have permission to delete the group"
          )
        );
      } else {
        toast.error(getErrorMessage(error, "Internal server error"));
      }
    }
  },

  addMember: async ({ groupId, memberEmail }) => {
    try {
      await axiosInstance.post("/group/add-member", {
        groupId,
        emails: memberEmail,
      });
      toast.success("Added member");

      get().getGroups();
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400) {
        toast.warning(getErrorMessage(error, "Error adding member"));
      } else {
        toast.error(getErrorMessage(error, "Error adding member"));
      }
    }
  },

  addGroup: (groupData) => {
    const { createdGroups } = get();

    set({ createdGroups: [...createdGroups, groupData] });
  },

  updateGroup: (updatedGroup) => {
    const { createdGroups, memberGroups } = get();

    const updatedCreatedGroups = createdGroups.map((group) =>
      group._id === updatedGroup._id ? updatedGroup : group
    );

    const updatedMemberGroups = createdGroups.map((group) =>
      group._id === updatedGroup._id ? updatedGroup : group
    );

    set({
      createdGroups: updatedCreatedGroups,
      memberGroups: updatedMemberGroups,
    });
  },

  removeGroup: (groupId) => {
    const { createdGroups, memberGroups } = get();

    set({
      createdGroups: createdGroups.filter((group) => group._id !== groupId),
      memberGroups: memberGroups.filter((group) => group._id !== groupId),
    });
  },

  addUserToGroup: (groupId, user) => {
    const { createdGroups, memberGroups } = get();

    const updatedCreatedGroups = createdGroups.map((group) => {
      if (group._id === groupId) {
        return {
          ...group,
          members: [...group.members, user],
        };
      }

      return group;
    });

    const updatedMemberGroups = memberGroups.map((group) => {
      if (group._id === groupId) {
        return {
          ...group,
          members: [...Grid2X2Plus.members, user],
        };
      }

      return group;
    });

    set({
      createdGroups: updatedCreatedGroups,
      memberGroups: updatedMemberGroups,
    });
  },

  removeUserFromGroup: async ({ groupId, memberId }) => {
    try {
      await axiosInstance.post(`/group/remove-member`, {
        groupId,
        memberId,
      });

      toast.success("User removed from group");
      const { createdGroups, memberGroups } = get();

      const updatedCreatedGroups = createdGroups.map((group) => {
        if (group._id === groupId) {
          return {
            ...group,
            members: group.members.filter((member) => member._id !== memberId),
          };
        }

        return group;
      });

      const updatedMemberGroups = memberGroups.map((group) => {
        if (group._id === groupId) {
          return {
            ...group,
            members: group.members.filter((member) => member._id !== memberId),
          };
        }

        return group;
      });

      set({
        createdGroups: updatedCreatedGroups,
        memberGroups: updatedMemberGroups,
      });
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400 || status === 404) {
        toast.warning(getErrorMessage(error, "Error removing user"));
      } else {
        toast.error(getErrorMessage(error, "Error removing user"));
      }
    }
  },

  assignRole: async ({ groupId, memberId, role }) => {
    try {
      const res = await axiosInstance.post("/group/roles", {
        groupId,
        memberId,
        role,
      });

      toast.success("Role assigned");
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.error;

      if (status === 403) {
        toast.warning(
          getErrorMessage(error, "You don't have permission to assign roles")
        );
      } else {
        toast.error(getErrorMessage(error, "Internal server error"));
      }
    }
  },
}));
