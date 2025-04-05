"use client";
import React from "react";

export default function Step4({ onNext }) {
  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Step 4: Example Screenshot</h2>
      <p className="mb-4">
        Here's an example of what you'll see in the AWS Console. Make sure to
        review the options carefully.
      </p>
      <img
        src="/example-screenshot.png"
        alt="Example Screenshot"
        className="rounded mb-4"
      />
      <button
        onClick={onNext}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
}
