import { axiosInstance } from "@/lib/axios";
import {create} from "zustand";


export const fileManagementStore = create((set,get)=>({

    files:[],
    fileStats:null,

    getUserFiles:async(userId)=>{
        try {
            
            const res = await axiosInstance.post("/files/getFiles",userId);
            const data = res.data;

            set({files:data.uploadedFiles});

        } catch (error) {

            set({files:[]});
            console.log("error in fetching files store",error);
            
        }
    },

    getFileStats:async(userId)=>{
        try {

            const res = await axiosInstance.post("/files/getUserFileStats",userId);
            const data = res.data; 

            set({fileStats:data});

        } catch (error) {

            set({fileStats:null});
            console.log("error fetching file stats",error);
            
        }
    },

    removeFiles:{

    }


}))