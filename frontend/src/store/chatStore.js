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
      const msg =
        error?.response?.data?.error || error?.response?.data?.message;
      if (status === 400) {
        toast.warning(getErrorMessage(error, msg || "Invalid message data"));
      } else if (status === 404) {
        toast.warning(
          getErrorMessage(error, msg || "Sender is not a member of the group")
        );
      } else {
        toast.error(getErrorMessage(error, "Failed to send message"));
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
      const msg =
        error?.response?.data?.error || error?.response?.data?.message;
      if (status === 404) {
        toast.warning(getErrorMessage(error, msg || "No messages found"));
      } else {
        toast.error(getErrorMessage(error, "Failed loading messages"));
      }
      return [];
    }
  },

  selectGroup: async (group) => {
    set({ selectedGroup: group });
    try {
      await get().getMessages(group._id);
    } catch (error) {
      // getMessages already handles toast
    }
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

  getGroups: async () => {
    try {
      const res = await axiosInstance.get("/messages/rooms");
      set({ createdGroups: res.data.createdGroups });
      set({ memberGroups: res.data.memberGroups });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to fetch groups"));
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
      const msg = error?.response?.data?.message;
      if (status === 400) {
        toast.warning(getErrorMessage(error, msg || "Group name is required"));
      } else if (status === 500) {
        toast.error(getErrorMessage(error, "Internal server error"));
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
      const msg = error?.response?.data?.message;
      if (status === 404) {
        toast.warning(
          getErrorMessage(
            error,
            "Only group admin can terminate the group or group not found"
          )
        );
      } else if (status === 500) {
        toast.error(getErrorMessage(error, "Internal server error"));
      } else {
        toast.error(getErrorMessage(error, "Failed to delete group"));
      }
    }
  },

  addMember: async ({ groupId, memberEmail }) => {
    try {
      const res = await axiosInstance.post("/group/add-member", {
        groupId,
        emails: memberEmail,
      });
      const { addedCount, skipped } = res.data;
      if (addedCount > 0) {
        toast.success(`Added ${addedCount} member(s)`);
      }
      if (skipped && skipped.length > 0) {
        toast.warning(skipped.map((s) => `${s.email}: ${s.reason}`).join(", "));
      }
      get().getGroups();
    } catch (error) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message;
      if (status === 400) {
        toast.warning(getErrorMessage(error, msg || "Invalid member email(s)"));
      } else if (status === 404) {
        toast.warning(getErrorMessage(error, msg || "Group not found"));
      } else if (status === 500) {
        toast.error(getErrorMessage(error, "Server error"));
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
    const updatedMemberGroups = memberGroups.map((group) =>
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
          members: [...group.members, user],
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
      const res = await axiosInstance.post(`/group/remove-member`, {
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
      const msg = error?.response?.data?.message;
      if (status === 400) {
        toast.warning(
          getErrorMessage(error, msg || "Please provide member Id")
        );
      } else if (status === 403) {
        toast.warning(
          getErrorMessage(error, msg || "You cannot remove yourself")
        );
      } else if (status === 404) {
        toast.warning(
          getErrorMessage(error, msg || "Group or member not found")
        );
      } else if (status === 500) {
        toast.error(getErrorMessage(error, "Server error"));
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

      toast.success("Role assigned successfully!");

    } catch (error) {
      const status = error?.response?.status;
      const msg =
        error?.response?.data?.message || error?.response?.data?.error;
      if (status === 403) {
        toast.warning(
          getErrorMessage(
            error,
            msg || "You don't have permission to assign roles"
          )
        );
      } else if (status === 404) {
        toast.warning(
          getErrorMessage(error, msg || "Required field missing or not found")
        );
      } else if (status === 500) {
        toast.error(
          getErrorMessage(error, "An error occurred while assigning the role")
        );
      } else {
        toast.error(getErrorMessage(error, "Internal server error"));
      }
    }
  },

  updateMemberRole: (groupId, memberId, newRole) => {
    set((state) => ({
      createdGroups: state.createdGroups.map(group =>
        group._id === groupId
          ? {
            ...group,
            members: group.members.map(member =>
              member._id === memberId
                ? { ...member, role: newRole }
                : member
            )
          }
          : group
      ),
      memberGroups: state.memberGroups.map(group =>
        group._id === groupId
          ? {
            ...group,
            members: group.members.map(member =>
              member._id === memberId
                ? { ...member, role: newRole }
                : member
            )
          }
          : group
      ),
    }));
  }
}));
