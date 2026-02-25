import { useState } from "react";
import { ArrowDownUp, Info } from "lucide-react";
import "./QuickTrade.css";

export default function QuickTrade() {
    const [tab, setTab] = useState("buy");

    return (
        <div className="quicktrade-container">
            <div className="quicktrade-header">
                <h3 className="quicktrade-title">Quick Trade</h3>
                <Info size={16} className="info-icon" />
            </div>

            <div className="trade-toggle">
                <button
                    className={`toggle-btn ${tab === "buy" ? "active buy" : ""}`}
                    onClick={() => setTab("buy")}
                >
                    Buy
                </button>
                <button
                    className={`toggle-btn ${tab === "sell" ? "active sell" : ""}`}
                    onClick={() => setTab("sell")}
                >
                    Sell
                </button>
            </div>

            <div className="trade-inputs">
                <div className="input-group">
                    <label>Spend</label>
                    <div className="input-field">
                        <input type="number" placeholder="0.00" />
                        <span className="currency">USDT</span>
                    </div>
                </div>

                <div className="swap-icon-wrapper">
                    <ArrowDownUp size={16} />
                </div>

                <div className="input-group">
                    <label>Receive</label>
                    <div className="input-field">
                        <input type="number" placeholder="0.00" />
                        <span className="currency">BTC</span>
                    </div>
                </div>
            </div>

            <div className="trade-info">
                <span className="info-label">Available Balance</span>
                <span className="info-value">1,245.50 USDT</span>
            </div>

            <button className={`trade-submit-btn ${tab}`}>
                {tab === "buy" ? "Buy Bitcoin" : "Sell Bitcoin"}
            </button>
        </div>
    );
}

