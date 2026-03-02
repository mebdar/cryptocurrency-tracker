import React, { useState, useEffect } from "react";
import { X, Bell, Info } from "lucide-react";
import "./PriceAlertModal.css";
import { supabase } from "../services/SupabaseClient";

const PriceAlertModal = ({ isOpen, onClose, coin, onAlertSaved }) => {
    const [targetPrice, setTargetPrice] = useState("");
    const [condition, setCondition] = useState("above"); // "above" or "below"
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (coin) {
            setTargetPrice(coin.current_price?.toString() || "");
        }
    }, [coin]);

    if (!isOpen || !coin) return null;

    const handleSave = async () => {
        if (!user) {
            alert("Please log in to set alerts");
            return;
        }

        if (!targetPrice || isNaN(targetPrice)) {
            alert("Please enter a valid target price");
            return;
        }

        setLoading(true);
        try {
            console.log("Saving alert for user:", user);
            const { data, error } = await supabase.from("alerts").insert([
                {
                    user_id: user.id,
                    coin_id: coin.id,
                    coin_name: coin.name,
                    target_price: parseFloat(targetPrice),
                    condition: condition,
                },
            ]);

            console.log("Insert result:", { data, error });

            if (error) throw error;

            onAlertSaved(coin.id);
            onClose();
        } catch (error) {
            console.error("Error saving alert:", error);
            alert("Failed to save alert. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content profile-style-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-x" onClick={onClose}>
                    <X size={20} />
                </button>

                <h2 className="modal-title-centered">Set Price Alert</h2>

                <div className="modal-avatar-section">
                    <div className="coin-avatar-circle">
                        <img src={coin.image} alt={coin.name} />
                    </div>
                    <div className="coin-info-badge">
                        {coin.name} ({coin.symbol?.toUpperCase()})
                    </div>
                </div>

                <div className="modal-form-body">
                    <div className="form-input-group">
                        <label>Target Price (USD)</label>
                        <input
                            type="number"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                            placeholder="0.00"
                            step="any"
                            className="profile-style-input"
                        />
                    </div>

                    <div className="form-input-group">
                        <label>Alert when price is</label>
                        <div className="condition-select-wrapper">
                            <select
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                className="profile-style-select"
                            >
                                <option value="above">Above Target</option>
                                <option value="below">Below Target</option>
                            </select>
                        </div>
                    </div>

                    <p className="modal-helper-text">
                        Current Price: ${coin.current_price?.toLocaleString()}
                    </p>
                </div>

                <button
                    className="modal-primary-btn"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Alert"}
                </button>
            </div>
        </div>
    );
};

export default PriceAlertModal;
