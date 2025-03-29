import React, { useState, useEffect } from "react";
import { web3, getContract } from "../utils/web3";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Vote = () => {
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { voterId } = location.state || {}; // ✅ Removed 'password' from here

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const contract = await getContract();
        const candidatesCount = await contract.methods.candidatesCount().call();
        const candidatesList = [];
        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await contract.methods.getCandidate(i).call();
          candidatesList.push({ id: i, name: candidate[0] });
        }
        setCandidates(candidatesList);
      } catch (error) {
        console.error("Error loading candidates:", error);
        toast.error("Failed to load candidates.");
      }
    };

    const fetchVotingStatus = async () => {
      try {
        const contract = await getContract();
        const status = await contract.methods.getVotingStatus().call();
        setIsVotingActive(status);
      } catch (error) {
        console.error("Error fetching voting status:", error);
        toast.error("Failed to fetch voting status.");
      }
    };

    loadCandidates();
    fetchVotingStatus();
  }, []);

  const handleVote = async (candidateId) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract();
      const voterAddress = accounts[0];
  
      // 🔍 Debug: Fetch voter data
      const voterData = await contract.methods.voters(voterAddress).call();
      console.log("Voter Data:", voterData);
  
      if (!voterData.registered) {
        toast.error("You are not registered to vote!");
        return;
      }
  
      if (voterData.hasVoted) {
        toast.error("You have already voted!");
        return;
      }
  
      console.log(`Voting for Candidate ID: ${candidateId}`);
  
      // ✅ Send transaction
      await contract.methods.vote(candidateId).send({ 
        from: voterAddress, 
        gas: 300000 
      });
  
      toast.success("Your vote has been cast successfully!", {
        onClose: () => navigate("/")
      });
  
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Error: " + error.message);
    }
  };
  
  
  
  

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/vote">Vote</Link>
        <Link to="/personal-info">Personal Info</Link>
      </nav>
      <h2>Welcome, Voter {voterId}</h2>
      <h3>Voting Status: {isVotingActive ? "Active 🟢" : "Inactive 🔴"}</h3>

      {candidates.length === 0 ? (
        <p>Loading candidates...</p>
      ) : (
        candidates.map((candidate) => (
          <div key={candidate.id}>
            {candidate.name}
            <button
              onClick={() => handleVote(candidate.id)}
              disabled={voted || !isVotingActive}
            >
              {voted ? "Voted" : "Vote"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Vote;
