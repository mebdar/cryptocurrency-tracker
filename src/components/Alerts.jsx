import { Bell, ArrowUpRight, ArrowDownRight, Info, X } from "lucide-react";
import "./Alerts.css";

const alertsData = [
    {
        id: 1,
        type: "price_up",
        title: "Bitcoin reached $65,000",
        time: "2 mins ago",
        icon: <ArrowUpRight size={16} className="alert-icon up" />,
    },
    {
        id: 2,
        type: "price_down",
        title: "Ethereum dropped below $3,400",
        time: "15 mins ago",
        icon: <ArrowDownRight size={16} className="alert-icon down" />,
    },
    {
        id: 3,
        type: "news",
        title: "New listing: Solana ecosystem token",
        time: "1 hour ago",
        icon: <Info size={16} className="alert-icon info" />,
    },
    {
        id: 4,
        type: "price_up",
        title: "Cardano (ADA) is up 5% today",
        time: "3 hours ago",
        icon: <ArrowUpRight size={16} className="alert-icon up" />,
    },
];

export default function Alerts() {
    return (
        <div className="alerts-container">
            <div className="alerts-header">
                <div className="header-left">
                    <Bell size={18} className="bell-icon" />
                    <h3 className="alerts-title">Recent Alerts</h3>
                </div>
                <button className="view-all-btn">View All</button>
            </div>

            <div className="alerts-list">
                {alertsData.map((alert) => (
                    <div key={alert.id} className="alert-item">
                        <div className="alert-left">
                            <div className={`icon-wrapper ${alert.type}`}>
                                {alert.icon}
                            </div>
                            <div className="alert-content">
                                <p className="alert-item-title">{alert.title}</p>
                                <span className="alert-time">{alert.time}</span>
                            </div>
                        </div>
                        <button className="alert-close">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <button className="setup-alert-btn">
                + Setup New Alert
            </button>
        </div>
    );
}
