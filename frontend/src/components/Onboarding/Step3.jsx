"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { bucketFunc } from "@/store/bucketFunc.js";

const FormContainer = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  width: 400px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 255, 255, 0.1);
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
    border: 2px solid rgba(0, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const StyledButton = styled.a`
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
  text-align: center;
  display: block;
  margin-bottom: 1rem;

  &:hover {
    background: #00e6e6;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

export default function Step3({ accountId, bucketName, onNext }) {
  const getCloudformationSignedUrl = bucketFunc(
    (state) => state.getCloudformationSignedUrl
  );
  const cloudformationTemplateUrl = bucketFunc(
    (state) => state.cloudformationTemplateUrl
  );

  const [signedUrl, setUrl] = useState("");

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

  const cloudFormationConsoleURL =
    `https://console.aws.amazon.com/cloudformation/home?#/stacks/create/template` +
    `?templateURL=${encodeURIComponent(signedUrl)}` +
    `&accountId=${accountId}` +
    `&bucketName=${bucketName}`;

  return (
    <FormContainer>
      <Title>Step 3: <br /> Launch CloudFormation</Title>
      <p className="text-gray-400 mb-4">
        Click the button below to launch the CloudFormation stack in your AWS
        Console.
      </p>
      <StyledButton
        href={cloudFormationConsoleURL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Launch in AWS Console
      </StyledButton>
      <StyledButton as="button" onClick={onNext}>
        Next
      </StyledButton>
    </FormContainer>
  );
}
