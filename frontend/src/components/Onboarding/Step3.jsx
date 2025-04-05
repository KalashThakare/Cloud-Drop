"use client";
import React from "react";

export default function Step3({ accountId, bucketName, onNext }) {
  const signedUrl = `https://console.aws.amazon.com/cloudformation/home?#/stacks/create/template?templateURL=https://example.com/cloudformation-template.yaml&accountId=${accountId}&bucketName=${bucketName}`;

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Step 3: Launch CloudFormation</h2>
      <p className="mb-4">
        Click the button below to launch the CloudFormation stack in your AWS
        Console.
      </p>
      <a
        href={signedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
      >
        Launch in AWS Console
      </a>
      <button
        onClick={onNext}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Next
      </button>
    </div>
  );
}
