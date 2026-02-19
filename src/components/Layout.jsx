import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children, search, setSearch }) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Navbar search={search} setSearch={setSearch} />
            <div style={{ display: "flex" }}>
                <Sidebar />

                <div style={{ flex: 1, padding: 20, background: "#020617", minHeight: "100vh", color: "white" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
