import React from "react";
import "./Wishlist.css";
import { Heart } from "lucide-react";

const wishlistData = [
    {
        name: "Bitcoin",
        subtitle: "Scopook",
        change: "+2.49%",
        positive: true,
    },
    {
        name: "Ethereum",
        subtitle: "$2,950.78",
        change: "-1.14%",
        positive: false,
    },
    {
        name: "Solana",
        subtitle: "$115.60",
        change: "+1.88%",
        positive: true,
    },
];

const Wishlist = () => {
    return (
        <div className="wishlist-card">
            <div className="wishlist-header">
                <h3>My Wishlist</h3>
                <span className="dots">•••</span>
            </div>

            <div className="wishlist-list">
                {wishlistData.map((item, index) => (
                    <div key={index} className="wishlist-item">
                        <div className="wishlist-left">
                            <div className="coin-avatar" />
                            <div>
                                <p className="coin-name">{item.name}</p>
                                <p className="coin-sub">{item.subtitle}</p>
                            </div>
                        </div>

                        <div className="wishlist-right">
                            <span
                                className={`coin-change ${item.positive ? "positive" : "negative"
                                    }`}
                            >
                                {item.change}
                            </span>
                            <button className="heart-btn">
                                <Heart size={16} fill="white" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
