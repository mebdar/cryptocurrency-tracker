import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getCoins } from "./services/api";
import Layout from "./components/Layout";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);
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
