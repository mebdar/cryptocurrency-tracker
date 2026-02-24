import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/SupabaseClient"; // ✅ FIXED path (lowercase)

import "../styles/authBase.css";
import "../styles/signup.css";

function Signup() {
  const navigate = useNavigate();

  // ✅ Use ONE form state (you already had this)
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Supabase Signup Logic
  const handleSignup = async (e) => {
    e.preventDefault();

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });


    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Check your email.");
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSignup}>
        <h2 className="auth-title">Sign Up</h2>

        {/* Step Indicator */}
        <div className="stepper">
          <div className="step active">1</div>
          <div className="line"></div>
          <div className="step">2</div>
          <div className="line"></div>
          <div className="step">3</div>
          <div className="line"></div>
          <div className="step">4</div>
        </div>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <button type="submit" className="auth-button">
          Continue
        </button>

        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>

        <p className="terms-text">
          By Proceeding, You Accept The Terms & Conditions And Privacy Policy.
        </p>
      </form>
    </div>
  );
}

export default Signup;