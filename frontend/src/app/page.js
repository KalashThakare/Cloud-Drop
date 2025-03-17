'use client'
import { axiosInstance } from "@/lib/axios.js";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, FilePlus2, Trash2 ,Plug} from "lucide-react";
import { bucketFunc } from "@/store/bucketFunc.js";

export default function App() {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);
  const fetchBuckets = bucketFunc((state)=>state.fetchedBuckets);
  const fetchBucket = bucketFunc((state) => state.fetchBucket);

  const [file, setFile] = useState();
  const [caption, setCaption] = useState("");
  const [buckets, setBuckets] = useState([]);

  useEffect(() => {
    if (authUser == null) {
      router.replace("/login");
    }
    fetchBucket();
  }, [authUser, router,fetchBucket]);

  

  const deleteBucket = async (bucketName) => {
  
  };

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    await axiosInstance.post("/func/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Logout Button */}
      <button 
        onClick={() => { logout(); router.replace("/login"); }}
        className="absolute top-5 right-5 flex items-center gap-2 p-2 text-white rounded-lg transition-all hover:bg-red-600"
      >
        <LogOut size={20} /> Logout
      </button>

      {/* Add Bucket Button */}
      <button 
        onClick={() => { router.push("/add_bucket"); }}
        className="absolute top-5 left-5 flex items-center gap-2 p-2 text-white rounded-lg transition-all hover:bg-green-500"
      >
        <FilePlus2 size={20} /> Add Bucket
      </button>

      

      <div className="flex gap-8 mt-12">

      <div className="w-96 p-6 rounded-xl bg-black shadow-lg text-white border border-gray-700">
          <h1 className="text-2xl font-bold mb-4 text-cyan-300 text-center">Your Buckets</h1>
          <ul>
            {fetchBuckets.length > 0 ? (
              fetchBuckets.map((buckets) => (
                <li key={buckets.bucketName} className="flex justify-between items-center p-3 border-b border-gray-600">
                  <div>
                    <p className="font-semibold">{buckets.bucketName}</p>
                    <p className="text-sm text-gray-400">{buckets.bucketRegion}</p>
                  </div>
                  <button
                      onClick={() => connectToBucket(bucket.bucketName)}
                      className="p-2 bg-green-600 text-white rounded-lg transition-all hover:bg-green-500"
                    >
                      <Plug size={16} />
                    </button>
                  <button
                    onClick={() => deleteBucket(buckets.bucketName)}
                    className="p-2 bg-red-600 text-white rounded-lg transition-all hover:bg-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400">No buckets found</p>
            )}
          </ul>
        </div>
        {/* Upload Form */}
        <form 
          onSubmit={submit} 
          className="w-96 p-6 rounded-xl bg-black shadow-lg flex flex-col gap-4 text-center border border-gray-700"
        >
          <h1 className="text-2xl font-bold mb-2 text-cyan-300">Cloud-drop</h1>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            accept="image/*"
            className="p-5 border-2 border-dashed border-gray-600 rounded-xl bg-gray-900 cursor-pointer text-white transition-all hover:border-blue-400 hover:bg-gray-800"
          />
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            type="text"
            placeholder="Caption"
            className="p-3 border border-gray-600 rounded-lg text-lg text-white bg-gray-900 focus:border-blue-400 focus:outline-none transition-all"
          />
          <button 
            type="submit" 
            className="p-3 bg-blue-600 text-white rounded-lg text-lg cursor-pointer transition-all hover:bg-blue-500 active:translate-y-0"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
