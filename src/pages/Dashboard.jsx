import { useEffect, useState } from "react";
import { getCoins } from "../services/api";
import QuickTrade from "../components/Quicktrade";

export default function Dashboard() {
    const search = "";

    const [coins, setCoins] = useState([]);
    useEffect(() => {
        getCoins().then((data) => {
            setCoins(data);
        });
    }, []);

    const filteredCoins = coins.filter((coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase())
    );





    if (!coins.length) return <p>Loading coins...</p>;

    return <div style={{ display: "flex", gap: "20px" }}>

        {/* LEFT SIDE - Market Cards */}
        <div style={{ flex: 2, display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {filteredCoins.map((coin) => (
                <div
                    key={coin.id}
                    style={{
                        background: "#111827",
                        padding: "15px",
                        borderRadius: "12px",
                        width: "180px",
                        color: "white",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                    }}
                >
                    <img src={coin.image} alt={coin.name} width="40" />
                    <h3>{coin.name}</h3>
                    <p>${coin.current_price}</p>
                </div>
            ))}
        </div>

        {/* RIGHT SIDE - Quick Trade Panel */}
        <div style={{ flex: 1 }}>
            <QuickTrade />
        </div>

    </div>
}