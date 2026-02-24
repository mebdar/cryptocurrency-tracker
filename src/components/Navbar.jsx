import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/SupabaseClient";
import logo from "../assets/logo.png.jpg";
import "./Navbar.css";

function Navbar({ search, setSearch }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Try to get profile from metadata first for speed
                const metadata = user.user_metadata;
                setProfile({
                    username: metadata?.username || user.email.split("@")[0],
                    full_name: metadata?.full_name || "User",
                    avatar_url: metadata?.avatar_url || null
                });

                // Fallback / Refresh from profiles table
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

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const displayName = profile?.username || user?.email?.split("@")[0] || "Guest";
    const initial = displayName.charAt(0).toUpperCase();

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

                <Link to="/profile" className="profile">
                    <div className="avatar">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="avatar-img-small" />
                        ) : (
                            initial
                        )}
                    </div>
                    <div>
                        <p>{displayName}</p>
                        <small>Verified</small>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;
