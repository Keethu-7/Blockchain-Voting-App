import React, { useState, useEffect } from "react";
import { web3, getContract } from "../utils/web3";
import { Link } from "react-router-dom";
import "./styles/AdminDashboard.css";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [contract, setContract] = useState(null);
  const [votingStatus, setVotingStatus] = useState(false);
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const contractInstance = await getContract();
        setContract(contractInstance);
    
        const status = await contractInstance.methods.getVotingStatus().call();
        setVotingStatus(status);
    
        const accounts = await web3.eth.getAccounts();
        console.log("Connected Account:", accounts[0]); // Debugging
    
        const voterList = await contractInstance.methods.getRegisteredVoters().call({ from: accounts[0] });
        console.log("Fetched Voters:", voterList); // Debugging
        setVoters(voterList);
      } catch (error) {
        console.error("Error fetching contract data:", error);
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);
  

  const handleStartVoting = async () => {
    if (!contract) {
      toast.error("Contract not loaded yet!");
      return;
    }
    setIsProcessing(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.startVoting().send({ from: accounts[0] });
      toast.success("Voting Started!");
      setVotingStatus(true);
    } catch (error) {
      console.error("Error starting voting:", error);
      toast.error("Failed to start voting.");
    }
    setIsProcessing(false);
  };

  const handleEndVoting = async () => {
    if (!contract) {
      toast.error("Contract not loaded yet!");
      return;
    }
    setIsProcessing(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.endVoting().send({ from: accounts[0] });
      toast.success("Voting Ended!");
      setVotingStatus(false);
    } catch (error) {
      console.error("Error ending voting:", error);
      toast.error("Failed to end voting.");
    }
    setIsProcessing(false);
  };

  const handleViewResults = async () => {
    if (!contract) {
      toast.error("Contract not loaded yet!");
      return;
    }
    try {
      const candidatesCount = await contract.methods.candidatesCount().call();
      const candidatesList = [];
      for (let i = 1; i <= candidatesCount; i++) {
        const candidate = await contract.methods.getCandidate(i).call();
        candidatesList.push({ id: i, name: candidate[0], votes: candidate[1] });
      }
      setCandidates(candidatesList);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching voting results:", error);
      toast.error("Failed to fetch voting results.");
    }
  };

  return (
    <div className="admin-dashboard">
      <ToastContainer />
      <h2>Admin Dashboard</h2>
      <p><strong>Voting Status:</strong> {votingStatus ? "Active 🟢" : "Inactive 🔴"}</p>

      <div className="button-group">
        <button onClick={handleStartVoting} disabled={votingStatus || isProcessing}>
          {isProcessing ? "Processing..." : "Start Voting"}
        </button>
        <button onClick={handleEndVoting} disabled={!votingStatus || isProcessing}>
          {isProcessing ? "Processing..." : "End Voting"}
        </button>
        <button onClick={handleViewResults}>Vote Results</button>
      </div>

      {showResults && (
        <div>
          <h3>Vote Results</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.name}</td>
                  <td>{candidate.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3>Registered Voters</h3>
      {loading ? (
        <p>Loading voters...</p>
      ) : voters.length === 0 ? (
        <p>No registered voters yet.</p>
      ) : (
        <table className="voter-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Voter Username</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{voter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/" className="home-button">Back to Home</Link>
    </div>
  );
};

export default AdminDashboard;
