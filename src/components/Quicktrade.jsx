import { useState } from "react";
import "./QuickTrade.css";

export default function QuickTrade() {
    const [tab, setTab] = useState("buy");

    return (
        <div className="quicktrade-card">
            <h3>Make quick trades</h3>

            {/* Buy / Sell Tabs */}
            <div className="trade-tabs">
                <button
                    className={tab === "buy" ? "active" : ""}
                    onClick={() => setTab("buy")}
                >
                    Buy
                </button>

                <button
                    className={tab === "sell" ? "active" : ""}
                    onClick={() => setTab("sell")}
                >
                    Sell
                </button>
            </div>

            {/* Spend */}
            <div className="trade-input">
                <label>Spend</label>
                <input type="number" placeholder="0.00" />
                <span>USDT</span>
            </div>

            {/* Receive */}
            <div className="trade-input">
                <label>Receive</label>
                <input type="number" placeholder="0.00" />
                <span>BTC</span>
            </div>

            {/* Button */}
            <button className="trade-btn">
                {tab === "buy" ? "Buy" : "Sell"}
            </button>
        </div>
    );
}
