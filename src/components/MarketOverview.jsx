// src/components/MarketOverview.jsx
import "./MarketOverview.css";

export default function MarketOverview({ coins }) {
  return (
    <div className="market-overview">
      <h2>Markets Overview</h2>
      <div className="coins-container">
        {coins.map((coin) => (
          <div key={coin.id} className="coin-card">
            <img src={coin.image} alt={coin.name} width="30" />
            <h4>{coin.name}</h4>
            <p>${coin.current_price.toLocaleString()}</p>
            <span
              className={
                coin.price_change_percentage_24h >= 0 ? "positive" : "negative"
              }
            >
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
