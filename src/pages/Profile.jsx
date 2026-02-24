import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/SupabaseClient";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    navigate("/login");
                    return;
                }

                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (error && error.code !== "PGRST116") {
                    console.error("Error fetching profile from database:", error.message);
                }

                const metadata = user.user_metadata;
                const mergedProfile = {
                    id: user.id,
                    username: data?.username || metadata?.username || user.email.split("@")[0],
                    full_name: data?.full_name || metadata?.full_name || "User",
                    email: user.email,
                    phone: data?.phone || metadata?.phone || "Not provided",
                    provider: user.app_metadata?.provider || "email",
                    avatar_url: data?.avatar_url || metadata?.avatar_url || null
                };

                setProfile(mergedProfile);

                // Auto-fix: If DB was missing data but we found it in metadata, update DB
                if (data && (!data.username || !data.full_name)) {
                    console.log("Restoring missing profile data from metadata...");
                    await supabase.from("profiles").update({
                        username: mergedProfile.username,
                        full_name: mergedProfile.full_name,
                        phone: mergedProfile.phone === "Not provided" ? null : mergedProfile.phone
                    }).eq("id", user.id);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [navigate]);

    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            console.log("Attempting to upload to bucket 'avatars'...");

            // 1. Upload to Supabase Storage
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error("Supabase Storage Error:", uploadError);
                if (uploadError.message === "bucket_not_found") {
                    throw new Error("The 'avatars' bucket does not exist. Please create it in your Supabase dashboard.");
                }
                throw uploadError;
            }

            console.log("Upload successful:", uploadData);

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            console.log("Generated Public URL:", publicUrl);

            // 3. Update Profile Table (using update instead of upsert to avoid wiping data)
            const { data: { user } } = await supabase.auth.getUser();
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    avatar_url: publicUrl,
                    updated_at: new Date(),
                })
                .eq('id', user.id);

            if (updateError) {
                console.error("Profile Table Update Error:", updateError);
                throw updateError;
            }

            // 4. Update Auth Metadata
            await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            setProfile({ ...profile, avatar_url: publicUrl });
            alert('Profile picture updated successfully!');

        } catch (error) {
            console.error("Full Upload Error:", error);
            alert(`Error: ${error.message || "Something went wrong during upload"}`);
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            navigate("/login");
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-card" style={{ textAlign: 'center' }}>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    const initial = profile?.username?.charAt(0).toUpperCase() || "?";

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar-upload-container">
                        <div className="profile-avatar-large">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="avatar-img-large" />
                            ) : (
                                initial
                            )}
                            <div className="avatar-overlay">
                                <span>{uploading ? "..." : "📷"}</span>
                                <input
                                    type="file"
                                    id="avatar-input"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="profile-info-header">
                        <h2>{profile?.full_name}</h2>
                        <p>@{profile?.username}</p>
                    </div>
                </div>

                <div className="profile-grid">
                    <div className="info-group">
                        <label>Username</label>
                        <div className="info-value">{profile?.username}</div>
                    </div>
                    <div className="info-group">
                        <label>Email Address</label>
                        <div className="info-value">{profile?.email}</div>
                    </div>
                    <div className="info-group">
                        <label>Phone Number</label>
                        <div className="info-value">{profile?.phone || "N/A"}</div>
                    </div>
                    <div className="info-group">
                        <label>Auth Provider</label>
                        <div className="info-value" style={{ textTransform: 'capitalize' }}>
                            {profile?.provider}
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <button onClick={handleLogout} className="logout-btn">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;