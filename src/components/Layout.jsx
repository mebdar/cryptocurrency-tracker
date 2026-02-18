import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1 }}>
                <Topbar />
                <div style={{ padding: 20, background: "#020617", minHeight: "100vh", color: "white" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
