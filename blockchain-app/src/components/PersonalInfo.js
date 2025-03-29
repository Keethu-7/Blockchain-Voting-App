import React, { useEffect, useState } from "react";
import { web3, getContract } from "../utils/web3";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./styles/PersonalInfo.css";

const PersonalInfo = () => {
  const [voterInfo, setVoterInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoterInfo = async () => {
      try {
        const contract = await getContract();
        const accounts = await web3.eth.getAccounts();
        console.log("Current Account:", accounts[0]); // 🔍 Debug log
  
        const voterData = await contract.methods.voters(accounts[0]).call();
        console.log("Fetched Voter Data:", voterData); // 🔍 Debug log
  
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
        <nav>
            <Link to="/" >Home</Link>
            <Link to="/vote" >Vote</Link>
            <Link to="/personal-info" className="active" >Personal Info</Link>
        </nav>
        <div className="profile-card">
        <div className="profile-image">
          <img src="/profile.png" alt="Profile" />
          <button className="change-pic-btn">Change profile picture</button>
        </div>
        <div  className="user-info">
            <h2>Personal Information</h2>
            <p><strong>Name:</strong> {voterInfo.name}</p>
            <p><strong>Birth Year:</strong> {voterInfo.birthYear}</p>
            <p><strong>Email:</strong> {voterInfo.email}</p>
            <p className="mobilenum"><strong>Mobile:</strong> {voterInfo.mobileNumber}</p>
            <p><strong>Username:</strong> {voterInfo.username}</p>
        </div>
    </div>
    </div>
  );
};

export default PersonalInfo;
