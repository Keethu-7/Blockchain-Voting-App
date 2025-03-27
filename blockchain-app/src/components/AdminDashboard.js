import React, { useState, useEffect } from "react";
import { web3, getContract } from "../utils/web3";

const AdminDashboard = () => {
  const [contract, setContract] = useState(null);
  const [votingStatus, setVotingStatus] = useState(false);
  const [voters, setVoters] = useState([]);  // State to store voter usernames

  useEffect(() => {
    const init = async () => {
      try {
        const contractInstance = await getContract();
        setContract(contractInstance);

        const status = await contractInstance.methods.getVotingStatus().call();
        setVotingStatus(status);

        // Fetch registered voters
        const accounts = await web3.eth.getAccounts();
        const voterList = await contractInstance.methods.getRegisteredVoters().call({ from: accounts[0] });
        setVoters(voterList);

      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };
    init();
  }, []);

  const handleStartVoting = async () => {
    if (!contract) {
      alert("Contract not loaded yet!");
      return;
    }
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
    if (!contract) {
      alert("Contract not loaded yet!");
      return;
    }
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
      <p><strong>Voting Status:</strong> {votingStatus ? "Active 🟢" : "Inactive 🔴"}</p>
      <button onClick={handleStartVoting} disabled={votingStatus}>Start Voting</button>
      <button onClick={handleEndVoting} disabled={!votingStatus}>End Voting</button>

      <h3>Registered Voters</h3>
      <ul>
        {voters.length === 0 ? <p>No registered voters yet.</p> : voters.map((voter, index) => (
          <li key={index}>{voter}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
