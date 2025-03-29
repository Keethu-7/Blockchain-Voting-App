import React, { useEffect, useState } from "react";
import { web3, getContract } from "../utils/web3";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PersonalInfo = () => {
  const [voterInfo, setVoterInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoterInfo = async () => {
      const voterId = localStorage.getItem("voterId");
      try {
        const contract = await getContract();
        const accounts = await web3.eth.getAccounts();
        const voterData = await contract.methods.voters(accounts[0]).call();

        if (!voterData.registered) {
          toast.error("No voter information found.");
          navigate("/");
          return;
        }

        setVoterInfo(voterData);
      } catch (error) {
        console.error("Error fetching voter information:", error);
        toast.error("Failed to load personal info.");
      }
    };

    fetchVoterInfo();
  }, [navigate]);

  if (!voterInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Personal Information</h2>
      <p><strong>Name:</strong> {voterInfo.name}</p>
      <p><strong>Birth Year:</strong> {voterInfo.birthYear}</p>
      <p><strong>Email:</strong> {voterInfo.email}</p>
      <p><strong>Mobile:</strong> {voterInfo.mobileNumber}</p>
      <p><strong>Username:</strong> {voterInfo.username}</p>
    </div>
  );
};

export default PersonalInfo;
