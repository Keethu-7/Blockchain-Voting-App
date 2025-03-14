import React, { useState } from "react";

const VotingForm = ({ vote }) => {
  const [candidateId, setCandidateId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (candidateId) {
      vote(candidateId);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Enter Candidate ID"
        value={candidateId}
        onChange={(e) => setCandidateId(e.target.value)}
      />
      <button type="submit">Vote</button>
    </form>
  );
};

export default VotingForm;
