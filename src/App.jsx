import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
import { supabase } from "./services/SupabaseClient";
console.log("Supabase conneted:", supabase);
/* Layout */
import Layout from "./components/Layout";

/* Pages */
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import Profile from "./pages/Profile";

/* Auth Pages */
import Login from "./pages/Login";
import Signup from "./pages/Signup";

/* Feature Pages */
import Wishlist from "./pages/Wishlist";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

function App() {
  const [search, setSearch] = useState("");

  return (
    <Routes>
      {/* ✅ AUTH ROUTES (NO SIDEBAR) */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ✅ APP ROUTES (WITH SIDEBAR) */}
      <Route
        path="/*"
        element={
          <Layout search={search} setSearch={setSearch}>
            <Routes>
              <Route
                path="/dashboard"
                element={<Dashboard search={search} setSearch={setSearch} />}
              />

              <Route path="/markets" element={<Markets search={search} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        }
      />

    </Routes>
  );
}

export default App;