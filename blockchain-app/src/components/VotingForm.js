import React, { useState, useEffect } from "react";
import { web3, getContract } from "../utils/web3";
import { useLocation, useNavigate } from "react-router-dom";

const Vote = () => {
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { voterId, password } = location.state || {}; // Get voter data

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const contract = await getContract();
        const candidatesCount = await contract.methods.candidatesCount().call();
        const candidatesList = [];
        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await contract.methods.getCandidate(i).call();
          candidatesList.push({ id: i, name: candidate[0], votes: candidate[1] });
        }
        setCandidates(candidatesList);
      } catch (error) {
        console.error("Error loading candidates:", error);
      }
    };

    const fetchVotingStatus = async () => {
      try {
        const contract = await getContract();
        const status = await contract.methods.getVotingStatus().call();
        setIsVotingActive(status);
      } catch (error) {
        console.error("Error fetching voting status:", error);
      }
    };

    loadCandidates();
    fetchVotingStatus();
  }, []);

  const handleVote = async (candidateId) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract();
      if (!voterId || !password || !candidateId) {
        alert("Missing Voter ID, Password, or Candidate ID. Please try again.");
        return;
      }
      
    console.log("Voting with Candidate ID:", candidateId);
    console.log("Voter ID:", voterId);
    console.log("Password:", password);
      
      console.log("Voting with Voter ID:", voterId, "and Password:", password);
      
      await contract.methods
        .vote(candidateId, voterId, password)
        .send({ from: accounts[0] });

      alert("Vote cast successfully!");
      setVoted(true);
      navigate("/");
    } catch (error) {
      console.error("Error voting:", error);
      alert(`Failed to cast vote. Error: ${error.message || error}`);
    }
  };

  return (
    <div>
      <h2>Welcome, Voter {voterId}</h2>
      <h3>Voting Status: {isVotingActive ? "Active 🟢" : "Inactive 🔴"}</h3>
      

      {candidates.length === 0 ? (
        <p>Loading candidates...</p>
      ) : (
        candidates.map((candidate) => (
          <div key={candidate.id}>
            {candidate.name} - {candidate.votes} votes
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
