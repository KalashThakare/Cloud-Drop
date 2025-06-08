"use client";
import React, { useState } from "react";
import Step1 from "@/components/Onboarding/Step1";
import Step2 from "@/components/Onboarding/Step2";
import Step3 from "@/components/Onboarding/Step3";
import Step4 from "@/components/Onboarding/Step4";
import Step5 from "@/components/Onboarding/Step5";
import { toast } from "sonner";

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const handleNext = (newData) => {
    setData({ ...data, ...newData });
    setStep(step + 1);
  };

  const handleComplete = (roleArn) => {
    // console.log("Onboarding Complete. Role ARN:", roleArn);
    toast.success("Bucket Connection Complete!");
    // Handle completion logic here
  };

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center mx-auto">
      {step === 1 && <Step1 onNext={handleNext} />}
      {step === 2 && (
        <Step2 accountId={data.accountId} onNext={() => handleNext()} />
      )}
      {step === 3 && (
        <Step3
          accountId={data.accountId}
          bucketName={data.bucketName}
          onNext={() => handleNext()}
        />
      )}
      {step === 4 && <Step4 onNext={() => handleNext()} />}
      {step === 5 && <Step5 bucketName={data.bucketName} onComplete={handleComplete} />}
    </div>
  );
}
