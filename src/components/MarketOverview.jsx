import { useEffect, useState } from "react";
import { getCoins } from "../services/api";
import { Search, Heart, Bell, ArrowUpRight, ChevronDown } from "lucide-react";
import { supabase } from "../services/SupabaseClient";
import "./MarketOverview.css";

export default function MarketOverview({
  search,
  setSearch,
  onSelectCoin,
  selectedCoinId,
}) {
  const [coins, setCoins] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  /* ===============================
     LOAD COINS
  =============================== */
  useEffect(() => {
    getCoins().then((data) => {
      setCoins(data);
    });
  }, []);

  /* ===============================
     LOAD USER + WISHLIST
  =============================== */
  useEffect(() => {
    const loadUserAndWishlist = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) {
        setLoadingWishlist(false);
        return;
      }

      const { data, error } = await supabase
        .from("wishlist")
        .select("coin_id");

      if (!error && data) {
        setWishlist(data.map((item) => item.coin_id));
      }

      setLoadingWishlist(false);
    };

    loadUserAndWishlist();
  }, []);

  /* ===============================
     TOGGLE WISHLIST
  =============================== */
  const toggleWishlist = async (coinId, e) => {
    e.stopPropagation(); // prevent row click

    if (!user) {
      console.log("User not logged in");
      return;
    }

    const isInWishlist = wishlist.includes(coinId);

    if (isInWishlist) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("coin_id", coinId);

      if (!error) {
        setWishlist((prev) => prev.filter((id) => id !== coinId));
      }
    } else {
      const { error } = await supabase.from("wishlist").insert({
        user_id: user.id,
        coin_id: coinId,
      });

      if (!error) {
        setWishlist((prev) => [...prev, coinId]);
      } else if (error.code === "23505") {
        console.log("Already in wishlist");
      }
    }
  };

  /* ===============================
     FILTER COINS
  =============================== */
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
          {filteredCoins.map((coin) => (
            <div
              key={coin.id}
              className={`table-row ${selectedCoinId === coin.id ? "selected" : ""
                }`}
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
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="coin-logo"
                />
                <div className="coin-text">
                  <span className="coin-name">{coin.name}</span>
                  <span className="coin-symbol">
                    {coin.symbol.toUpperCase()}
                  </span>
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
                  className={`percent-value ${coin.price_change_percentage_24h >= 0
                    ? "positive"
                    : "negative"
                    }`}
                >
                  {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>

              {/* Actions */}
              <div className="col-actions row-actions">
                {/* Wishlist Button */}
                <button
                  className="action-btn"
                  onClick={(e) => toggleWishlist(coin.id, e)}
                  disabled={loadingWishlist}
                >
                  <Heart
                    size={14}
                    fill={
                      wishlist.includes(coin.id) ? "red" : "none"
                    }
                    color={
                      wishlist.includes(coin.id)
                        ? "red"
                        : "currentColor"
                    }
                  />
                </button>

                {/* Alert Button (future feature) */}
                <button
                  className="action-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Bell size={14} />
                </button>

                {/* External Link */}
                <button
                  className="action-btn-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowUpRight size={14} />
                </button>
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