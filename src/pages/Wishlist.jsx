import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import { Heart, Loader2 } from "lucide-react";
import { supabase } from "../services/SupabaseClient";
import { getCoins } from "../services/api";

const Wishlist = () => {
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

                // 1. Fetch wishlist from Supabase
                const { data: wishlistData, error: wishlistError } = await supabase
                    .from("wishlist")
                    .select("coin_id")
                    .eq("user_id", user.id);

                if (wishlistError) throw wishlistError;

                const coinIds = wishlistData.map(item => item.coin_id);

                if (coinIds.length === 0) {
                    setWishlistItems([]);
                    setLoading(false);
                    return;
                }

                // 2. Fetch live data for these coins
                // We fetch all coins from our limited top list for now
                const allCoins = await getCoins();
                const filtered = allCoins.filter(c => coinIds.includes(c.id));

                setWishlistItems(filtered);
            } catch (error) {
                console.error("Error loading wishlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const removeFromWishlist = async (coinId) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from("wishlist")
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
                <h3>My Wishlist</h3>
                <span className="dots">•••</span>
            </div>

            <div className="wishlist-list">
                {wishlistItems.length > 0 ? (
                    wishlistItems.map((item) => (
                        <div key={item.id} className="wishlist-item">
                            <div className="wishlist-left">
                                <img src={item.image} alt={item.name} className="coin-avatar-img" />
                                <div>
                                    <p className="coin-name">{item.name}</p>
                                    <p className="coin-sub">{item.symbol.toUpperCase()}</p>
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
                                    onClick={() => removeFromWishlist(item.id)}
                                >
                                    <Heart size={16} fill="red" color="red" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="empty-msg">Your wishlist is empty.</p>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
