import { useEffect, useState } from "react";
import { getCoins } from "../services/api";
import "./MarketOverview.css";

export default function MarketOverview({ search, onSelectCoin, selectedCoinId }) {
  const [coins, setCoins] = useState([]);
  const [tab, setTab] = useState("Popular"); // default tab

  useEffect(() => {
    getCoins().then((data) => {
      setCoins(data);
      // Optional: set initial selected coin if not set
    });
  }, []);

  const filteredCoins = coins
    .filter((coin) =>
      coin.name.toLowerCase().includes(search?.toLowerCase() || "")
    )
    .slice(
      tab === "Popular" ? 0 : -10,
      tab === "Popular" ? 10 : undefined
    );

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
          <div
            key={coin.id}
            className={`coin-card ${selectedCoinId === coin.id ? 'selected' : ''}`}
            onClick={() => onSelectCoin({ id: coin.id, name: coin.name, symbol: coin.symbol })}
            style={{ cursor: 'pointer' }}
          >
            <div className="coin-left">
              <img src={coin.image} alt={coin.name} />
              <h4>{coin.name}</h4>
            </div>
            <div>
              <p className="coin-price">${coin.current_price.toLocaleString()}</p>
              <span
                className={`animated-percent ${coin.price_change_percentage_24h >= 0 ? "positive" : "negative"
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