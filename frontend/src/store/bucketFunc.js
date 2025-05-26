import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { getErrorMessage } from "@/lib/errorUtils";

export const bucketFunc = create((set, get) => ({
  bucket: null,
  fetchedBuckets: [],
  selectedBucket: "",
  generatedUrl: null,
  usersBucket: {},
  cloudFormationTemplateUrl: "",

  addBucket: async (data) => {
    try {
      const res = await axiosInstance.post("/aws/config", data);
      set({ bucket: res.data });
      toast.success("Bucket added");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400) {
        toast.warning(getErrorMessage(error, "Failed to add bucket"));
      } else {
        toast.error(getErrorMessage(error, "Server error, try again"));
      }
      set({ bucket: null });
    }
  },

  fetchBucket: async () => {
    try {
      const res = await axiosInstance.get("/aws/buckets");
      console.log(res.data);
      set({ fetchedBuckets: res.data.buckets || [] });
    } catch (error) {
      console.log(error.message);
      set({ fetchedBuckets: [] });
    }
  },

  connectPlatformBucket: async () => {
    try {
      const res = await axiosInstance.post("/use-platform-bucket/s3client");
      console.log("data", res.data);
      console.log("bucketName=", res.data.bucketName);
      set({ bucket: res.data.bucketName });
      set({ selectedBucket: res.data.bucketName });
    } catch (error) {
      set({ bucket: null });
      set({ selectedBucket: null });
      toast.error("Connection failed");
    }
  },

  deleteBucket: async (data) => {
    try {
      const res = await axiosInstance.post("/aws/delete", data);
      set({ bucket: res.data });
      toast.success("Bucket deleted");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400 || status === 404) {
        toast.warning(getErrorMessage(error, "Error deleting bucket"));
      } else {
        toast.error(getErrorMessage(error, "Error deleting bucket"));
      }
      set({ bucket: null });
    }
  },

  generateDefaultBucketUrl: async ({ fileName, expiration, userId }) => {
  try {
    const bucketName = get().selectedBucket;
    if (!bucketName) {
      toast.warning("No bucket selected. Please connect a bucket first.");
      return null;
    }
    const res = await axiosInstance.post("/use-platform-bucket/getUrl", {
      fileName,
      expiration,
      bucketName,
      userId,
    });
    set({ generatedUrl: res.data });
    return res.data; // Return the URL data
  } catch (error) {
    set({generatedUrl:null})
    const status = error?.response?.status;
    if (status === 404) {
      toast.warning(
        getErrorMessage(
          error,
          "No such file found. Please try uploading again."
        )
      );
    } else {
      toast.error(getErrorMessage(error, "Internal server error"));
    }
    set({ generatedUrl: "" }); // Clear any previous URL
    return null; // Indicate failure
  }
},

  generateUserBucketUrl: async (fileName, expiration) => {
    try {
      const bucketName = get().selectedBucket;

      if (!bucketName) {
        toast.error("No bucket selected. Please connect a bucket first.");
        return;
      }
      const res = await axiosInstance.post("/func/signedurl", {
        fileName,
        expiration,
        bucketName,
      });

      set({ generatedUrl: res.data });
    } catch (error) {
      console.log(error);
      toast.error("error generating signed Url");
    }
  },

  sendMail: async (fileName, expiration, recipient) => {
    try {
      const bucketName = get().selectedBucket;
      if (!bucketName) {
        toast.warning("No bucket selected. Please connect a bucket first.");
        return;
      }
      if (!fileName || !expiration || !recipient) {
        toast.warning("Some fields look empty");
        return;
      }
      await axiosInstance.post("/use-platform-bucket/sendMail/req-access", {
        fileName,
        expiration,
        recipient,
        bucketName,
      });
      toast.success("Mail sent successfully");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400) {
        toast.warning(getErrorMessage(error, "Failed to send mail"));
      } else {
        toast.error(getErrorMessage(error, "Error sending mail"));
      }
    }
  },

  userBucket: async (data) => {
    try {
      const response = await axiosInstance.post("/userBucket", {
        data,
      });
      set({ usersBucket: response.data });
      toast.success("Bucket connected successfully");
      console.log("Response from backend:", response.data);
    } catch (error) {
      toast.error("Failed to connect bucket");
      console.error(error);
    }
  },

  getCloudformationSignedUrl: async () => {
    try {
      const res = await axiosInstance.get(
        "/start-user-bucket-session/cloudformationScript"
      );
      console.log(res.data);
      set({ cloudFormationTemplateUrl: res.data });
    } catch (error) {
      toast.error("Failed to generate Url");
      console.error(error);
    }
  },
}));
