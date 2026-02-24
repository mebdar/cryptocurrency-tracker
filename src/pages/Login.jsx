import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/SupabaseClient";
import { useState } from "react";
import "./Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("Login failed: " + error.message);
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

                <label>Email Address</label>
                <input
                    type="email"
                    placeholder="Example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Password</label>
                <div className="password-input">
                    <input
                        type="password"
                        placeholder="********"
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
                    <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
                </div>

                <button type="submit" className="auth-button">Sign In</button>

                <p className="signup-text">
                    Don’t Have An Account? <Link to="/signup">Sign Up</Link>
                </p>

                <p className="terms-text">
                    By Proceeding, You Accept The <Link to="/terms">Terms & Conditions</Link> And <Link to="/privacy">Privacy Policy</Link> Of CryptoTracker.
                </p>
            </form>
        </div>
    );
}

export default Login;