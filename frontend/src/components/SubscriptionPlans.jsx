import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(0, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PackagesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PackageCard = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  width: 300px;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: ${(props) => props.delay * 0.1}s;
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
    scale: 1.02;
  }

  &:nth-child(2) {
    border-top: 2px solid rgba(0, 255, 255, 0.5);
    border-bottom: 2px solid rgba(0, 255, 255, 0.5);
  }
`;

const PackageTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Price = styled.div`
  color: #00ffff;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin: 1.5rem 0;
  position: relative;

  &::after {
    content: "/month";
    font-size: 1rem;
    color: #888;
    margin-left: 5px;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const FeatureItem = styled.li`
  color: #ddd;
  padding: 0.5rem 0;
  position: relative;
  padding-left: 2rem;
  display: flex;
  align-items: center;

  &::before {
    content: "✔";
    color: #00ffff;
    font-size: 1.2rem;
    margin-right: 0.5rem;
  }
`;

const SelectButton = styled.button`
  background: ${(props) => (props.highlight ? "#00ffff" : "transparent")};
  color: ${(props) => (props.highlight ? "#111" : "#00ffff")};
  border: 2px solid #00ffff;
  padding: 0.8rem 2rem;
  width: 100%;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;

  &:hover {
    background: #00ffff;
    color: #111;
    animation: ${pulse} 1s;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }

  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }

  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    100% {
      transform: scale(20, 20);
      opacity: 0;
    }
  }
`;

const SubscriptionPlans = () => {
  const packages = [
    {
      title: "Basic Plan",
      price: "$250",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      highlight: false,
    },
    {
      title: "Standard Plan",
      price: "$450",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      highlight: true,
    },
    {
      title: "Premium Plan",
      price: "$550",
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4",
        "Feature 5",
      ],
      highlight: false,
    },
  ];

  return (
    <Container>
      <Title>Subscription Plans</Title>
      <PackagesContainer>
        {packages.map((pkg, index) => (
          <PackageCard key={index} delay={index}>
            <PackageTitle>{pkg.title}</PackageTitle>
            <Price>{pkg.price}</Price>
            <FeatureList>
              {pkg.features.map((feature, i) => (
                <FeatureItem key={i}>{feature}</FeatureItem>
              ))}
            </FeatureList>
            <SelectButton highlight={pkg.highlight}>Select Now</SelectButton>
          </PackageCard>
        ))}
      </PackagesContainer>
    </Container>
  );
};

export default SubscriptionPlans;
