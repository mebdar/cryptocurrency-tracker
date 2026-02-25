import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/SupabaseClient";
import { LogOut, User, Settings, ShieldCheck } from "lucide-react";
import logo from "../assets/logo.png.jpg";
import EditProfileModal from "./EditProfileModal";
import "./Navbar.css";

function Navbar({ search, setSearch }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const metadata = user.user_metadata;
                setProfile({
                    username: metadata?.username || user.email.split("@")[0],
                    full_name: metadata?.full_name || "User",
                    avatar_url: metadata?.avatar_url || null
                });

                const { data, error } = await supabase
                    .from("profiles")
                    .select("username, full_name, avatar_url")
                    .eq("id", user.id)
                    .single();

                if (!error && data) {
                    setProfile(data);
                }
            }
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    const metadata = session.user.user_metadata;
                    setProfile({
                        username: metadata?.username || session.user.email.split("@")[0],
                        full_name: metadata?.full_name || "User",
                        avatar_url: metadata?.avatar_url || null
                    });
                } else {
                    setUser(null);
                    setProfile(null);
                }
            }
        );

        // Click outside detection
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            authListener.subscription.unsubscribe();
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsDropdownOpen(false);
        navigate("/login");
    };

    const displayName = profile?.full_name || profile?.username || user?.email?.split("@")[0] || "Guest";
    const initial = (profile?.full_name || profile?.username || "G").charAt(0).toUpperCase();

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
                <span className="icon">🔔</span>
                <span className="icon">⚙️</span>
                <span className="icon">🌙</span>

                <div className="profile-container-nav" ref={dropdownRef}>
                    <div
                        className="profile-trigger"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="avatar">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="avatar-img-small" />
                            ) : (
                                initial
                            )}
                        </div>
                        <div className="profile-meta">
                            <p>{displayName}</p>
                            <small>Verified</small>
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-header">
                                <div className="dropdown-avatar">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="avatar-img-dropdown" />
                                    ) : (
                                        initial
                                    )}
                                </div>
                                <div className="dropdown-user-info">
                                    <p className="dropdown-name">{profile?.full_name || "User"}</p>
                                    <p className="dropdown-email">{user?.email}</p>
                                </div>
                            </div>

                            <div className="dropdown-divider"></div>

                            <ul className="dropdown-menu">
                                <li className="dropdown-item" onClick={() => { setIsProfileModalOpen(true); setIsDropdownOpen(false); }}>
                                    <User size={16} />
                                    <span>My Profile</span>
                                </li>
                                <li className="dropdown-item">
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </li>
                                <li className="dropdown-item">
                                    <ShieldCheck size={16} />
                                    <span>Security</span>
                                </li>
                            </ul>

                            <div className="dropdown-divider"></div>

                            <button className="dropdown-logout" onClick={handleLogout}>
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                profile={profile}
                onProfileUpdate={(updatedProfile) => setProfile(updatedProfile)}
            />
        </div>
    );
}

export default Navbar;
