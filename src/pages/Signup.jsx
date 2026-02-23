import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Signup() {
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();

        // temporary signup
        navigate("/");
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSignup}>
                <h2>Create Account</h2>

                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />

                <button type="submit">Sign Up</button>

                <p>
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;