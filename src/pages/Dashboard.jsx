import { useState, useEffect, useCallback } from "react";
import SalesChart from "../components/SalesChart";
import MarketOverview from "../components/MarketOverview";
import QuickTrade from "../components/Quicktrade";
import NotificationCard from "../components/NotificationCard";
import Alerts from "./Alerts";
import Wishlist from "./Wishlist";
import { supabase } from "../services/SupabaseClient";
import { getCoins } from "../services/api";

export default function Dashboard({ search, setSearch }) {
    const [selectedCoin, setSelectedCoin] = useState({ id: "bitcoin", name: "Bitcoin", symbol: "btc" });
    const [coins, setCoins] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [user, setUser] = useState(null);

    // Filter alerts by state
    const activeAlerts = alerts.filter(a => !a.is_triggered);

    /* ===============================
       1. APP INITIALIZATION
    =============================== */
    useEffect(() => {
        // Request Browser Notification Permission
        if ("Notification" in window) {
            Notification.requestPermission();
        }

        // Load User
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        loadUser();
    }, []);

    /* ===============================
       2. FETCH ALERTS
    =============================== */
    const fetchAlerts = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from("alerts")
            .select("*")
            .eq("user_id", user.id);

        if (!error && data) {
            setAlerts(data);
        }
    }, [user]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    /* ===============================
       3. FETCH PRICES (COINS)
    =============================== */
    useEffect(() => {
        const fetchPrices = async () => {
            const data = await getCoins();
            setCoins(data);
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const showBrowserNotification = useCallback((alert) => {
        if (Notification.permission === "granted") {
            new Notification("🚨 Price Alert Triggered!", {
                body: `${alert.coin_name} ${alert.condition} $${alert.target_price}`,
                icon: "/logo.png"
            });
        }
    }, []);

    const triggerAlert = useCallback(async (alert) => {
        const { error } = await supabase
            .from("alerts")
            .update({
                is_triggered: true,
                triggered_at: new Date()
            })
            .eq("id", alert.id);

        if (!error) {
            showBrowserNotification(alert);

            // send an email via Supabase Edge Function
            try {
                if (user?.email) {
                    const { error: funcError } = await supabase.functions.invoke("send-alert-email", {
                        body: {
                            email: user.email,
                            coin: alert.coin_name,
                            price: alert.target_price,
                            condition: alert.condition,
                        },
                    });

                    if (funcError) throw funcError;
                    console.log(`Email notification sent for ${alert.coin_name}`);
                } else {
                    console.warn("User email not found, skipping email notification");
                }
            } catch (err) {
                console.error("Failed to send alert email", err);
            }

            fetchAlerts(); // refresh UI
        }
    }, [fetchAlerts, showBrowserNotification, user]);

    /* ===============================
       4. PRICE CHECK LOGIC
    =============================== */
    const checkAlerts = useCallback(async (priceMap) => {
        // Use activeAlerts from closure (updated via fetchAlerts -> alerts state change)
        for (const alert of activeAlerts) {
            const currentPrice = priceMap[alert.coin_id];
            if (!currentPrice) continue;

            const shouldTrigger =
                (alert.condition === "above" && currentPrice >= alert.target_price) ||
                (alert.condition === "below" && currentPrice <= alert.target_price);

            if (shouldTrigger) {
                await triggerAlert(alert);
            }
        }
    }, [activeAlerts, triggerAlert]);

    /* ===============================
       5. TRIGGER CHECK ON PRICE UPDATE
    =============================== */
    useEffect(() => {
        if (coins.length && alerts.length) {
            const priceMap = {};
            coins.forEach((coin) => {
                priceMap[coin.id] = coin.current_price;
            });
            checkAlerts(priceMap);
        }
        // We only want to trigger this when coins (prices) change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coins]);

    return (
        <div
            style={{
                padding: "20px 40px",
                width: "100%",
                maxWidth: "1800px",
                margin: "0 auto",
                boxSizing: "border-box"
            }}
        >
            {/* HEADER */}
            <div style={{ marginBottom: "25px" }}>
                <h1
                    style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "white",
                        margin: 0
                    }}
                >
                    Dashboard
                </h1>
            </div>

            {/* MAIN GRID LAYOUT */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 0.9fr 380px",
                    gap: "30px",
                    alignItems: "start"
                }}
            >
                {/* LEFT COLUMN */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "30px"
                    }}
                >
                    <MarketOverview
                        search={search}
                        setSearch={setSearch}
                        onSelectCoin={setSelectedCoin}
                        selectedCoinId={selectedCoin.id}
                        externalCoins={coins} // Pass coins down
                        externalAlerts={alerts} // Pass alerts down
                        onRefreshAlerts={fetchAlerts}
                    />

                    <Alerts />
                </div>

                {/* MIDDLE COLUMN */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "30px"
                    }}
                >
                    <QuickTrade />
                    <Wishlist externalAlerts={alerts} />
                </div>
                {/* RIGHT COLUMN - NOTIFICATIONS */}
                <div className="notifications-column">
                    <NotificationCard
                        type="price-alert"
                        title="BTC Price Alert Triggered!"
                        subtitle="Bitcoin (BTC) has reached $55,000"
                        target="$55,000"
                    />

                    <NotificationCard
                        type="browser"
                        title="Browser Notification"
                        subtitle="BTC Price Alert Triggered!"
                        target="$54,000"
                    />

                    <NotificationCard
                        type="email"
                        title="Email Notification"
                        subtitle="BTC Price Alert Triggered!"
                        emailContent={{
                            currentPrice: "$55,010",
                            targetPrice: "$55,000",
                            condition: "Above"
                        }}
                    />
                </div>
            </div>

            {/* SALES CHART */}
            <div style={{ marginTop: "30px", height: "320px" }}>
                <SalesChart
                    selectedCoin={selectedCoin}
                    onSelectCoin={setSelectedCoin}
                />
            </div>
        </div>
    );
}