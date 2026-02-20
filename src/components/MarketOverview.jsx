import { useEffect, useState } from "react";
import { getCoins } from "../services/api";
import "../styles/MarketOverview.css";

export default function MarketOverview() {
  const [coins, setCoins] = useState([]);
  const [tab, setTab] = useState("Popular"); // default tab

  useEffect(() => {
    getCoins().then((data) => setCoins(data));
  }, []);

  const filteredCoins =
    tab === "Popular"
      ? coins.slice(0, 10)
      : coins.slice(-10); // example: last 10 for "New Listing"

  if (!coins.length) return <p className="loading">Loading coins...</p>;

  return (
    <div className="market-wrapper">
      <h2 className="market-title">Market Overview</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={tab === "Popular" ? "active" : ""}
          onClick={() => setTab("Popular")}
        >
          Popular
        </button>
        <button
          className={tab === "New Listing" ? "active" : ""}
          onClick={() => setTab("New Listing")}
        >
          New Listing
        </button>
      </div>

      {/* Coins list */}
      <div className="coins-scroll">
        {filteredCoins.map((coin) => (
          <div key={coin.id} className="coin-card">
            <div className="coin-left">
              <img src={coin.image} alt={coin.name} />
              <h4>{coin.name}</h4>
            </div>
            <div>
              <p className="coin-price">${coin.current_price}</p>
              <span
                className={`animated-percent ${
                  coin.price_change_percentage_24h >= 0 ? "positive" : "negative"
                }`}
              >
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}