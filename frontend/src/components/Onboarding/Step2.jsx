"use client";
import React from "react";
import { toast } from "sonner";

export default function Step2({ accountId, onNext }) {
  const policy = `
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "cloudformation:*",
      "iam:*"
    ],
    "Resource": "*"
  }]
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(policy);
    toast.success("Policy copied to clipboard!");
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Step 2: Permission Check</h2>
      <p className="mb-4">
        Before continuing, make sure you are signed in to the AWS account:{" "}
        <strong>{accountId}</strong>
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>You have permission to create CloudFormation stacks.</li>
        <li>You have permission to create and pass IAM roles.</li>
      </ul>
      <pre className="bg-gray-700 p-4 rounded mb-4 text-sm">{policy}</pre>
      <button
        onClick={copyToClipboard}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Copy Policy to Clipboard
      </button>
      <button
        onClick={onNext}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Continue
      </button>
    </div>
  );
}
