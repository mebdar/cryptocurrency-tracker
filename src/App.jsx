import MarketOverview from "./components/MarketOverview";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getCoins } from "./services/api";
import Layout from "./components/Layout";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCoins().then((data) => {
      setCoins(data);
    });
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!coins.length) return <p>Loading coins...</p>;

  return (
    <Layout search={search} setSearch={setSearch}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
  path="/dashboard"
  element={
    <div>
      {/* Top scrollable MarketOverview section */}
      <div className="dashboard-top-section">
        <MarketOverview coins={filteredCoins} />
      </div>

      {/* Optional other dashboard sections */}
      {/* You can add charts or coin list here */}
    </div>
  }
/>




        <Route path="/markets" element={<h2>Markets coming soon...</h2>} />
        <Route path="/transactions" element={<h2>Transactions coming soon...</h2>} />
        <Route path="/payment" element={<h2>Payment coming soon...</h2>} />
        <Route path="/analytics" element={<h2>Analytics coming soon...</h2>} />
      </Routes>
    </Layout>
  );
}

export default App;
