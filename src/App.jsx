import MarketOverview from "./pages/MarketOverview";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getCoins } from "./services/api";
import Layout from "./components/Layout";
import QuickTrade from "./components/QuickTrade";

import "./App.css";
import { Transactions } from "./pages/Transactions";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");


  return (
    <Layout search={search} setSearch={setSearch}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />
        <Route
          path="/market-overview"
          element={
            // <div>
            //   {/* Top scrollable MarketOverview section */}
            //   <div className="dashboard-top-section">

            //   </div>

            //   {/* Optional other dashboard sections */}
            //   {/* You can add charts or coin list here */}
            // </div>

            <MarketOverview coins={filteredCoins} />
          }
        />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Layout>
  );
}

export default App;
