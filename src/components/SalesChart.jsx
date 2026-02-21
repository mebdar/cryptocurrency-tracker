import "./SalesChart.css";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Jan", volume: 400 },
    { name: "Feb", volume: 300 },
    { name: "Mar", volume: 500 },
    { name: "Apr", volume: 280 },
    { name: "May", volume: 600 },
    { name: "Jun", volume: 450 },
    { name: "Jul", volume: 350 },
    { name: "Aug", volume: 520 },
    { name: "Sep", volume: 480 },
];

export default function SalesChart() {
    return (
        <div className="sales-chart">
            <div className="sales-header">
                <h3>Sales chart</h3>

                <select>
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>BNB</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="volume" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            <div className="legend">
                <span>● Trading Volume</span>
                <span>● Price</span>
                <span>● Percentage Change</span>
            </div>
        </div>
    );
}