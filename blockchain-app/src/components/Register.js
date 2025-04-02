import React, { useState } from "react";
import { web3, getContract } from "../utils/web3";
import "./styles/Register.css"; // Import the new CSS file
import { toast } from "react-toastify"; // ✅ Import toast
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";  // Add the hook at the top


const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Extract birth year
  const getBirthYear = (dob) => new Date(dob).getFullYear();

  // Calculate Age
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

  // Register User
  const handleRegister = async () => {
    if (!validateInputs()) return;
  
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract();

      if (!accounts || accounts.length === 0) {
        toast.error("No accounts found. Please unlock your MetaMask.");
        return;
      }
  
      const birthYear = getBirthYear(dob);
  
      // Hash password before sending (you can use Web3.js's keccak256 or another hashing method)
      const passwordHash = web3.utils.keccak256(password);
  
      console.log("Sending data to contract:", {
        name,
        birthYear,
        email,
        mobile,
        username,
        passwordHash,  // Send hashed password
      });
  
      // Send registration data to contract
      await contract.methods
        .registerAsVoter(name, birthYear, email, mobile, username, passwordHash)
        .send({ from: accounts[0] });
  
      toast.success("Registration successful! 🎉");
      navigate("/");  // Navigate to home page instead of reloading
  
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(`Registration failed: ${error.message}`);
    }
  };

  return (
    
      <div className="container">
    {/* Image Container */}
    <div className="image-container">
      <img
        src={process.env.PUBLIC_URL + "/Registerpic.png"}
        alt="Registration Illustration"
        style={{ width: "400px", height: "auto" }}
      />
    </div>
      <div className="form-container">
        <h2>Registration form</h2>
        <form>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="date"
            placeholder="Date of Birth"
            onChange={(e) => setDob(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mobile No."
            onChange={(e) => setMobile(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" class="register-button" onClick={handleRegister}>
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
