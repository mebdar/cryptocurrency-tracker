import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2 className="logo">⚡ CryptoDashboard</h2>

            <ul className="menu">
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                        Dashboard
                    </NavLink>
                </li>
                <li><NavLink to="/markets">Markets</NavLink></li>
                <li><NavLink to="/transactions">Transactions</NavLink></li>
                <li><NavLink to="/payment">Payment</NavLink></li>
                <li><NavLink to="/analytics">Analytics</NavLink></li>
            </ul>
        </div>
    );
}
