import React, { useState, useEffect } from "react";
import { getContract } from "../utils/web3";
import { Link } from "react-router-dom";
import "./styles/ResultsPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsPage = () => {
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const contractInstance = await getContract();
        setContract(contractInstance);

        const candidatesCount = await contractInstance.methods.candidatesCount().call();
        let candidatesList = [];
        let maxVotes = 0;
        let electionWinner = null;

        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await contractInstance.methods.getCandidate(i).call();
          const candidateData = { id: i, name: candidate[0], votes: parseInt(candidate[1]) };
          candidatesList.push(candidateData);

          // Determine the winner
          if (candidateData.votes > maxVotes) {
            maxVotes = candidateData.votes;
            electionWinner = candidateData.name;
          }
        }

        setCandidates(candidatesList);
        setWinner(electionWinner);
      } catch (error) {
        console.error("Error fetching voting results:", error);
        toast.error("Failed to fetch voting results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [setContract]);

  return (
    <div className="results-page">
      <ToastContainer />
      <h2>Election Results</h2>

      {loading ? (
        <p>Loading results...</p>
      ) : (
        <>
          {winner ? <h3>🏆 Winner: {winner} 🎉</h3> : <h3>No winner yet</h3>}

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
        </>
      )}

      <div className="button-group">
        <Link to="/admin" className="back-button">Back to Admin Dashboard</Link>
        <Link to="/" className="home-button">Back to Home</Link>
      </div>
    </div>
  );
};

export default ResultsPage;
