import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getCoinOHLC, getCoins } from "../services/api";
import "./SalesChart.css";

export default function SalesChart({ selectedCoin: propSelectedCoin, onSelectCoin }) {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [coins, setCoins] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(propSelectedCoin || { id: "bitcoin", name: "Bitcoin", symbol: "btc" });

    // Sync state if prop changes
    useEffect(() => {
        if (propSelectedCoin && propSelectedCoin.id !== selectedCoin.id) {
            setSelectedCoin(propSelectedCoin);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propSelectedCoin]);

    // Fetch coins list for selection
    useEffect(() => {
        getCoins().then((data) => setCoins(data));
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            if (selectedCoin?.id) {
                setLoading(true);
                const data = await getCoinOHLC(selectedCoin.id);
                if (isMounted) {
                    setChartData([{ data }]);
                    setLoading(false);
                }
            }
        }

        fetchData();
        return () => { isMounted = false; };
    }, [selectedCoin]);

    const handleCoinChange = (e) => {
        const coin = coins.find(c => c.symbol.toUpperCase() === e.target.value);
        if (coin) {
            const newCoin = { id: coin.id, name: coin.name, symbol: coin.symbol };
            setSelectedCoin(newCoin);
            if (onSelectCoin) onSelectCoin(newCoin);
        }
    };

    const options = {
        chart: {
            type: 'candlestick',
            height: 250,
            toolbar: {
                show: false
            },
            background: 'transparent',
            foreColor: '#9ca3af'
        },
        title: {
            show: false
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#9ca3af',
                    fontSize: '10px'
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            },
            labels: {
                formatter: (val) => `$${val.toLocaleString()}`,
                style: {
                    colors: '#9ca3af',
                    fontSize: '10px'
                }
            }
        },
        grid: {
            borderColor: '#1f2937',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#22c55e',
                    downward: '#ef4444'
                },
                wick: {
                    useFillColor: true
                }
            }
        },
        tooltip: {
            theme: 'dark'
        }
    };

    return (
        <div className="sales-chart">
            <div className="sales-header">
                <h3>{selectedCoin?.name || "Market"} Sales chart</h3>
                <div className="side-controls">
                    <span className="timeframe">7D</span>
                    <select
                        value={selectedCoin?.symbol?.toUpperCase() || "BTC"}
                        onChange={handleCoinChange}
                    >
                        {coins.length > 0 ? (
                            coins.map(coin => (
                                <option key={coin.id} value={coin.symbol.toUpperCase()}>
                                    {coin.symbol.toUpperCase()}
                                </option>
                            ))
                        ) : (
                            <option>{selectedCoin?.symbol?.toUpperCase() || "BTC"}</option>
                        )}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                    Fetching market data...
                </div>
            ) : (
                <div className="chart-container">
                    <Chart
                        options={options}
                        series={chartData}
                        type="candlestick"
                        height={230}
                    />
                </div>
            )}

            <div className="legend">
                <span><span style={{ color: '#22c55e' }}>●</span> Bullish</span>
                <span><span style={{ color: '#ef4444' }}>●</span> Bearish</span>
            </div>
        </div>
    );
}