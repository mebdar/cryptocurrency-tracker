import { useState } from "react";
import SalesChart from "../components/SalesChart";
import MarketOverview from "../components/MarketOverview";
import QuickTrade from "../components/Quicktrade";
import NotificationCard from "../components/NotificationCard";
import Alerts from "../components/Alerts";

export default function Dashboard({ search, setSearch }) {
    const [selectedCoin, setSelectedCoin] = useState({ id: "bitcoin", name: "Bitcoin", symbol: "btc" });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                padding: "20px 40px",
                width: "100%",
                maxWidth: "1600px",
                margin: "0 auto",
                boxSizing: "border-box",
                overflowX: "hidden",
                position: "relative"
            }}
        >
            {/* PAGE HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "white", margin: 0 }}>Dashboard</h1>
            </div>

            {/* MAIN CONTENT - 3 COLUMN GRID */}
            <div style={{ display: "flex", gap: "30px", width: "100%", flexWrap: "wrap", alignItems: "flex-start" }}>

                {/* COLUMN 1 - Market Overview (Left) */}
                <div style={{ flex: "1.2 1 400px", minWidth: "350px", display: "flex", flexDirection: "column", gap: "30px" }}>
                    <MarketOverview
                        search={search}
                        setSearch={setSearch}
                        onSelectCoin={setSelectedCoin}
                        selectedCoinId={selectedCoin.id}
                    />
                    <Alerts />
                </div>

                {/* COLUMN 2 - Quick Trade (Middle) */}
                <div style={{ flex: "0.8 1 300px", minWidth: "300px", display: "flex", flexDirection: "column", gap: "30px" }}>
                    <QuickTrade />
                    <Alerts />
                </div>

                {/* COLUMN 3 - Notifications (Right) */}
                <div style={{ flex: "0.8 1 320px", minWidth: "320px", display: "flex", flexDirection: "column", gap: "20px" }}>
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
                        onView={() => console.log("View email alert")}
                        onClose={() => console.log("Close email alert")}
                        emailContent={{
                            currentPrice: "$55,010",
                            targetPrice: "$55,000",
                            condition: "Above"
                        }}
                    />
                </div>
            </div>

            {/* BOTTOM SECTION - Sales Chart */}
            <div style={{ width: "100%", height: "300px", marginTop: "10px" }}>
                <SalesChart
                    selectedCoin={selectedCoin}
                    onSelectCoin={setSelectedCoin}
                />
            </div>
        </div>
    );
}
