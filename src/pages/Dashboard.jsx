import { useState } from "react";
import SalesChart from "../components/SalesChart";
import MarketOverview from "../components/MarketOverview";
import QuickTrade from "../components/Quicktrade";
import NotificationCard from "../components/NotificationCard";
import Alerts from "./Alerts";
import Wishlist from "./Wishlist";

export default function Dashboard({ search, setSearch }) {
    const [selectedCoin, setSelectedCoin] = useState({
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "btc"
    });

    return (
        <div
            style={{
                padding: "20px 40px",
                width: "100%",
                maxWidth: "1800px",
                margin: "0 auto",
                boxSizing: "border-box"
            }}
        >
            {/* HEADER */}
            <div style={{ marginBottom: "25px" }}>
                <h1
                    style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "white",
                        margin: 0
                    }}
                >
                    Dashboard
                </h1>
            </div>

            {/* MAIN GRID LAYOUT */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 0.9fr 380px",
                    gap: "30px",
                    alignItems: "start"
                }}
            >
                {/* LEFT COLUMN */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "30px"
                    }}
                >
                    <MarketOverview
                        search={search}
                        setSearch={setSearch}
                        onSelectCoin={setSelectedCoin}
                        selectedCoinId={selectedCoin.id}
                    />

                    <Alerts />
                </div>

                {/* MIDDLE COLUMN */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "30px"
                    }}
                >
                    <QuickTrade />
                    <Wishlist />
                </div>
{/* RIGHT COLUMN - NOTIFICATIONS */}
<div className="notifications-column">
    <NotificationCard
        type="price-alert"
        title="BTC Price Alert Triggered!"
        subtitle="Bitcoin (BTC) has reached $55,000"
        target="$55,000"
    />

    <NotificationCard
        type="browser"
        title="Browser Notification"
        subtitle="BTC Price Alert Triggered!"
        target="$54,000"
    />

    <NotificationCard
        type="email"
        title="Email Notification"
        subtitle="BTC Price Alert Triggered!"
        emailContent={{
            currentPrice: "$55,010",
            targetPrice: "$55,000",
            condition: "Above"
        }}
    />
</div>
            </div>

            {/* SALES CHART */}
            <div style={{ marginTop: "30px", height: "320px" }}>
                <SalesChart
                    selectedCoin={selectedCoin}
                    onSelectCoin={setSelectedCoin}
                />
            </div>
        </div>
    );
}