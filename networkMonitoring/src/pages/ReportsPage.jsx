import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const ReportsPage = () => {
  // ==== Daily Summary Data ====
  const dailyKPIs = [
    { title: "Devices Online", value: 1200 },
    { title: "Devices Offline", value: 80 },
    { title: "Ports Used", value: 9500 },
    { title: "Ports Available", value: 1500 },
    { title: "WAN Links Up", value: 54 },
    { title: "WAN Links Down", value: 2 },
    { title: "Alerts Critical", value: 7 },
    { title: "Alerts Warning", value: 15 },
    { title: "Alerts Info", value: 20 },
    { title: "Bandwidth In (TB)", value: 12.5 },
    { title: "Bandwidth Out (TB)", value: 10.8 },
  ];

  const incidents = [
    {
      incident: "Major Outage - Data Center 3",
      time: "Yesterday 14:15",
      duration: "45m",
    },
    {
      incident: "Link Failure - US-East",
      time: "Yesterday 09:30",
      duration: "30m",
    },
    {
      incident: "Traffic Spike - Asia Region",
      time: "Yesterday 18:20",
      duration: "1h 10m",
    },
  ];

  const alertsSummary = [
    { label: "Raised", value: 42, color: "#ef4444" },
    { label: "Cleared", value: 38, color: "#22c55e" },
  ];

  const deviceStatusChanges = [
    { label: "Added", value: 12, color: "#3b82f6" },
    { label: "Removed", value: 3, color: "#fbbf24" },
    { label: "Status Changed", value: 7, color: "#a78bfa" },
  ];

  // ==== Utilization Reports Data ====
  const portUtilizationByRegion = [
    { region: "US-East", used: 70, free: 30 },
    { region: "US-West", used: 80, free: 20 },
    { region: "Europe", used: 65, free: 35 },
    { region: "Asia", used: 90, free: 10 },
  ];

  const bandwidthTrends = [
    { date: "Mon", bandwidth: 400 },
    { date: "Tue", bandwidth: 420 },
    { date: "Wed", bandwidth: 450 },
    { date: "Thu", bandwidth: 470 },
    { date: "Fri", bandwidth: 480 },
    { date: "Sat", bandwidth: 430 },
    { date: "Sun", bandwidth: 460 },
  ];

  const topUtilizers = [
    { name: "Switch-12", utilization: 95 },
    { name: "Router-3", utilization: 89 },
    { name: "Firewall-7", utilization: 85 },
    { name: "Switch-9", utilization: 78 },
    { name: "AP-4", utilization: 74 },
  ];

  const utilizationThreshold = 80;

  // ==== Performance Trends Data ====
  const latencyTrends = [
    { week: "Week 1", latency: 30 },
    { week: "Week 2", latency: 28 },
    { week: "Week 3", latency: 35 },
    { week: "Week 4", latency: 32 },
  ];

  const packetLossTrends = [
    { week: "Week 1", loss: 0.5 },
    { week: "Week 2", loss: 0.7 },
    { week: "Week 3", loss: 0.6 },
    { week: "Week 4", loss: 0.4 },
  ];

  const devicePerfTrends = [
    { week: "Week 1", cpu: 65, memory: 70 },
    { week: "Week 2", cpu: 68, memory: 72 },
    { week: "Week 3", cpu: 70, memory: 74 },
    { week: "Week 4", cpu: 67, memory: 71 },
  ];

  return (
    <div
      className="p-10 min-h-screen text-gray-300"
      style={{ backgroundColor: "#121212" }}
    >
      {/* === Daily Summary Section === */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-8 border-b border-gray-700 pb-3 text-white">
          Daily Summary
        </h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 mb-12">
          {dailyKPIs.map(({ title, value }) => (
            <Card
              key={title}
              className="bg-gray-850 shadow-xl rounded-lg p-6 min-h-[130px] flex flex-col justify-center border-2 border-transparent hover:border-indigo-500 transition"
              style={{
                backgroundColor: "#1f1f1f",
                boxShadow:
                  "0 4px 14px rgba(100, 100, 255, 0.3), 0 0 12px rgba(100, 100, 255, 0.12)",
              }}
            >
              <CardTitle className="text-lg text-gray-400 mb-2">
                {title}
              </CardTitle>
              <CardContent className="text-3xl font-bold text-white">
                {value}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Incidents Timeline */}
        <div
          className="rounded-lg p-8 mb-12 max-w-5xl mx-auto"
          style={{
            backgroundColor: "#1f1f1f",
            boxShadow:
              "0 4px 16px rgba(255, 100, 100, 0.25), 0 0 10px rgba(255, 100, 100, 0.1)",
          }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-white">
            Top Events / Incidents
          </h3>
          <ul className="space-y-4">
            {incidents.map(({ incident, time, duration }, i) => (
              <li
                key={i}
                className="border-l-4 border-red-600 pl-5 py-3 bg-gray-900 rounded hover:bg-gray-800 transition"
              >
                <p className="font-semibold text-red-400 text-lg">{incident}</p>
                <p className="text-base text-gray-400">
                  Time: {time} &nbsp;&bull;&nbsp; Duration: {duration}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Alerts & Device Status Small Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Alerts Summary Pie */}
          <Card
            className="rounded-lg p-8"
            style={{
              backgroundColor: "#1f1f1f",
              boxShadow:
                "0 4px 16px rgba(239, 68, 68, 0.4), 0 0 12px rgba(239, 68, 68, 0.15)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Alerts Summary (Yesterday)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertsSummary}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={{ fill: "white", fontSize: 14 }}
                  >
                    {alertsSummary.map(({ color }, index) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: 6,
                    }}
                    itemStyle={{ color: "white" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Status Changes Pie */}
          <Card
            className="rounded-lg p-8"
            style={{
              backgroundColor: "#1f1f1f",
              boxShadow:
                "0 4px 16px rgba(59, 130, 246, 0.4), 0 0 12px rgba(59, 130, 246, 0.15)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Device Status Changes (Last 24h)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceStatusChanges}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={{ fill: "white", fontSize: 14 }}
                  >
                    {deviceStatusChanges.map(({ color }, index) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* === Utilization Reports Section === */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-8 border-b border-gray-700 pb-3 text-white">
          Utilization Reports
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Port Utilization Stacked Bar */}
          <Card
            className="rounded-lg p-8 min-h-[380px]"
            style={{
              backgroundColor: "#1f1f1f",
              boxShadow:
                "0 4px 16px rgba(34, 197, 94, 0.3), 0 0 10px rgba(34, 197, 94, 0.15)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Port Utilization by Region
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={portUtilizationByRegion}>
                  <XAxis stroke="#9ca3af" dataKey="region" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: 6,
                    }}
                    itemStyle={{ color: "white" }}
                  />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Bar dataKey="used" stackId="a" fill="#22c55e" />
                  <Bar dataKey="free" stackId="a" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bandwidth Over Time Line Chart */}
          <Card
            className="rounded-lg p-8 min-h-[380px]"
            style={{
              backgroundColor: "#1f1f1f",
              boxShadow:
                "0 4px 16px rgba(59, 130, 246, 0.3), 0 0 10px rgba(59, 130, 246, 0.15)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Bandwidth Usage Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bandwidthTrends}>
                  <XAxis stroke="#9ca3af" dataKey="date" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: 6,
                    }}
                    itemStyle={{ color: "white" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bandwidth"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Utilizers Table */}
          <Card
            className="rounded-lg p-8 min-h-[380px] overflow-auto"
            style={{
              backgroundColor: "#1f1f1f",
              boxShadow:
                "0 4px 16px rgba(255, 184, 0, 0.3), 0 0 10px rgba(255, 184, 0, 0.15)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Top Utilizers (Ports & Devices)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-base text-gray-100 border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3">Name</th>
                    <th className="text-left">Utilization %</th>
                  </tr>
                </thead>
                <tbody>
                  {topUtilizers.map(({ name, utilization }, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-700 hover:bg-gray-800 ${
                        utilization > utilizationThreshold
                          ? "text-red-400 font-semibold"
                          : ""
                      }`}
                    >
                      <td className="py-3">{name}</td>
                      <td>{utilization}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* === Performance Trends Section === */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-8 border-b border-gray-700 pb-3 text-white">
          Performance Trends
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Latency Trends Line Chart */}
          <Card
            className="rounded-lg p-8 min-h-[380px]"
            style={{
              backgroundColor: "#1f1f1f",
              boxShadow:
                "0 4px 16px rgba(239, 68, 68, 0.3), 0 0 10px rgba(239, 68, 68, 0.15)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Network Latency (ms)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyTrends}>
                  <XAxis stroke="#9ca3af" dataKey="week" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: 6,
                    }}
                    itemStyle={{ color: "white" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke="#ef4444"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Packet Loss Area Chart */}
          <Card
            className="rounded-lg p-8 min-h-[380px]"
            style={{
              backgroundColor: "#1f1f1f",
              boxShadow:
                "0 4px 16px rgba(245, 158, 11, 0.3), 0 0 10px rgba(245, 158, 11, 0.15)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Packet Loss (%)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={packetLossTrends}>
                  <XAxis stroke="#9ca3af" dataKey="week" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: 6,
                    }}
                    itemStyle={{ color: "white" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="loss"
                    stroke="#f59e0b"
                    fill="#fbbf24"
                    strokeWidth={2}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Performance Trends Area Chart */}
          <Card
            className="rounded-lg p-8 min-h-[380px]"
            style={{
              backgroundColor: "#1f1f1f",
              boxShadow:
                "0 4px 16px rgba(34, 197, 94, 0.3), 0 0 10px rgba(34, 197, 94, 0.15)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Device CPU & Memory Usage (%)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={devicePerfTrends}>
                  <XAxis stroke="#9ca3af" dataKey="week" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: 6,
                    }}
                    itemStyle={{ color: "white" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cpu"
                    stroke="#22c55e"
                    fill="#4ade80"
                    strokeWidth={2}
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="memory"
                    stroke="#3b82f6"
                    fill="#60a5fa"
                    strokeWidth={2}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ReportsPage;
