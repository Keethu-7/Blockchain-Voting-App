import React, { useState } from "react";
import { web3, getContract } from "../utils/web3";

const Register = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const validateInputs = () => {
    if (!dob) {
      alert("Please enter your date of birth.");
      return false;
    }
    if (calculateAge(dob) < 18) {
      alert("You must be at least 18 years old to register.");
      return false;
    }
    if (!email.includes(".com")) {
      alert("Enter a valid email (must contain .com).");
      return false;
    }
    if (!/^\d{9}$/.test(mobile)) {
      alert("Mobile number must be exactly 9 digits.");
      return false;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract();
      await contract.methods.registerAsVoter(name, dob, email, mobile, username, password).send({ from: accounts[0] });
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
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="date" placeholder="Date of Birth" onChange={(e) => setDob(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Mobile No." onChange={(e) => setMobile(e.target.value)} />
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password (min 8 characters)" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
