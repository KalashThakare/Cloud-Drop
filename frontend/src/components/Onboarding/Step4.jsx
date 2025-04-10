"use client";
import React from "react";
import styled from "styled-components";

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
  margin-top: 1rem;

  &:hover {
    background: #00e6e6;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const Screenshot = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
  }
`;

export default function Step4({ onNext }) {
  return (
    <FormContainer>
      <Title>Step 4: <br /> Example Screenshot</Title>
      <p className="text-gray-400 mb-4">
        Here's an example of what you'll see in the AWS Console. Make sure to
        review the options carefully.
      </p>
      <Screenshot src="/example-screenshot.png" alt="Example Screenshot" />
      <StyledButton onClick={onNext}>Next</StyledButton>
    </FormContainer>
  );
}
