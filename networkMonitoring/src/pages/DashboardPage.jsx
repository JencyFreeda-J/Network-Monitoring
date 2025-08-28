import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardPage = () => {
  // KPI cards
  const kpis = [
    { title: "Total Devices", value: 1280 },
    { title: "Patched Ports", value: 984 },
    { title: "WAN Links", value: 56 },
    { title: "Active Alerts", value: 12 },
    { title: "Bandwidth Utilization", value: "74%" },
  ];

  // Line chart data (Bandwidth Usage)
  const bandwidthUsage = [
    { day: "Mon", value: 120 },
    { day: "Tue", value: 200 },
    { day: "Wed", value: 180 },
    { day: "Thu", value: 220 },
    { day: "Fri", value: 260 },
    { day: "Sat", value: 210 },
    { day: "Sun", value: 240 },
  ];

  // Stacked bar chart (Port Utilization)
  const portUtilization = [
    { region: "US-East", used: 60, free: 40 },
    { region: "US-West", used: 75, free: 25 },
    { region: "EU", used: 50, free: 50 },
    { region: "Asia", used: 80, free: 20 },
  ];

  // WAN Link Health (Donut)
  const wanHealth = [
    { label: "Healthy", value: 85, color: "#4ade80" },
    { label: "Warning", value: 10, color: "#facc15" },
    { label: "Critical", value: 5, color: "#f87171" },
  ];

  // Vendor Distribution (Pie)
  const vendors = [
    { label: "Cisco", value: 40, color: "#3b82f6" },
    { label: "Juniper", value: 25, color: "#06b6d4" },
    { label: "HP", value: 20, color: "#8b5cf6" },
    { label: "Other", value: 15, color: "#f59e0b" },
  ];

  // Top 5 Devices by Traffic
  const topDevices = [
    { name: "Router-1", traffic: 320 },
    { name: "Switch-12", traffic: 290 },
    { name: "Firewall-4", traffic: 260 },
    { name: "AP-5", traffic: 240 },
    { name: "Core-1", traffic: 210 },
  ];

  // Active Alerts Table
  const activeAlerts = [
    { alert: "Port Scan Detected", severity: "High", time: "10:32 AM" },
    { alert: "Device Offline", severity: "Medium", time: "9:45 AM" },
    { alert: "High CPU Usage", severity: "Low", time: "8:22 AM" },
  ];

  // Integrations Table
  const integrations = [
    { name: "AWS VPC", status: "Connected", lastSync: "Today, 08:45" },
    { name: "Azure", status: "Disconnected", lastSync: "Yesterday, 18:00" },
    { name: "Slack", status: "Connected", lastSync: "Today, 09:20" },
  ];

  // Custom card styles for popping effect
  const cardStyle = {
    minHeight: 110,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#1f2937", // gray-800 dark bg
    boxShadow:
      "0 0 8px 1px rgba(96, 165, 250, 0.7), 0 2px 12px rgba(96, 165, 250, 0.3)", // subtle blue glow
    borderRadius: 12,
    border: "1px solid #2563eb", // blue border for pop
    color: "#e0e7ff",
  };

  const otherCardStyle = {
    backgroundColor: "#1f2937",
    boxShadow:
      "0 0 8px 1px rgba(96, 165, 250, 0.7), 0 2px 12px rgba(96, 165, 250, 0.3)",
    borderRadius: 12,
    border: "1px solid #2563eb",
    color: "#e0e7ff",
  };

  return (
    <div
      className="p-6 max-w-full space-y-10"
      style={{ backgroundColor: "#111827", minHeight: "100vh" }} // bg-gray-900
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-8">
        {kpis.map(({ title, value }) => (
          <Card key={title} style={cardStyle}>
            <CardHeader>
              <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Core Graphs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <Card style={otherCardStyle}>
          <CardHeader>
            <CardTitle>Bandwidth Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bandwidthUsage}>
                <XAxis dataKey="day" stroke="#e0e7ff" />
                <YAxis stroke="#e0e7ff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card style={otherCardStyle}>
          <CardHeader>
            <CardTitle>Port Utilization by Region</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portUtilization}>
                <XAxis dataKey="region" stroke="#e0e7ff" />
                <YAxis stroke="#e0e7ff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
                <Bar dataKey="used" stackId="a" fill="#10b981" />
                <Bar dataKey="free" stackId="a" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Supporting Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <Card style={otherCardStyle}>
          <CardHeader>
            <CardTitle>WAN Link Health</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wanHealth}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  label
                >
                  {wanHealth.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card style={otherCardStyle}>
          <CardHeader>
            <CardTitle>Vendor Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vendors}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {vendors.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card style={otherCardStyle}>
          <CardHeader>
            <CardTitle>Top 5 Devices by Traffic</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDevices}>
                <XAxis dataKey="name" stroke="#e0e7ff" />
                <YAxis stroke="#e0e7ff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
                <Bar dataKey="traffic" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <Card style={otherCardStyle}>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm border-collapse text-gray-300">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3">Alert</th>
                  <th className="text-left py-3">Severity</th>
                  <th className="text-left py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {activeAlerts.map(({ alert, severity, time }, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                    style={{ cursor: "default" }}
                  >
                    <td className="py-3">{alert}</td>
                    <td>{severity}</td>
                    <td>{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card style={otherCardStyle}>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm border-collapse text-gray-300">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3">Integration</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Last Sync</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map(({ name, status, lastSync }, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                    style={{ cursor: "default" }}
                  >
                    <td className="py-3">{name}</td>
                    <td>{status}</td>
                    <td>{lastSync}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
