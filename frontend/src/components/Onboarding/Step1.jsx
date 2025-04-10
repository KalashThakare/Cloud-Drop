"use client";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaAws, FaDatabase } from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FormContainer = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  width: 400px;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease forwards;
  opacity: 0;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  background-clip: padding-box;
  box-shadow: 0 10px 20px rgba(0, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
    border: 2px solid rgba(0, 255, 255, 0.5);
    scale: 1.015;
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const FormTitle = styled.h2`
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const StyledInput = styled.input`
  background: #111;
  color: white;
  border: 2px solid #00ffff;
  border-radius: 8px;
  padding: 0.8rem 2.5rem;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  @media (max-width: 480px) {
    padding: 0.6rem 2rem;
    font-size: 0.9rem;
  }
`;

const Icon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.8rem;
  transform: translateY(-50%);
  color: #00ffff;
  font-size: 1.2rem;

  @media (max-width: 480px) {
    font-size: 1rem;
    left: 0.6rem;
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
    <FormContainer>
      <FormTitle>
        Step 1: <br /> Enter{" "}
        <span className="text-[#00ffff] font-bold">AWS</span> Details
      </FormTitle>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <Icon>
            <FaAws />
          </Icon>
          <StyledInput
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="Enter your AWS Account ID"
            required
          />
        </InputContainer>
        <InputContainer>
          <Icon>
            <FaDatabase />
          </Icon>
          <StyledInput
            type="text"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            placeholder="Enter your Bucket Name"
            required
          />
        </InputContainer>
        <StyledButton type="submit">Next</StyledButton>
      </form>
    </FormContainer>
  );
}
