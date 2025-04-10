"use client";
import React from "react";
import styled from "styled-components";
import { toast } from "sonner";

const FormContainer = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding-inline: 2rem;
  padding-block: 1rem;
  height: 97%;
  width: 400px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 255, 255, 0.1);
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-0px);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
    border: 2px solid rgba(0, 255, 255, 0.5);
    scale: 1.015;
  }

  @media (max-width: 768px) {
    width: 90%;
    padding-inline: 1.5rem;
    padding-block: 1rem;
  }

  @media (max-width: 480px) {
    padding-inline: 1rem;
    padding-block: 0.8rem;
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1.25rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const StyledButton = styled.button`
  background: #00ffff;
  color: #111;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 0.75rem;

  &:hover {
    background: #00e6e6;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

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
    <FormContainer>
      <Title>
        Step 2: <br /> Permission Check
      </Title>
      <p className="text-gray-400 mb-4">
        Before continuing, make sure you are signed in to the AWS account id:{" "}
        <strong>{accountId}</strong>
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-400">
        <li>You have permission to create CloudFormation stacks.</li>
        <li>You have permission to create and pass IAM roles.</li>
      </ul>
      <pre className="bg-gray-700 p-2 rounded mb-3.5 text-sm text-gray-300">
        {policy}
      </pre>
      <StyledButton onClick={copyToClipboard}>
        Copy Policy to Clipboard
      </StyledButton>
      <StyledButton onClick={onNext}>Continue</StyledButton>
    </FormContainer>
  );
}
