import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const integrationsData = {
  solarwinds: {
    connectionStatus: "Connected",
    lastSync: "2025-07-21 14:30",
    devicesImported: 320,
    alertsFetched: 125,
    lastRefresh: "2025-07-21 14:35",
    apiUsage: { used: 4500, quota: 5000 },
    recentErrors: [
      { timestamp: "2025-07-20 10:15", error: "Timeout on API call" },
      { timestamp: "2025-07-19 09:00", error: "Auth failed" },
    ],
    serverURL: "https://solarwinds.example.com",
    apiKeyMasked: "*****-*****-AB12CD34",
  },
  azure: {
    connectionStatus: "Disconnected",
    lastPull: "2025-07-20 23:50",
    monitoredResources: 120,
    alertsFetched: 85,
    healthStatus: "Degraded",
    lastIngestion: "2025-07-20 23:55",
    failures: ["Warning: Slow response from VM-21"],
    subscriptionID: "1234-5678-90ab-cdef",
    tenantIDMasked: "*****-****-****-****",
    clientIDMasked: "*****-****-****-****",
    collectionInterval: "15 minutes",
  },
  cato: {
    connectionStatus: "Connected",
    lastSync: "2025-07-21 14:00",
    activeTunnels: 12,
    downTunnels: 1,
    degradedTunnels: 2,
    bandwidthUsed: 450, // Mbps
    bandwidthAllocated: 600, // Mbps
    recentIssues: ["Packet loss on Tunnel-5", "Latency spike on Tunnel-8"],
    apiEndpoint: "https://api.cato.net",
    authTokenMasked: "*****-****-****-XYZ9",
  },
};

const COLORS = {
  connected: "#22c55e",
  disconnected: "#ef4444",
  degraded: "#facc15",
};

const IntegrationsPage = () => {
  const { solarwinds, azure, cato } = integrationsData;

  // For CATO bandwidth pie chart data
  const catoBandwidthData = [
    { name: "Used", value: cato.bandwidthUsed, color: "#3b82f6" },
    {
      name: "Available",
      value: cato.bandwidthAllocated - cato.bandwidthUsed,
      color: "#374151",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6 max-w-full space-y-10">
      {/* SolarWinds Integration */}
      <section>
        <Card className="bg-gray-900 shadow-lg border border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-indigo-400">
              SolarWinds Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Connection Status & Last Sync */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-block w-4 h-4 rounded-full ${
                    solarwinds.connectionStatus === "Connected"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  title={`Status: ${solarwinds.connectionStatus}`}
                />
                <p className="text-lg font-semibold">
                  Status:{" "}
                  <span
                    className={`${
                      solarwinds.connectionStatus === "Connected"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {solarwinds.connectionStatus}
                  </span>
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Last Sync: {solarwinds.lastSync}
              </p>
            </div>

            {/* Data Sync Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <Card className="bg-gray-800 p-4 shadow-inner border border-gray-700">
                <p className="text-3xl font-extrabold text-indigo-300">
                  {solarwinds.devicesImported}
                </p>
                <p className="text-sm text-gray-400">Devices Imported</p>
              </Card>
              <Card className="bg-gray-800 p-4 shadow-inner border border-gray-700">
                <p className="text-3xl font-extrabold text-indigo-300">
                  {solarwinds.alertsFetched}
                </p>
                <p className="text-sm text-gray-400">Alerts Fetched</p>
              </Card>
              <Card className="bg-gray-800 p-4 shadow-inner border border-gray-700">
                <p className="text-sm text-gray-400">Last Refresh</p>
                <p className="text-lg font-semibold">
                  {solarwinds.lastRefresh}
                </p>
              </Card>
            </div>

            {/* API Usage */}
            <div>
              <p className="font-semibold text-indigo-400 mb-1">API Usage</p>
              <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-700">
                <div
                  className="bg-indigo-600 h-6 transition-all"
                  style={{
                    width: `${
                      (solarwinds.apiUsage.used / solarwinds.apiUsage.quota) *
                      100
                    }%`,
                  }}
                  title={`${solarwinds.apiUsage.used} / ${solarwinds.apiUsage.quota} calls`}
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {solarwinds.apiUsage.used} of {solarwinds.apiUsage.quota} calls
                used
              </p>
            </div>

            {/* Recent Errors */}
            <div>
              <p className="font-semibold text-indigo-400 mb-2">
                Recent Errors
              </p>
              {solarwinds.recentErrors.length === 0 ? (
                <p className="text-gray-400 italic">No recent errors</p>
              ) : (
                <table className="w-full text-left text-sm border border-gray-700 rounded-md overflow-hidden">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-3 py-2">Timestamp</th>
                      <th className="px-3 py-2">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solarwinds.recentErrors.map((err, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-700 hover:bg-gray-800 transition"
                      >
                        <td className="px-3 py-2">{err.timestamp}</td>
                        <td className="px-3 py-2">{err.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Configuration Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-indigo-400">Server URL/IP</p>
                <p className="text-gray-300">{solarwinds.serverURL}</p>
              </div>
              <div>
                <p className="font-semibold text-indigo-400">API Key</p>
                <p className="text-gray-400 select-all">
                  {solarwinds.apiKeyMasked}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-md font-semibold transition">
                Test Connection
              </button>
              <button className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-md font-semibold transition">
                Manual Sync / Refresh
              </button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Azure Monitor Integration */}
      <section>
        <Card className="bg-gray-900 shadow-lg border border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-indigo-400">
              Azure Monitor Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status and Last Data Pull */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-block w-4 h-4 rounded-full ${
                    azure.connectionStatus === "Connected"
                      ? "bg-green-500"
                      : azure.connectionStatus === "Disconnected"
                      ? "bg-red-500"
                      : "bg-yellow-400"
                  }`}
                  title={`Status: ${azure.connectionStatus}`}
                />
                <p className="text-lg font-semibold">
                  Status:{" "}
                  <span
                    className={`${
                      azure.connectionStatus === "Connected"
                        ? "text-green-400"
                        : azure.connectionStatus === "Disconnected"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {azure.connectionStatus}
                  </span>
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Last Data Pull: {azure.lastPull}
              </p>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <Card className="bg-gray-800 p-4 shadow-inner border border-gray-700">
                <p className="text-3xl font-extrabold text-indigo-300">
                  {azure.monitoredResources}
                </p>
                <p className="text-sm text-gray-400">Monitored Resources</p>
              </Card>
              <Card className="bg-gray-800 p-4 shadow-inner border border-gray-700">
                <p className="text-3xl font-extrabold text-indigo-300">
                  {azure.alertsFetched}
                </p>
                <p className="text-sm text-gray-400">Alerts Fetched</p>
              </Card>
              <Card className="bg-gray-800 p-4 shadow-inner border border-gray-700">
                <p className="text-sm text-gray-400">Health Status</p>
                <p
                  className={`text-lg font-semibold ${
                    azure.healthStatus === "Healthy"
                      ? "text-green-400"
                      : azure.healthStatus === "Degraded"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {azure.healthStatus}
                </p>
              </Card>
            </div>

            {/* Data Sync Details */}
            <div>
              <p className="font-semibold text-indigo-400 mb-2">
                Data Sync Details
              </p>
              <p className="text-gray-400">
                Last Ingestion Time: {azure.lastIngestion}
              </p>
              {azure.failures.length === 0 ? (
                <p className="text-gray-400 italic">No failures or warnings</p>
              ) : (
                <ul className="list-disc list-inside text-red-400">
                  {azure.failures.map((fail, i) => (
                    <li key={i}>{fail}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Configuration Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="font-semibold text-indigo-400">Subscription ID</p>
                <p className="text-gray-300">{azure.subscriptionID}</p>
              </div>
              <div>
                <p className="font-semibold text-indigo-400">Tenant ID</p>
                <p className="text-gray-400 select-all">
                  {azure.tenantIDMasked}
                </p>
              </div>
              <div>
                <p className="font-semibold text-indigo-400">Client ID</p>
                <p className="text-gray-400 select-all">
                  {azure.clientIDMasked}
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-indigo-400">
                Data Collection Interval
              </p>
              <p className="text-gray-300">{azure.collectionInterval}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-md font-semibold transition">
                Test API Connection
              </button>
              <button className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-md font-semibold transition">
                Trigger Manual Data Pull
              </button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CATO SD-WAN Integration */}
      <section>
        <Card className="bg-gray-900 shadow-lg border border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-indigo-400">
              CATO SD-WAN Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Connection Status & Last Sync */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-block w-4 h-4 rounded-full ${
                    cato.connectionStatus === "Connected"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  title={`Status: ${cato.connectionStatus}`}
                />
                <p className="text-lg font-semibold">
                  Status:{" "}
                  <span
                    className={`${
                      cato.connectionStatus === "Connected"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {cato.connectionStatus}
                  </span>
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Last Sync: {cato.lastSync}
              </p>
            </div>

            {/* Tunnel Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <Card className="bg-gray-800 p-4 shadow-inner border border-gray-700">
                <p className="text-3xl font-extrabold text-indigo-300">
                  {cato.activeTunnels}
                </p>
                <p className="text-sm text-gray-400">Active Tunnels</p>
              </Card>
              <Card className="bg-gray-800 p-4 shadow-inner border border-gray-700">
                <p className="text-3xl font-extrabold text-yellow-400">
                  {cato.degradedTunnels}
                </p>
                <p className="text-sm text-gray-400">Degraded Tunnels</p>
              </Card>
              <Card className="bg-gray-800 p-4 shadow-inner border border-gray-700">
                <p className="text-3xl font-extrabold text-red-400">
                  {cato.downTunnels}
                </p>
                <p className="text-sm text-gray-400">Down Tunnels</p>
              </Card>
            </div>

            {/* Bandwidth Utilization Donut Chart */}
            <div className="flex flex-col items-center space-y-2">
              <p className="font-semibold text-indigo-400">
                Bandwidth Utilization
              </p>
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={catoBandwidthData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {catoBandwidthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderRadius: 6,
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Alerts / Issues */}
            <div>
              <p className="font-semibold text-indigo-400 mb-2">
                Recent Alerts / Issues
              </p>
              {cato.recentIssues.length === 0 ? (
                <p className="text-gray-400 italic">No recent issues</p>
              ) : (
                <ul className="list-disc list-inside text-red-400">
                  {cato.recentIssues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Configuration Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-indigo-400">API Endpoint</p>
                <p className="text-gray-300">{cato.apiEndpoint}</p>
              </div>
              <div>
                <p className="font-semibold text-indigo-400">Auth Token</p>
                <p className="text-gray-400 select-all">
                  {cato.authTokenMasked}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-md font-semibold transition">
                Test Connection
              </button>
              <button className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-md font-semibold transition">
                Refresh Data
              </button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default IntegrationsPage;
