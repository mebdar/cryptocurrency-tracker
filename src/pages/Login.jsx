import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/SupabaseClient";

import "../styles/authBase.css";
import "../styles/login.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // 👈 added

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

            // Ensure a profile row exists for this user (creates or updates)
            try {
                const user = data.user;
                if (user && user.id) {
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .upsert([
                            {
                                id: user.id,
                                email: user.email || null,
                                full_name: user.user_metadata?.full_name || null,
                                updated_at: new Date(),
                            },
                        ], { returning: 'minimal' });

                    if (profileError) console.error('Profile upsert error:', profileError);
                    else console.log('Profile upserted for user', user.id);
                }
            } catch (err) {
                console.error('Failed to ensure profile row:', err);
            }
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
                        type={showPassword ? "text" : "password"}   // 👈 changed
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}   // 👈 added
                        style={{ cursor: "pointer" }}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </span>
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