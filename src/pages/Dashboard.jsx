import MarketOverview from "../components/MarketOverview";
import QuickTrade from "../components/Quicktrade";

export default function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",           // spacing between panels
        padding: "20px",
        width: "100%",
        maxWidth: "1200px",    // prevents too wide layout
        margin: "0 auto",      // center dashboard
        boxSizing: "border-box",
        minHeight: "100vh",    // fill screen height
      }}
    >
      {/* LEFT SIDE - Market Overview */}
      <div
        style={{
          flex: 0.6,           // smaller fraction, compact
          minWidth: 0,         // allows inner scroll
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
  );
}