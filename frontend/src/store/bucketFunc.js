import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const bucketFunc = create((set,get)=>({

    bucket:null,
    fetchedBuckets:[],
    selectedBucket:null,
    generatedUrl:(''),

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
            set({fetchedBuckets:res.data.buckets || []})
        } catch (error) {
            console.log(error.message);
            set({fetchedBuckets:[]});
        }
    },

    connectBucket:async(data)=>{
        try {
            const res = await axiosInstance.post("/aws/connect",data);
            set({bucket:res.data});
            set({selectedBucket:res.data});
            toast.success('Bucket connected');
        } catch (error) {
            set({bucket:null});
            set({selectedBucket:null});
            toast.error('Connection failed');
        }
    },

    deleteBucket:async(data)=>{
        try {
            const res = await axiosInstance.post("/aws/delete",data);
            set({bucket:res.data});
            toast.success("Bucket deleted");
        } catch (error) {
            console.log("bucket delete error",error);
            toast.error("Error deleting bucket");
            set({bucket:null});

        }
    },

    generateUrl:async(data)=>{
        try {
            const res = await axiosInstance.post("/func/signedurl",data);
            set({generatedUrl:res.data});
        } catch (error) {
            console.log(error);
            toast.error('error generating signed Url');
        }finally{
            set({generatedUrl:''});
        }
    }
}))