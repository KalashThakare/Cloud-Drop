import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const chatFunc = create((set,get) =>({

    Groups:[],

    getGroups:async(data)=>{

        try {

            const res = await axiosInstance.get("/messages/rooms");
            console.log(res.data);

            set({Groups:res.data})
            
        } catch (error) {
            
        }

    },

    sendMessage:async(data)=>{
        try {

            const res = await axiosInstance.post()
            


        } catch (error) {
            
        }
    }

}))