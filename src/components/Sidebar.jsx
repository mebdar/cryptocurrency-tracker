import "./Sidebar.css";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2 className="logo">⚡ CryptoDashboard</h2>

            <ul className="menu">
                <li className="active">Dashboard</li>
                <li>Markets</li>
                <li>Transactions</li>
                <li>Payment</li>
                <li>Info</li>
            </ul>
        </div>
    );
}
