"use client";
import { bucketFunc } from "@/store/bucketFunc.js";
import React, { useEffect, useState } from "react";

export default function Step3({ accountId, bucketName, onNext }) {

  const getCloudformationSignedUrl = bucketFunc((state)=>state.getCloudformationSignedUrl);
  const cloudformationTemplateUrl = bucketFunc((state)=>state.cloudformationTemplateUrl);

  const [signedUrl,setUrl] = useState("");

  useEffect(() => {
    const fetchSignedUrl = async () => {
      await getCloudformationSignedUrl(); 
    };

    fetchSignedUrl();
  }, []);

  useEffect(() => {
    if (cloudformationTemplateUrl) {
      setUrl(cloudformationTemplateUrl);
    }
  }, [cloudformationTemplateUrl]);

  const cloudFormationConsoleURL = `https://console.aws.amazon.com/cloudformation/home?#/stacks/create/template` +
  `?templateURL=${encodeURIComponent(signedUrl)}` +
  `&accountId=${accountId}` +
  `&bucketName=${bucketName}`;


  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Step 3: Launch CloudFormation</h2>
      <p className="mb-4">
        Click the button below to launch the CloudFormation stack in your AWS
        Console.
      </p>
      <a
        href={cloudFormationConsoleURL}
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
