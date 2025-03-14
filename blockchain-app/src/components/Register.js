import React, { useState } from "react";
import { web3, getContract } from "../utils/web3";

const Register = () => {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract();
      await contract.methods.registerAsVoter(voterId, password).send({ from: accounts[0] });
      alert("Successfully registered!");
      window.location.href = "/";
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="text" placeholder="Voter ID" onChange={(e) => setVoterId(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;