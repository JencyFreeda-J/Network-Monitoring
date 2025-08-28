import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DevicesPage from "./pages/DevicesPage";
import DashboardPage from "./pages/DashboardPage";
import AlertsAndEventsPage from "./pages/AlertsAndEventsPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardLayout from "./layout/DashboardLayout";
import NetworkPage from "./pages/NetworkPage";
import ReportsPage from "./pages/ReportsPage";
import IntegrationsPage from "./pages/IntegrationsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard/*" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="network" element={<NetworkPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="alertsandevents" element={<AlertsAndEventsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
