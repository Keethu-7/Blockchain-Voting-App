// src/components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { web3, getContract } from "../utils/web3";

const AdminDashboard = () => {
  const [contract, setContract] = useState(null);
  const [votingStatus, setVotingStatus] = useState(false);

  useEffect(() => {
    const init = async () => {
      const contractInstance = await getContract();
      setContract(contractInstance);
      const status = await contractInstance.methods.getVotingStatus().call();
      setVotingStatus(status);
    };
    init();
  }, []);

  const handleStartVoting = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.startVoting().send({ from: accounts[0] });
      alert("Voting Started!");
      setVotingStatus(true);
    } catch (error) {
      console.error("Error starting voting:", error);
      alert("Failed to start voting.");
    }
  };

  const handleEndVoting = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.endVoting().send({ from: accounts[0] });
      alert("Voting Ended!");
      setVotingStatus(false);
    } catch (error) {
      console.error("Error ending voting:", error);
      alert("Failed to end voting.");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Voting Status: {votingStatus ? "Active" : "Inactive"}</p>
      <button onClick={handleStartVoting} disabled={votingStatus}>
        Start Voting
      </button>
      <button onClick={handleEndVoting} disabled={!votingStatus}>
        End Voting
      </button>
    </div>
  );
};

export default AdminDashboard;
