import { useEffect, useState } from "react";
import { getCoins } from "../services/api";
import { Search, Heart, Bell, ArrowUpRight, ChevronDown } from "lucide-react";
import "./MarketOverview.css";

export default function MarketOverview({ search, setSearch, onSelectCoin, selectedCoinId }) {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    getCoins().then((data) => {
      setCoins(data);
    });
  }, []);

  const filteredCoins = coins
    .filter((coin) =>
      coin.name.toLowerCase().includes(search?.toLowerCase() || "")
    )
    .slice(0, 10);

  if (!coins.length) return <p className="loading">Loading coins...</p>;

  return (
    <div className="market-container">
      <div className="market-header">
        <h2 className="market-title">Market Overview</h2>
      </div>

      <div className="search-bar-container">
        <Search size={12} className="search-bar-icon" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="market-search-input"
        />
      </div>

      <div className="market-table">
        <div className="table-header">
          <span className="col-coin">Coin</span>
          <span className="col-price">Price</span>
          <span className="col-change">24h Change</span>
          <span className="col-actions">Actions <ChevronDown size={12} /></span>
        </div>

        <div className="table-body">
          {filteredCoins.map((coin) => (
            <div
              key={coin.id}
              className={`table-row ${selectedCoinId === coin.id ? 'selected' : ''}`}
              onClick={() => onSelectCoin({ id: coin.id, name: coin.name, symbol: coin.symbol })}
            >
              <div className="col-coin coin-info">
                <img src={coin.image} alt={coin.name} className="coin-logo" />
                <div className="coin-text">
                  <span className="coin-name">{coin.name}</span>
                  <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                </div>
              </div>

              <div className="col-price">
                <span className="price-value">${coin.current_price.toLocaleString()}</span>
              </div>

              <div className="col-change">
                <span className={`percent-value ${coin.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}>
                  {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>

              <div className="col-actions row-actions">
                <button className="action-btn"><Heart size={14} /></button>
                <button className="action-btn"><Bell size={14} /></button>
                <button className="action-btn-link"><ArrowUpRight size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="manage-alerts-btn">
        Manage Alerts <span>›</span>
      </button>
    </div>
  );
}
