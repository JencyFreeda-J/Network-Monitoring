import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NetworkPage = () => {
  // Dummy data
  const portUtilizationByRegion = [
    { region: "US-East", active: 60, admin: 40 },
    { region: "US-West", active: 75, admin: 25 },
    { region: "Europe", active: 50, admin: 50 },
    { region: "Asia", active: 80, admin: 20 },
  ];

  const portUsageByVendor = [
    { name: "Cisco", value: 45 },
    { name: "HP", value: 25 },
    { name: "Dell", value: 15 },
    { name: "Extreme", value: 15 },
  ];

  const topSwitches = [
    {
      name: "Switch-01",
      total: 48,
      used: 36,
      free: 12,
      vendor: "Cisco",
      status: "Active",
    },
    {
      name: "Switch-02",
      total: 24,
      used: 18,
      free: 6,
      vendor: "HP",
      status: "Active",
    },
    {
      name: "Switch-03",
      total: 48,
      used: 30,
      free: 18,
      vendor: "Dell",
      status: "Inactive",
    },
    {
      name: "Switch-04",
      total: 24,
      used: 20,
      free: 4,
      vendor: "Extreme",
      status: "Active",
    },
    {
      name: "Switch-05",
      total: 48,
      used: 42,
      free: 6,
      vendor: "Cisco",
      status: "Active",
    },
  ];

  const wanHealth = [
    { name: "Healthy", value: 70 },
    { name: "Degraded", value: 20 },
    { name: "Down", value: 10 },
  ];

  const latencyData = [
    { time: "08:00", latency: 30 },
    { time: "10:00", latency: 35 },
    { time: "12:00", latency: 40 },
    { time: "14:00", latency: 45 },
    { time: "16:00", latency: 33 },
    { time: "18:00", latency: 50 },
  ];

  const bandwidthOverTime = [
    { time: "08:00", bandwidth: 200 },
    { time: "10:00", bandwidth: 350 },
    { time: "12:00", bandwidth: 500 },
    { time: "14:00", bandwidth: 300 },
    { time: "16:00", bandwidth: 600 },
  ];

  const trafficByProtocol = [
    { name: "HTTP", value: 40 },
    { name: "FTP", value: 15 },
    { name: "DNS", value: 25 },
    { name: "SSH", value: 20 },
  ];

  const topDevices = [
    { name: "Router-1", traffic: 300 },
    { name: "Switch-2", traffic: 250 },
    { name: "Firewall-1", traffic: 220 },
    { name: "AP-3", traffic: 180 },
    { name: "Core-1", traffic: 160 },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444", "#3b82f6"];

  // Card style for popping effect
  const cardStyle = {
    backgroundColor: "#1f2937", // dark gray
    boxShadow:
      "0 0 8px 1px rgba(96, 165, 250, 0.7), 0 2px 12px rgba(96, 165, 250, 0.3)", // subtle blue glow
    borderRadius: 12,
    border: "1px solid #2563eb", // blue border accent
    color: "#e0e7ff",
  };

  return (
    <div
      className="p-6 max-w-full space-y-10 flex flex-col"
      style={{ backgroundColor: "#111827", minHeight: "100vh" }} // page dark bg
    >
      {/* Port Utilization Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle>Port Utilization by Region</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portUtilizationByRegion}>
                <XAxis dataKey="region" stroke="#e0e7ff" />
                <YAxis stroke="#e0e7ff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
                <Legend wrapperStyle={{ color: "#e0e7ff" }} />
                <Bar dataKey="active" stackId="a" fill="#22c55e" />
                <Bar dataKey="admin" stackId="a" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle>Port Usage by Vendor</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portUsageByVendor}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {portUsageByVendor.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
                <Legend wrapperStyle={{ color: "#e0e7ff" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* WAN Links Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle>WAN Link Health</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wanHealth}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {wanHealth.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
                <Legend wrapperStyle={{ color: "#e0e7ff" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle>Latency Trends</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <XAxis dataKey="time" stroke="#e0e7ff" />
                <YAxis stroke="#e0e7ff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle>Bandwidth Over Time</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bandwidthOverTime}>
                <XAxis dataKey="time" stroke="#e0e7ff" />
                <YAxis stroke="#e0e7ff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
                <Area
                  type="monotone"
                  dataKey="bandwidth"
                  stroke="#0ea5e9"
                  fill="#bae6fd"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle>Traffic by Protocol</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficByProtocol}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {trafficByProtocol.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
                <Legend wrapperStyle={{ color: "#e0e7ff" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle>Top Switches</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm border-collapse text-gray-300">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3">Name</th>
                  <th className="text-center py-3">Used/Total</th>
                  <th className="text-center py-3">Free</th>
                  <th className="text-left py-3">Vendor</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {topSwitches.map(
                  ({ name, used, total, free, vendor, status }, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                      style={{ cursor: "default" }}
                    >
                      <td className="py-3">{name}</td>
                      <td className="text-center">
                        {used}/{total}
                      </td>
                      <td className="text-center">{free}</td>
                      <td>{vendor}</td>
                      <td>{status}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle>Top Devices by Traffic</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDevices}>
                <XAxis dataKey="name" stroke="#e0e7ff" />
                <YAxis stroke="#e0e7ff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                  itemStyle={{ color: "#e0e7ff" }}
                />
                <Bar dataKey="traffic" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkPage;
