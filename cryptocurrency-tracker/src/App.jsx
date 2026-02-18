import { useEffect, useState } from "react";
import { getCoins } from "./services/api";
import "./App.css";

function App() {
  // ✅ State
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch data on mount
  useEffect(() => {
    getCoins().then((data) => {
      setCoins(data);
    });
  }, []);

  // ✅ Filter coins by search input
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Render UI
  if (!coins.length) {
    return <p>Loading coins...</p>;
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>Crypto Tracker</h1>

      <input
        type="text"
        placeholder="Search coin..."
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          margin: "20px",
          width: "200px",
          fontSize: "16px",
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {filteredCoins.map((coin) => (
          <div
            key={coin.id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
              borderRadius: "8px",
              width: "150px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <img src={coin.image} alt={coin.name} width="40" />
            <h3>{coin.name}</h3>
            <p>Price: ${coin.current_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
