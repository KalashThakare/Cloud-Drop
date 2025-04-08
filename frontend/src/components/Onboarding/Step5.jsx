"use client";
import { bucketFunc } from "@/store/bucketFunc";
import React, { useState } from "react";

export default function Step5({ onComplete }) {

  const connectBucket = bucketFunc((state)=>state.connectBucket);

  const [roleArn, setRoleArn] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(onComplete){
      onComplete(roleArn)
      console.log(roleArn)
      connectBucket(roleArn);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Step 5: Verify Role</h2>
      <p className="mb-4">
        Enter the Role ARN created by the CloudFormation stack.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roleArn}
          onChange={(e) => setRoleArn(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          placeholder="Enter Role ARN"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Complete
        </button>
      </form>
    </div>
  );
}
