import { useState, useEffect } from "react";
import { Bell, ArrowUpRight, ArrowDownRight, Info, X } from "lucide-react";
import { supabase } from "../services/SupabaseClient";
import "./Alerts.css";

export default function Alerts({ alerts: externalAlerts }) {
    const [fetchedAlerts, setFetchedAlerts] = useState([]);

    useEffect(() => {
        if (externalAlerts) return;

        const fetchAlerts = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("alerts")
                .select("*")
                .eq("user_id", user.id);

            if (!error && data) {
                setFetchedAlerts(data);
            }
        };

        fetchAlerts();
    }, [externalAlerts]);

    const displayAlerts = (externalAlerts || fetchedAlerts).filter(a => a.is_triggered);

    // Sort triggered alerts by time descending
    const sortedAlerts = [...displayAlerts].sort((a, b) => {
        const dateA = a.triggered_at ? new Date(a.triggered_at) : new Date(0);
        const dateB = b.triggered_at ? new Date(b.triggered_at) : new Date(0);
        return dateB - dateA;
    });

    const getTimeAgo = (date) => {
        if (!date) return "Just now";
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString();
    };

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
                {sortedAlerts.length > 0 ? (
                    sortedAlerts.map((alert) => (
                        <div key={alert.id} className="alert-item">
                            <div className="alert-left">
                                <div className={`icon-wrapper ${alert.condition === "above" ? "price_up" : "price_down"}`}>
                                    {alert.condition === "above" ? (
                                        <ArrowUpRight size={16} className="alert-icon up" />
                                    ) : (
                                        <ArrowDownRight size={16} className="alert-icon down" />
                                    )}
                                </div>
                                <div className="alert-content">
                                    <p className="alert-item-title">
                                        {alert.coin_name || alert.coin_id} reached ${alert.target_price}
                                    </p>
                                    <span className="alert-time">{getTimeAgo(alert.triggered_at)}</span>
                                </div>
                            </div>
                            <button className="alert-close">
                                <X size={14} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-alerts" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                        <Info size={20} style={{ marginBottom: "8px" }} />
                        <p style={{ fontSize: "12px" }}>No recent alerts triggered.</p>
                    </div>
                )}
            </div>

            <button className="setup-alert-btn">
                + Setup New Alert
            </button>
        </div>
    );
}
