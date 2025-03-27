import React, { useEffect, useState } from "react";
import { web3, getContract } from "./utils/web3";
import "./App.css";
//import { Router } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Vote from "./components/VotingForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");

  
  useEffect(() => {
    const initBlockchain = async () => {
      try {
        if (!web3) {
          alert("Web3 provider not found! Please install MetaMask.");
          return;
        }
  
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          alert("No accounts found. Please unlock MetaMask and refresh.");
          return;
        }
        setAccount(accounts[0]);
  
        const contractInstance = await getContract();
        if (!contractInstance) {
          alert("Contract not deployed on the current network!");
          return;
        }
        setContract(contractInstance);
        window.contract = contractInstance;
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        alert("Error connecting to blockchain. Check console for details.");
      }
    };
  
    initBlockchain();
  }, []);
  

  const handleRegister = async () => {
    if (!voterId || !password) {
      alert("Please enter a Voter ID and Password.");
      return;
    }
    try {
      await contract.methods.registerAsVoter(voterId, password).send({ from: account });
      alert("Successfully registered!");
      setIsRegistered(true);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register.");
    }
  };

  const handleVote = async (candidateId) => {
    if (!contract) {
      alert("Smart contract is not loaded!");
      return;
    }
    const voterId = prompt("Enter your Voter ID:");
    const password = prompt("Enter your Password:");
    if (!voterId || !password) {
      alert("Please enter your Voter ID and Password to vote.");
      return;
    }
    try {
      await contract.methods.vote(candidateId, voterId, password).send({ from: account });
      alert("Vote cast successfully!");
      setVoted(true);
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to cast vote.");
    }
  };

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
    /*
    <div className="App">
      <h1>Blockchain E-Voting System</h1>
      <p><strong>Connected Account:</strong> {account || "Not connected"}</p>

      {!isRegistered && (
        <div>
          <input type="text" placeholder="Voter ID" value={voterId} onChange={(e) => setVoterId(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleRegister}>Register as Voter</button>
        </div>
      )}

      {loading ? (
        <p>Loading candidates...</p>
      ) : (
        <div>
          <h2>Candidates</h2>
          <ul>
            {candidates.map((candidate) => (
              <li key={candidate.id}>
                {candidate.name} - {candidate.votes} votes
                <button onClick={() => handleVote(candidate.id)} disabled={voted}>
                  Vote
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div> */
  );
}

export default App;
