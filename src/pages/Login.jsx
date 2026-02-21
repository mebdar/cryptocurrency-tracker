import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // temporary login
        navigate("/dashboard");
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleLogin}>
                <h2>Login</h2>

                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />

                <button type="submit">Login</button>

                <p>
                    Don’t have an account? <Link to="/signup">Sign up</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;