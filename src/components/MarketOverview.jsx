import { useEffect, useState } from "react";
import { getCoins } from "../services/api";
import { Search, Heart, Bell, ArrowUpRight, ChevronDown } from "lucide-react";
import { supabase } from "../services/SupabaseClient";
import PriceAlertModal from "./PriceAlertModal";
import "./MarketOverview.css";

export default function MarketOverview({
  search,
  setSearch,
  onSelectCoin,
  selectedCoinId,
  externalCoins, // From Dashboard
  externalAlerts, // From Dashboard
  onRefreshAlerts
}) {
  const [coins, setCoins] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoinForAlert, setSelectedCoinForAlert] = useState(null);

  /* ===============================
     LOAD COINS (if no external)
  =============================== */
  useEffect(() => {
    if (!externalCoins) {
      getCoins().then((data) => {
        setCoins(data);
      });
    }
  }, [externalCoins]);

  const displayCoins = externalCoins || coins;

  /* ===============================
     LOAD USER + ALERTS (if no external)
  =============================== */
  useEffect(() => {
    const loadUserAndAlerts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) {
        setLoadingAlerts(false);
        return;
      }

      if (externalAlerts) {
        setLoadingAlerts(false);
      } else {
        const { data, error } = await supabase
          .from("alerts")
          .select("coin_id")
          .eq("user_id", user.id);

        if (!error && data) {
          setAlerts(data.map((item) => item.coin_id));
        }
        setLoadingAlerts(false);
      }
    };

    loadUserAndAlerts();
  }, [externalAlerts]);

  const displayAlerts = externalAlerts ? externalAlerts.map(a => a.coin_id) : alerts;

  /* ===============================
     HEART CLICK -> TOGGLE ALERT
  =============================== */
  const handleHeartClick = async (coin, e) => {
    e.stopPropagation(); // prevent row click

    if (!user) {
      alert("Please log in to set alerts");
      return;
    }

    const hasAlert = displayAlerts.includes(coin.id);

    if (hasAlert) {
      if (window.confirm(`Remove all alerts for ${coin.name}? This will remove it from your wishlist.`)) {
        try {
          const { error } = await supabase
            .from("alerts")
            .delete()
            .eq("user_id", user.id)
            .eq("coin_id", coin.id);

          if (error) throw error;

          if (onRefreshAlerts) {
            onRefreshAlerts();
          } else {
            setAlerts(prev => prev.filter(id => id !== coin.id));
          }
        } catch (error) {
          console.error("Error removing alert:", error);
          alert("Failed to remove alert");
        }
      }
    } else {
      setSelectedCoinForAlert(coin);
      setIsModalOpen(true);
    }
  };

  const handleAlertSaved = (coinId) => {
    if (onRefreshAlerts) {
      onRefreshAlerts();
    } else if (!displayAlerts.includes(coinId)) {
      setAlerts((prev) => [...prev, coinId]);
    }
  };

  /* ===============================
     FILTER COINS
  =============================== */
  const filteredCoins = displayCoins
    .filter((coin) =>
      coin.name.toLowerCase().includes(search?.toLowerCase() || "")
    )
    .slice(0, 10);

  if (!displayCoins.length) return <p className="loading">Loading coins...</p>;

  return (
    <div className="market-container">
      <div className="market-header">
        <h2 className="market-title">Market Overview</h2>
      </div>

      {/* Search */}
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

      {/* Table */}
      <div className="market-table">
        <div className="table-header">
          <span className="col-coin">Coin</span>
          <span className="col-price">Price</span>
          <span className="col-change">24h Change</span>
          <span className="col-actions">
            Actions <ChevronDown size={12} />
          </span>
        </div>

        <div className="table-body">
          {filteredCoins.map((coin) => {
            const hasAlert = displayAlerts.includes(coin.id);
            return (
              <div
                key={coin.id}
                className={`table-row ${selectedCoinId === coin.id ? "selected" : ""}`}
                onClick={() =>
                  onSelectCoin({
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                  })
                }
              >
                {/* Coin Info */}
                <div className="col-coin coin-info">
                  <img src={coin.image} alt={coin.name} className="coin-logo" />
                  <div className="coin-text">
                    <span className="coin-name">{coin.name}</span>
                    <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="col-price">
                  <span className="price-value">
                    ${coin.current_price.toLocaleString()}
                  </span>
                </div>

                {/* Change */}
                <div className="col-change">
                  <span
                    className={`percent-value ${coin.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}
                  >
                    {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>

                {/* Actions */}
                <div className="col-actions row-actions">
                  {/* Heart / Alert Button */}
                  <button
                    className="action-btn"
                    onClick={(e) => handleHeartClick(coin, e)}
                    disabled={loadingAlerts}
                  >
                    <Heart
                      size={14}
                      fill={hasAlert ? "red" : "none"}
                      color={hasAlert ? "red" : "currentColor"}
                    />
                  </button>

                  {/* Alert Button (redundant now but keeping UI) */}
                  <button className="action-btn" onClick={(e) => handleHeartClick(coin, e)}>
                    <Bell size={14} />
                  </button>

                  {/* External Link */}
                  <button className="action-btn-link" onClick={(e) => e.stopPropagation()}>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="manage-alerts-btn">
        Manage Alerts <span>›</span>
      </button>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coin={selectedCoinForAlert}
        onAlertSaved={handleAlertSaved}
      />
    </div>
  );
}
