import React, { useEffect, useState } from "react";
import { web3, getContract } from "./utils/web3";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const initBlockchain = async () => {
      try {
        if (!web3) {
          alert("Web3 provider not found! Please install MetaMask.");
          return;
        }

        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          alert("No accounts found. Please unlock MetaMask.");
          return;
        }
        setAccount(accounts[0]);

        const contractInstance = await getContract();
        if (!contractInstance) {
          alert("Contract not deployed on the current network!");
          return;
        }
        setContract(contractInstance);

        const candidatesCount = await contractInstance.methods.candidatesCount().call();
        let candidatesList = [];

        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await contractInstance.methods.getCandidate(i).call();
          candidatesList.push({ id: i, name: candidate[0], votes: candidate[1] });
        }

        setCandidates(candidatesList);
        setLoading(false);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        alert("Error connecting to blockchain. Check console for details.");
      }
    };

    initBlockchain();
  }, []);

  const handleVote = async (candidateId) => {
    if (!contract) {
      alert("Smart contract is not loaded!");
      return;
    }

    try {
      await contract.methods.vote(candidateId).send({ from: account });
      alert("Vote cast successfully!");
      setVoted(true);
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to cast vote.");
    }
  };

  return (
    <div className="App">
      <h1>Blockchain E-Voting System</h1>
      <p><strong>Connected Account:</strong> {account || "Not connected"}</p>

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
    </div>
  );
}

export default App;
