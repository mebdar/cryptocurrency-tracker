import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    ShoppingBag,
    Shuffle,
    CreditCard,
    BarChart3,
    Info
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2 className="logo">⚡ CryptoDashboard</h2>

            <ul className="menu">
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <LayoutDashboard size={19} />
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/markets" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <ShoppingBag size={19} />
                        <span>Markets</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/transactions" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <Shuffle size={19} />
                        <span>Transactions</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/payment" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <CreditCard size={19} />
                        <span>Payment</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/analytics" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <BarChart3 size={19} />
                        <span>Analytics</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/information" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <Info size={19} />
                        <span>Information</span>
                    </NavLink>
                </li>
            </ul>

            {/* ⭐ BOTTOM LEFT CARD */}
            <div className="upgrade-card">
                <h3>Try the paid version!</h3>
                <p>
                    Try the paid version of our trading system and boost your investment returns.
                </p>

                <button className="upgrade-btn">
                    Buy
                </button>
            </div>
        </div>
    );
}
