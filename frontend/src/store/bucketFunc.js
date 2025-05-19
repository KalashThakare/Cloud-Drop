import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const bucketFunc = create((set,get)=>({

    bucket:null,
    fetchedBuckets:[],
    selectedBucket:(''),
    generatedUrl:(''),
    usersBucket:{},
    cloudFormationTemplateUrl:(''),

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

    connectPlatformBucket:async()=>{
        try {
            const res = await axiosInstance.post("/use-platform-bucket/s3client");
            console.log("data",res.data)
            console.log("bucketName=",res.data.bucketName)
            set({bucket:res.data.bucketName});
            set({selectedBucket:res.data.bucketName});
    
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

    generateDefaultBucketUrl:async(fileName,expiration,userId)=>{
        try {

            const bucketName = get().selectedBucket; 

            if (!bucketName) {
                toast.error("No bucket selected. Please connect a bucket first.");
                return;
            }
            const res = await axiosInstance.post("/use-platform-bucket/getUrl",{
                fileName,
                expiration,
                bucketName,
                userId
            });

            set({generatedUrl:res.data});

            
        } catch (error) {

            const status = error?.response?.status
            const message = error?.response?.data?.error

            if(status === 404){
                toast.warning("No such file found. Please try uploading again.")
            }else{
                toast.error("Internal server error")
            }
        }
    },

    generateUserBucketUrl:async(fileName,expiration)=>{
        try {

            const bucketName = get().selectedBucket; 

            if (!bucketName) {
                toast.error("No bucket selected. Please connect a bucket first.");
                return;
            }
            const res = await axiosInstance.post("/func/signedurl",{
                fileName,
                expiration,
                bucketName
            });

            set({generatedUrl:res.data});

            
        } catch (error) {
            console.log(error);
            toast.error('error generating signed Url');
        }
    },

    sendMail:async(fileName,expiration,recipient)=>{
        try {

            const bucketName = get().selectedBucket; 

            console.log(bucketName)

            if (!bucketName) {
                toast.error("No bucket selected. Please connect a bucket first.");
                return;
            }

            if(!fileName || !expiration || !recipient){
                toast.error("Some fields look empty")
            }
            const res = await axiosInstance.post("/use-platform-bucket/sendMail/req-access",{fileName,expiration,recipient,bucketName});

            toast.success("mail sent successfully")

        } catch (error) {
            console.log(error);
            toast.error("error sending mail");
        }
    },

   userBucket:async(data)=>{
    try {
        const response = await axiosInstance.post("/userBucket", {
          data
        });
        set({usersBucket:response.data})
        toast.success("Bucket connected successfully");
        console.log("Response from backend:", response.data);
      } catch (error) {
        toast.error("Failed to connect bucket");
        console.error(error);
      }
    },

    getCloudformationSignedUrl:async()=>{
        try {
            const res = await axiosInstance.get("/start-user-bucket-session/cloudformationScript");
            console.log(res.data);
            set({cloudFormationTemplateUrl:res.data});
        } catch (error) {
            toast.error("Failed to generate Url");
            console.error(error);
        }
    },
}))