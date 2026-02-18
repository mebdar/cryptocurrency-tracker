import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getCoins } from "./services/api";
import Layout from "./components/Layout";
import "./App.css";

function App() {
  // State
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch coins
  useEffect(() => {
    getCoins().then((data) => {
      setCoins(data);
    });
  }, []);

  // Filter coins
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!coins.length) return <p>Loading coins...</p>;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <>
            {/* Search input inside dashboard */}
            <input
              type="text"
              placeholder="Search coin..."
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px",
                marginBottom: "20px",
                width: "250px",
                borderRadius: "20px",
                border: "none",
                background: "#111827",
                color: "white",
              }}
            />

            {/* Coins Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              {filteredCoins.map((coin) => (
                <div
                  key={coin.id}
                  style={{
                    background: "#111827",
                    padding: "15px",
                    borderRadius: "12px",
                    width: "180px",
                    color: "white",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                  }}
                >
                  <img src={coin.image} alt={coin.name} width="40" />
                  <h3>{coin.name}</h3>
                  <p>${coin.current_price}</p>
                </div>
              ))}
            </div>
          </>
        } />
        {/* Placeholder routes for others */}
        <Route path="/markets" element={<h2>Markets coming soon...</h2>} />
        <Route path="/transactions" element={<h2>Transactions coming soon...</h2>} />
        <Route path="/payment" element={<h2>Payment coming soon...</h2>} />
        <Route path="/analytics" element={<h2>Analytics coming soon...</h2>} />
      </Routes>
    </Layout>
  );
}

export default App;
