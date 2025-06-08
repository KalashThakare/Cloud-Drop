"use client";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { CheckCircle, Star, Crown } from "lucide-react";
import { subscriptionStore } from "@/store/subscriptionStore.js";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import "@/app/globals.css";
import { set } from "lodash";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4);}
  70% { box-shadow: 0 0 0 20px rgba(0, 255, 255, 0);}
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0);}
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-bottom: 4rem;
  font-family: "Inter", sans-serif;
  @media (max-width: 1024px) { padding: 2rem 0.5rem; }
  @media (max-width: 600px) { padding: 1rem 0.25rem; }
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  @media (max-width: 900px) { font-size: 2rem; }
  @media (max-width: 600px) { font-size: 1.5rem; margin-bottom: 1.5rem; }
`;

const Desc = styled.p`
  color: #b6eaff;
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) { font-size: 1rem; }
`;

const PackagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  justify-content: center;
  align-content: center;
  justify-items: center;
  @media (max-width: 1200px) { gap: 1.5rem; }
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); gap: 1.2rem; }
  @media (max-width: 700px) { grid-template-columns: 1fr; gap: 1rem; }
`;

const PackageCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 85%, #0e3749 100%);
  border-radius: 18px;
  padding: 2rem 1.5rem;
  width: 90%;
  min-width: 0;
  margin-left:1rem;
  margin-right:1rem;
  transition: all 0.3s cubic-bezier(.4,2,.6,1);
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: ${(props) => props.delay * 0.1}s;
  opacity: 0;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  background-clip: padding-box;
  box-shadow: 0 10px 24px rgba(0, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 0 40px 0 rgba(0, 255, 255, 0.18);
    border: 2px solid #00ffff;
  }
  &.highlight {
    border-top: 2px solid #00ffff;
    border-bottom: 2px solid #00ffff;
    border-left: none;
    border-right: none;
    box-shadow: 0 0 40px 0 rgba(0, 255, 255, 0.18);
    background: linear-gradient(135deg, #1a1a1a 70%, #0e3749 100%);
    &:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 0 40px 0 rgba(0, 255, 255, 0.18);
      border: 2px solid #00ffff;
    }
  }
  @media (max-width: 900px) { padding: 1.5rem 1rem; }
  @media (max-width: 600px) { padding: 1rem 0.5rem; }
`;

const Badge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #00ffff;
  color: #111;
  font-weight: bold;
  font-size: 0.85rem;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 2px 8px rgba(0,255,255,0.08);
  z-index: 2;
`;

const PackageTitle = styled.h3`
  color: white;
  font-size: 2.3rem;
  margin-bottom: 0.2rem;
  margin-top: 2rem;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5px;
  @media (max-width: 600px) { font-size: 2rem; }
`;

const Price = styled.div`
  color: #00ffff;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin: 1rem 0 0.5rem 0;
  position: relative;
  &::after {
    content: "/month";
    font-size: 1rem;
    color: #888;
    margin-left: 5px;
  }
  @media (max-width: 600px) { font-size: 1.3rem; }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 1rem 0;
  @media (max-width: 600px) { margin: 1rem 0; }
`;

const FeatureItem = styled.li`
  color: #e0f7fa;
  padding: 0.5rem 0;
  position: relative;
  padding-left: 2rem;
  display: flex;
  align-items: center;
  font-size: 1rem;
  & svg {
    color: #00ffff;
    margin-right: 0.7rem;
    min-width: 1.2em;
  }
  @media (max-width: 600px) { font-size: 0.95rem; padding-left: 1.5rem; }
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
  font-size: 1rem;
  margin-top: 1rem;
  &:hover {
    background: #00ffff;
    color: #111;
    animation: ${pulse} 1s;
    box-shadow: 0 0 0 2px #00ffff;
  }
  &::after {
    content: "";
    position: absolute;
    top: 50%; left: 50%;
    width: 5px; height: 5px;
    background: rgba(255,255,255,0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1,1) translate(-50%);
    transform-origin: 50% 50%;
  }
  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }
  @keyframes ripple {
    0% { transform: scale(0,0); opacity: 0.5; }
    100% { transform: scale(20,20); opacity: 0; }
  }
  @media (max-width: 600px) { padding: 0.7rem 1rem; font-size: 0.95rem; }
`;

const Subscribe = ({handleFreeClick}) => {
  useEffect(() => {
          subscriptionStore.getState().getPlans();
      }, []);
  const plans = subscriptionStore((state) => state.plans);
  const subscribe = subscriptionStore((state)=>state.subscribeToPlan);
  const authUser = useAuthStore((state)=>state.authUser)
  const userId = authUser?._id;
  const router = useRouter();
  const [value, setValue] = useState("");


  const handleClick=async(planId)=>{
    if(planId === "6837e385792da421d38c9d95"){
      setValue("free");
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push("/Main?useDefault=true");
      toast.success("You are now subscribed to the Free Plan! but features are limited. Upgrade to Premium for more features.");
    } else {
      setValue("premium");
      await new Promise(resolve => setTimeout(resolve, 4000));
      subscribe({userId,planId,router});
      setValue("");
    }
  }

  return (
    <section id="pricing" className="bg-gradient-to-b from-gray-950 to-slate-950 flex justify-center hide-scrollbar" style={{overflowY: "auto", maxHeight: "100vh"}}>
      <Container className="hide-scrollbar">
        <Title>Subscription Plans</Title>
        <Desc>
          Choose the plan that fits your team. Upgrade anytime as your needs grow.
          <br />
          <span style={{ color: "#00ffff" }}>
            All plans include secure file sharing, group chat, and cloud storage.
          </span>
        </Desc>
        <PackagesContainer>
          {plans.slice(0).map((pkg, index) => (
            <PackageCard
              key={pkg._id}
              delay={index}
              className={pkg.isFree ? "" : "highlight"}
            >
              <Badge>
                {pkg.isFree ? <Star size={18} /> : <Crown size={18} />}  {pkg.isFree ? "Free Plan" : "Premium Plan"}
              </Badge>
              <PackageTitle>{pkg.name}</PackageTitle>
              <Price>{pkg.price === 0 ? "Free" : `₹ ${pkg.price}`}</Price>
              <FeatureList>
                {pkg.features.length > 0 ? (
                  pkg.features.map((feature, i) => (
                    <FeatureItem key={i}>
                      <CheckCircle size={18} /> {feature}
                    </FeatureItem>
                  ))
                ) : (
                  <FeatureItem>
                    <CheckCircle size={18} /> Basic Access
                  </FeatureItem>
                )}
              </FeatureList>
              <SelectButton onClick={()=>handleClick(pkg._id)} highlight={!pkg.isFree ? "true" : undefined}>
                {pkg.isFree ? 
                (value !== "free" ? "Start Free" : "Activating.....") : 
                (value === "premium" ? "Upgrading....." : "Subscribe") 
                }
              </SelectButton>
            </PackageCard>
          ))}
        </PackagesContainer>
      </Container>
    </section>
  );
};


export default Subscribe;


