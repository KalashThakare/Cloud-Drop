import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const chatFunc = create((set,get) =>({

    

    sendMessage:async(data)=>{
        try {

            const res = await axiosInstance.post()
            


        } catch (error) {
            
        }
    }

}))

export const groupFunc = create((set,get)=>({

    createdGroups:[],
    memberGroups:[],

    getGroups:async(data)=>{

        try {

            const res = await axiosInstance.get("/messages/rooms");
            console.log(res.data);

            set({createdGroups:res.data.createdGroups})
            set({memberGroups:res.data.memberGroups})
            
        } catch (error) {

            console.error("Error in chatStore",error)
            set({createdGroups:[]});
            set({memberGroups:[]});
            
        }

    },

    createGroup:async(data)=>{

        try {

            console.log(data)

            const res = await axiosInstance.post("/group/create",data);
            toast.success("New group created");
            
        } catch (error) {
  
            console.error("error in create group function")
            toast.error("Failed to create");

        }

    },

    deleteGroup:async(groupId)=>{
        try {

            const res = await axiosInstance.post("/group/terminate",{
                groupId: groupId
              });
            toast.success("Group deleted");

        } catch (error) {

            console.error("error in deleting group",error);
            toast.error("Error deleting group");
            
        }
    }

}))