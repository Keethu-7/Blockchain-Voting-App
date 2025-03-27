import React, { useState } from "react";
import { web3, getContract } from "../utils/web3";

const Register = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to extract birth year from full date
  const getBirthYear = (dob) => {
    return new Date(dob).getFullYear();
  };

  // Function to calculate age
  const calculateAge = (dob) => {
    const birthYear = getBirthYear(dob);
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  // Input Validation
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
    if (!/^\d{10}$/.test(mobile)) { 
      alert("Mobile number must be exactly 10 digits.");
      return false;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  // Handle Register Function
  const handleRegister = async () => {
    if (!validateInputs()) return; // Stop if validation fails

    try {
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract();

      // Extract birth year from full date input
      const birthYear = getBirthYear(dob);

      console.log("Sending data to contract:", { 
        name, 
        birthYear,  // Send birth year as uint
        email, 
        mobile, 
        username, 
        password 
      });

      await contract.methods
        .registerAsVoter(name, birthYear, email, mobile, username, password)
        .send({ from: accounts[0] });

      alert("Successfully registered!");
      window.location.href = "/";
    } catch (error) {
      console.error("Registration failed:", error);
      alert(`Failed to register: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      
      {/* Date of Birth Input */}
      <input 
        type="date" 
        placeholder="Date of Birth" 
        onChange={(e) => setDob(e.target.value)} 
      />

      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Mobile No." onChange={(e) => setMobile(e.target.value)} />
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password (min 8 characters)" onChange={(e) => setPassword(e.target.value)} />
      
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
