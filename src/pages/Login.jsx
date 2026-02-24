import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/SupabaseClient";

import "../styles/authBase.css";
import "../styles/login.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Login successful!");
            navigate("/dashboard");
            console.log("User:", data.user);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleLogin}>
                <h2 className="auth-title">Sign In</h2>

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="password-input">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span className="toggle-password">👁️</span>
                </div>

                <div className="auth-options">
                    <label>
                        <input type="checkbox" /> Remember Me
                    </label>
                    <Link to="/forgot-password" className="forgot-password">
                        Forgot Password?
                    </Link>
                </div>

                <button type="submit" className="auth-button">
                    Sign In
                </button>

                <p className="signup-text">
                    Don’t Have An Account? <Link to="/signup">Sign Up</Link>
                </p>

                <p className="terms-text">
                    By Proceeding, You Accept The Terms & Conditions And Privacy Policy.
                </p>
            </form>
        </div>
    );
}

export default Login;