import React, { useState } from "react";

const VotingForm = ({ account, contract }) => {
  const [candidateId, setCandidateId] = useState("");

  const handleVote = async () => {
    if (!contract) {
      alert("Smart contract is not loaded!");
      return;
    }

    try {
      await contract.methods.vote(candidateId).send({ from: account });
      alert(`Vote cast successfully for candidate ${candidateId}`);
    } catch (error) {
      console.error("Error voting:", error);
      alert("Voting failed. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Vote for a Candidate</h2>
      <input
        type="number"
        value={candidateId}
        onChange={(e) => setCandidateId(e.target.value)}
        placeholder="Enter Candidate ID"
      />
      <button onClick={handleVote}>Vote</button>
    </div>
  );
};

export default VotingForm;
