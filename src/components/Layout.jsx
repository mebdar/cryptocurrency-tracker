import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children, search, setSearch }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <Navbar search={search} setSearch={setSearch} />
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <Sidebar />

                <div style={{ flex: 1, padding: 20, background: "#020617", overflowY: "auto", color: "white" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
