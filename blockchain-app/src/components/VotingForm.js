import React, { useState, useEffect } from "react";
import { web3, getContract } from "../utils/web3";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "./styles/VotingForm.css";

const VotingForm = () => {
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);  // New state for tracking if the user has voted
  const location = useLocation();
  const navigate = useNavigate();
  const { voterId } = location.state || {};

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const contract = await getContract();
        const candidatesCount = await contract.methods.candidatesCount().call();
        console.log("Candidates count:", candidatesCount); // Debugging log

        const candidatesList = [];
        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await contract.methods.getCandidate(i).call();
          console.log("Candidate data:", candidate); // Debugging log
          candidatesList.push({
            id: i,
            name: candidate[0],
            voteCount: candidate[1],
            age: candidate[2],
            party: candidate[3],
            education: candidate[4],
            image: `candidate${i}.jpeg`, // Updated path (directly in public/)
          });
        }
        setCandidates(candidatesList);
        console.log("Candidates from contract:", candidatesList);

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

    const checkVotingEligibility = async () => {
      try {
        const contract = await getContract();
        const accounts = await web3.eth.getAccounts();
        const voterAddress = accounts[0];
        const voterData = await contract.methods.voters(voterAddress).call();

        if (voterData.voted) {
          setHasVoted(true); // Mark the user as having voted
        } else {
          setHasVoted(false); // Mark the user as eligible to vote
        }
      } catch (error) {
        console.error("Error checking voter eligibility:", error);
        toast.error("Failed to check voter eligibility.");
      }
    };

    loadCandidates();
    fetchVotingStatus();
    checkVotingEligibility();
  }, []);  // Empty dependency array ensures this runs once on mount

  const handleVote = async () => {
    if (!selectedCandidate || !confirmed) {
      toast.error("Please select a candidate and confirm your choice.");
      console.log("Selected candidate ID:", selectedCandidate);
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract();
      const voterAddress = accounts[0];

      const voterData = await contract.methods.voters(voterAddress).call();
      if (!voterData.registered) {
        toast.error("You are not registered to vote!");
        return;
      }
      if (voterData.voted) {
        toast.error("You have already voted!");
        return;
      }

      await contract.methods.vote(selectedCandidate).send({ from: voterAddress, gas: 300000 });
      toast.success("Your vote has been cast successfully!", {
        onClose: () => navigate("/"),
      });
    } catch (error) {
      console.error("Error voting:", error);
      toast.error(error.message || "Failed to cast vote.");
    }
  };

  return (
    <div className="voting-container">
      <nav className="nav-bar">
        <Link to="/">Home</Link>
        <Link to="/vote">Vote</Link>
        <Link to="/personal-info">Personal Info</Link>
      </nav>
      <h2>Welcome, Voter {voterId}</h2>
      <h3>Voting Status: {isVotingActive ? "Active 🟢" : "Inactive 🔴"}</h3>

      {/* Check if candidates data is loaded */}
      {candidates.length === 0 ? (
        <p>Loading candidates...</p>
      ) : hasVoted ? (
        <p>You have already voted! Thank you for participating.</p>  // Show this message if the voter has already voted 
      ) : (
        candidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <div className="candidate-header">
              <input
                type="radio"
                name="candidate"
                id={`candidate-${candidate.id}`}
                checked={selectedCandidate === candidate.id}
                onChange={() => setSelectedCandidate(candidate.id)}
              />
             <label htmlFor={`candidate-${candidate.id}`}>{candidate.name}</label>
              
            </div>
            <img
              src={candidate.image}
              alt={candidate.name}
              className="candidate-image"
              onError={(e) => {
                e.target.src = "/default-candidate.png"; // Fallback image
              }}
            />
            <div className="candidate-info">
              <p>Age: {candidate.age}</p>
              <p>Party: {candidate.party}</p>
              <p>Education: {candidate.education}</p>
            </div>
          </div>
        ))
      )}

      {/* If the voter hasn't voted yet, display the confirmation checkbox and submit button */}
      {!hasVoted && (
        <>
          <div className="confirmation-section">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
            <span>I have selected my candidate</span>
          </div>

          <button className="submit-button" onClick={handleVote} disabled={!isVotingActive}>
            SUBMIT
          </button>
        </>
      )}
    </div>
  );
};

export default VotingForm;
