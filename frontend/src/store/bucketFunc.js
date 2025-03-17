import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const bucketFunc = create((set,get)=>({

    bucket:null,
    fetchedBuckets:[],

    addBucket:async(data)=>{
        try {
            const res = await axiosInstance.post("/aws/config",data)
            set({bucket:res.data});
            toast.success('Bucket added');
        } catch (error) {
            console.log(error);
            toast.error('Server error try again');
            set({bucket:null});
        }
    },

    fetchBucket:async()=>{
        try {
            const res=await axiosInstance.get("/aws/buckets");
            console.log(res.data);
            set({fetchedBuckets:res.data.buckets})
        } catch (error) {
            console.log(error.message);
            set({fetchedBuckets:[]});
        }
    }
}))