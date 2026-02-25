import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BarChart2,
    Heart,
    Bell,
    Settings,
    Radio,
    CloudDownload,
    Hexagon
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
    const [newsEnabled, setNewsEnabled] = useState(true);

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <div className="logo-section">
                    <Hexagon className="logo-icon" size={24} fill="#8b5cf6" color="#8b5cf6" />
                    <h2 className="logo-text">CryptoTracker</h2>
                </div>

                <ul className="menu">
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/markets" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <BarChart2 size={20} />
                            <span>Markets</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/wishlist" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <Heart size={20} />
                            <span>Wishlist</span>
                            <span className="notification-dot"></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/alerts" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <Bell size={20} />
                            <span>Alerts</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <Settings size={20} />
                            <span>Settings</span>
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="sidebar-middle">
                <div className="nav-item news-item">
                    <div className="news-left">
                        <Radio size={20} />
                        <span>News</span>
                    </div>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={newsEnabled}
                            onChange={() => setNewsEnabled(!newsEnabled)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <button className="wishlist-btn">
                    <CloudDownload size={20} />
                    <span>My Wishlist</span>
                </button>
            </div>


            <div className="sidebar-bottom">
                <button className="upgrade-plan-btn">
                    Upgrade Plan
                </button>
            </div>
        </div>
    );
}

