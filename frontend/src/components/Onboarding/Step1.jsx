"use client";
import React, { useState } from "react";

export default function Step1({ onNext }) {
  const [accountId, setAccountId] = useState("");
  const [bucketName, setBucketName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountId && bucketName) {
      onNext({ accountId, bucketName });
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Step 1: Enter AWS Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">AWS Account ID</label>
          <input
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter your AWS Account ID"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Bucket Name</label>
          <input
            type="text"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter your Bucket Name"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </form>
    </div>
  );
}
