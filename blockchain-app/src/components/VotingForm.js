import React, { useState, useEffect } from "react";
import { web3, getContract } from "../utils/web3";
import { useLocation, useNavigate } from "react-router-dom";

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { voterId, password } = location.state;

  useEffect(() => {
    const loadCandidates = async () => {
      const contract = await getContract();
      const candidatesCount = await contract.methods.candidatesCount().call();
      let candidatesList = [];
      for (let i = 1; i <= candidatesCount; i++) {
        const candidate = await contract.methods.getCandidate(i).call();
        candidatesList.push({ id: i, name: candidate[0], votes: candidate[1] });
      }
      setCandidates(candidatesList);
    };
    loadCandidates();
  }, []);

  const handleVote = async (candidateId) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract();
      await contract.methods.vote(candidateId, voterId, password).send({ from: accounts[0] });
      alert("Vote cast successfully!");
      setVoted(true);
      navigate("/");
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to cast vote.");
    }
  };

  return (
    <div>
      <h2>Vote</h2>
      {candidates.map((candidate) => (
        <div key={candidate.id}>
          {candidate.name} - {candidate.votes} votes
          <button onClick={() => handleVote(candidate.id)} disabled={voted}>Vote</button>
        </div>
      ))}
    </div>
  );
};

export default Vote;