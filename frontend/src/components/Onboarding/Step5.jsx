"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { bucketFunc } from "@/store/bucketFunc";

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

const StyledInput = styled.input`
  background: #111;
  color: white;
  border: 2px solid #00ffff;
  border-radius: 8px;
  padding: 0.8rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.9rem;
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

  &:hover {
    background: #00e6e6;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

export default function Step5({ bucketName, onComplete }) {
  const connectBucket = bucketFunc((state) => state.connectBucket);
  const [roleArn, setRoleArn] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onComplete) {
      onComplete(roleArn);
      connectBucket(roleArn);
    }
  };

  return (
    <FormContainer>
      <Title>Step 5: <br /> Verify Role</Title>
      <p className="text-gray-400 mb-4">
        Enter the Role ARN created by the CloudFormation stack.
      </p>
      <form onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          value={roleArn}
          onChange={(e) => setRoleArn(e.target.value)}
          placeholder="Enter Role ARN"
          required
        />
        <StyledButton type="submit">Complete</StyledButton>
      </form>
    </FormContainer>
  );
}
