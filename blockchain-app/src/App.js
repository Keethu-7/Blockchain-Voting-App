import React, { useEffect, useState } from "react";
import { web3, getContract } from "./utils/web3";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/About";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Vote from "./components/VotingForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import PersonalInfo from "./components/PersonalInfo";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initBlockchain = async () => {
      try {
        if (!web3) {
          toast.error("Web3 provider not found! Please install MetaMask.");
          return;
        }

        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          toast.error("No accounts found. Please unlock MetaMask and refresh.");
          return;
        }
        setAccount(accounts[0]);

        const contractInstance = await getContract();
        if (!contractInstance) {
          toast.error("Contract not deployed on the current network!");
          return;
        }
        setContract(contractInstance);
        window.contract = contractInstance;
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        toast.error("Error connecting to blockchain. Check console for details.");
      }
    };

    initBlockchain();
  }, []);

  const handleRegister = async (voterId, password) => {
    if (!voterId || !password) {
      toast.error("Please enter a Voter ID and Password.");
      return;
    }
    try {
      await contract.methods.registerAsVoter(voterId, password).send({ from: account });
      toast.success("Successfully registered!");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Failed to register.");
    }
  };

  const handleVote = async (candidateId) => {
    if (!contract) {
      toast.error("Smart contract is not loaded!");
      return;
    }
    const voterId = prompt("Enter your Voter ID:");
    const password = prompt("Enter your Password:");
    if (!voterId || !password) {
      toast.error("Please enter your Voter ID and Password to vote.");
      return;
    }
    try {
      await contract.methods.vote(candidateId, voterId, password).send({ from: account });
      toast.success("Vote cast successfully!");
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to cast vote.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/vote" element={<Vote onVote={handleVote} />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
