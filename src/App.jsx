import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

/* Layout */
import Layout from "./components/Layout";

/* Pages */
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import Transactions from "./pages/Transactions";
import Payment from "./pages/Payment";
import Analytics from "./pages/Analytics";
import Information from "./pages/Information";

/* Auth Pages */
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [search, setSearch] = useState("");

  return (
    <Routes>

      {/* ✅ AUTH ROUTES (NO SIDEBAR) */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ✅ APP ROUTES (WITH SIDEBAR) */}
      <Route
        path="/*"
        element={
          <Layout search={search} setSearch={setSearch}>
            <Routes>
              <Route
                path="/dashboard"
                element={<Dashboard search={search} />}
              />

              <Route path="/markets" element={<Markets />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/information" element={<Information />} />
            </Routes>
          </Layout>
        }
      />

    </Routes>
  );
}

export default App;