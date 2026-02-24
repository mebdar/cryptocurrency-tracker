import { useState, useEffect } from "react";
import { X, Camera, ChevronDown } from "lucide-react";
import { supabase } from "../services/SupabaseClient";
import "./EditProfileModal.css";

export default function EditProfileModal({ isOpen, onClose, profile, onProfileUpdate }) {
    const [fullName, setFullName] = useState(profile?.full_name || "");
    const [username, setUsername] = useState(profile?.username || "");
    const [phone, setPhone] = useState(profile?.phone || "");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "");
            setUsername(profile.username || "");
            setPhone(profile.phone || "");
        }
    }, [profile]);

    if (!isOpen) return null;

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

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { data: { user } } = await supabase.auth.getUser();
            await supabase.from('profiles').update({ avatar_url: publicUrl, updated_at: new Date() }).eq('id', user.id);
            await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });

            onProfileUpdate({ ...profile, avatar_url: publicUrl });
            alert('Avatar updated!');
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase.from('profiles').update({
                full_name: fullName,
                username: username,
                phone: phone,
                updated_at: new Date()
            }).eq('id', user.id);

            if (error) throw error;

            await supabase.auth.updateUser({
                data: { full_name: fullName, username: username }
            });

            onProfileUpdate({ ...profile, full_name: fullName, username: username, phone: phone });
            alert('Profile updated successfully!');
            onClose();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Edit Profile</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="avatar-section">
                        <div className="avatar-large">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="avatar-img-large" />
                            ) : (
                                <div className="avatar-placeholder">{profile?.username?.charAt(0).toUpperCase()}</div>
                            )}
                        </div>
                        <label className="upload-btn">
                            {uploading ? "Updating..." : "Upload New Avatar"}
                            <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} hidden />
                        </label>
                    </div>

                    <div className="form-section">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <div className="input-group phone-input">
                            <div className="country-code">
                                <span>+254</span>
                                <ChevronDown size={14} />
                            </div>
                            <input
                                type="text"
                                placeholder="Phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <button className="change-password-link">Change Password</button>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="save-changes-btn" onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
