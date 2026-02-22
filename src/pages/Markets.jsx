import SalesChart from "../components/SalesChart";

export default function Markets() {
    return (
        <div style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
            <div style={{ width: "100%", maxWidth: "1000px" }}>
                <SalesChart />
            </div>
        </div>
    );
}
