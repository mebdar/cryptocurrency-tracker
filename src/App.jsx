import MarketOverview from "./components/MarketOverview";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Markets from "./pages/Markets";
import Information from "./pages/Information";

function App() {
  const [search, setSearch] = useState("");
  return (
    <Layout search={search} setSearch={setSearch}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <Dashboard search={search} />
          }
        />
        <Route
          path="/markets"
          element={
            <Markets />
          }
        />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/information" element={<Information />} />
      </Routes>
    </Layout>
  );
}

export default App;
