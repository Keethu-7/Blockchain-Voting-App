import React, { useState, useEffect } from "react";
import { web3, getContract } from "../utils/web3";
import { Link } from "react-router-dom";
import "./styles/AdminDashboard.css";
import { ToastContainer, toast } from "react-toastify"; // ✅ Add toast notifications
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [contract, setContract] = useState(null);
  const [votingStatus, setVotingStatus] = useState(false);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Prevent multiple clicks

  useEffect(() => {
    const init = async () => {
      try {
        const contractInstance = await getContract();
        setContract(contractInstance);

        const status = await contractInstance.methods.getVotingStatus().call();
        setVotingStatus(status);

        const accounts = await web3.eth.getAccounts();
        const voterList = await contractInstance.methods.getRegisteredVoters().call({ from: accounts[0] });
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

  return (
    <div className="admin-dashboard">
      <ToastContainer /> {/* ✅ Toast notifications */}
      <h2>Admin Dashboard</h2>
      <p><strong>Voting Status:</strong> {votingStatus ? "Active 🟢" : "Inactive 🔴"}</p>

      <div className="button-group">
        <button onClick={handleStartVoting} disabled={votingStatus || isProcessing}>
          {isProcessing ? "Processing..." : "Start Voting"}
        </button>
        <button onClick={handleEndVoting} disabled={!votingStatus || isProcessing}>
          {isProcessing ? "Processing..." : "End Voting"}
        </button>
      </div>

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
