import React, { useEffect, useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, User, CreditCard, HelpCircle } from "lucide-react";
import { supabase } from "../services/SupabaseClient";
import "./Settings.css";

const Settings = () => {
    const [profile, setProfile] = useState({
        full_name: "Loading...",
        email: "Loading...",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                setProfile({
                    full_name: data?.full_name || user.user_metadata?.full_name || "User",
                    email: user.email,
                });
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1 className="settings-title">Account Settings</h1>
                <p className="settings-subtitle">Manage your profile, security, and notification preferences.</p>
            </div>

            <div className="settings-grid">
                {/* Profile Settings */}
                <div className="settings-card">
                    <div className="card-header">
                        <User size={20} className="card-icon" />
                        <h3>Profile</h3>
                    </div>
                    <div className="card-body">
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Display Name</p>
                                <p className="setting-value">{profile.full_name}</p>
                            </div>
                            <button className="edit-link">Edit</button>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Email Address</p>
                                <p className="setting-value">{profile.email}</p>
                            </div>
                            <button className="edit-link">Change</button>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="settings-card">
                    <div className="card-header">
                        <Bell size={20} className="card-icon" />
                        <h3>Notifications</h3>
                    </div>
                    <div className="card-body">
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Price Alerts</p>
                                <p className="setting-desc">Get notified when coins reach your target.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">News Updates</p>
                                <p className="setting-desc">Receive daily crypto market summaries.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="settings-card">
                    <div className="card-header">
                        <Shield size={20} className="card-icon" />
                        <h3>Security</h3>
                    </div>
                    <div className="card-body">
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Two-Factor Auth</p>
                                <p className="setting-desc">Add an extra layer of security.</p>
                            </div>
                            <button className="setup-btn">Setup</button>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Change Password</p>
                                <p className="setting-desc">Last changed 3 months ago.</p>
                            </div>
                            <button className="edit-link">Update</button>
                        </div>
                    </div>
                </div>

                {/* Billing */}
                <div className="settings-card">
                    <div className="card-header">
                        <CreditCard size={20} className="card-icon" />
                        <h3>Billing</h3>
                    </div>
                    <div className="card-body">
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Current Plan</p>
                                <p className="setting-value">Free Tier</p>
                            </div>
                            <button className="upgrade-link">Upgrade</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
