import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import { Heart, Loader2, Bell } from "lucide-react";
import { supabase } from "../services/SupabaseClient";
import { getCoins } from "../services/api";

const Wishlist = ({ externalAlerts }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                if (!user) {
                    setLoading(false);
                    return;
                }

                let alertsData;
                if (externalAlerts) {
                    alertsData = externalAlerts;
                } else {
                    // 1. Fetch ALL alerts for the user
                    const { data, error } = await supabase
                        .from("alerts")
                        .select("coin_id, target_price, condition")
                        .eq("user_id", user.id);

                    if (error) throw error;
                    alertsData = data;
                }

                if (!alertsData || alertsData.length === 0) {
                    setWishlistItems([]);
                    setLoading(false);
                    return;
                }

                // 2. Group alerts by coin_id to see which coins have at least one alert
                const uniqueCoinIds = [...new Set(alertsData.map(a => a.coin_id))];

                // 3. Fetch live data for these coins
                const allCoins = await getCoins();
                const filtered = allCoins.filter(c => uniqueCoinIds.includes(c.id));

                // 4. Attach alerts to the coin data for display
                const itemsWithAlerts = filtered.map(coin => ({
                    ...coin,
                    alerts: alertsData.filter(a => a.coin_id === coin.id)
                }));

                setWishlistItems(itemsWithAlerts);
            } catch (error) {
                console.error("Error loading wishlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [externalAlerts]);

    const removeAllAlertsForCoin = async (coinId) => {
        if (!user) return;

        if (!window.confirm("Are you sure you want to remove all alerts for this coin? This will remove it from your wishlist.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from("alerts")
                .delete()
                .eq("user_id", user.id)
                .eq("coin_id", coinId);

            if (error) throw error;

            setWishlistItems(prev => prev.filter(item => item.id !== coinId));
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    if (loading) {
        return (
            <div className="wishlist-card loading-state">
                <Loader2 className="animate-spin" />
                <p>Loading your favorite coins...</p>
            </div>
        );
    }

    return (
        <div className="wishlist-card">
            <div className="wishlist-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Heart size={18} fill="red" color="red" />
                    <h3>Wishlist (Alert Driven)</h3>
                </div>
                <span className="dots">•••</span>
            </div>

            <div className="wishlist-list">
                {wishlistItems.length > 0 ? (
                    wishlistItems.map((item) => (
                        <div key={item.id} className="wishlist-item alert-driven">
                            <div className="wishlist-left">
                                <img src={item.image} alt={item.name} className="coin-avatar-img" />
                                <div>
                                    <p className="coin-name">{item.name}</p>
                                    <p className="coin-sub">{item.symbol.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="wishlist-middle">
                                <div className="active-alerts-tag">
                                    <Bell size={10} />
                                    <span>{item.alerts?.length} Active Alerts</span>
                                </div>
                            </div>

                            <div className="wishlist-right">
                                <span
                                    className={`coin-change ${item.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}
                                >
                                    {item.price_change_percentage_24h >= 0 ? "+" : ""}
                                    {item.price_change_percentage_24h?.toFixed(2)}%
                                </span>
                                <button
                                    className="heart-btn active"
                                    onClick={() => removeAllAlertsForCoin(item.id)}
                                    title="Remove all alerts for this coin"
                                >
                                    <Heart size={16} fill="red" color="red" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <Heart size={40} color="#334155" />
                        <p className="empty-msg">Your wishlist is empty. Set a price alert to add coins!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
