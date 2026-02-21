import SalesChart from "../components/SalesChart";
import MarketOverview from "../components/MarketOverview";
import QuickTrade from "../components/Quicktrade";

export default function Dashboard() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",           // balanced vertical spacing
                padding: "20px",       // breathing room
                width: "100%",
                maxWidth: "100%",      // full width
                margin: "0",           // remove centering
                boxSizing: "border-box",
            }}
        >
            {/* TOP SECTION */}
            <div style={{ display: "flex", gap: "40px", width: "100%" }}>
                {/* LEFT SIDE - Market Overview */}
                <div
                    style={{
                        flex: 0.6,
                        minWidth: 0,
                    }}
                >
                    <MarketOverview />
                </div>

                {/* RIGHT SIDE - Quick Trade Panel */}
                <div
                    style={{
                        flex: 0.4,
                        minWidth: 0,
                    }}
                >
                    <QuickTrade />
                </div>
            </div>

            {/* BOTTOM SECTION - Sales Chart */}
            <div style={{ width: "80%", height: "250px" }}>
                <SalesChart />
            </div>
        </div>
    );
}
