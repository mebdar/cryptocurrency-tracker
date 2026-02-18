import logo from "../assets/logo.png.jpg";
import "./Navbar.css";

function Navbar({ search, setSearch }) {
    return (
        <div className="navbar">
            <div className="nav-left">
                <img src={logo} alt="Crypto Tracker" className="logo-img" />
            </div>

            <div className="nav-center">
                <input
                    type="text"
                    placeholder="Search coin..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="nav-right">
                <span>🔔</span>
                <span>⚙️</span>
                <span>🌙</span>

                <div className="profile">
                    <div className="avatar">E</div>
                    <div>
                        <p>Bireh</p>
                        <small>Verified</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
