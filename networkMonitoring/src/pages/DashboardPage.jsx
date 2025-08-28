import React, { useEffect, useState, useRef } from "react";
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
  // States for API data
  const [devices, setDevices] = useState([]);
  const [cpuUsage, setCpuUsage] = useState(null);
  const [bandwidth, setBandwidth] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState({
    cpu: "disconnected",
    devices: "disconnected",
    bandwidth: "disconnected",
  });

  // Refs to store WebSocket connections
  const cpuSocketRef = useRef(null);
  const deviceSocketRef = useRef(null);
  const bwSocketRef = useRef(null);

  // --- WebSocket connections ---
  useEffect(() => {
    const connectWebSocket = (type, onMessage) => {
      const ws = new WebSocket(`ws://localhost:3001/ws?type=${type}`);

      ws.onopen = () => {
        console.log(`${type} WebSocket connected`);
        setConnectionStatus((prev) => ({ ...prev, [type]: "connected" }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error(`Error parsing ${type} WebSocket message:`, error);
        }
      };

      ws.onclose = () => {
        console.log(`${type} WebSocket disconnected`);
        setConnectionStatus((prev) => ({ ...prev, [type]: "disconnected" }));
      };

      ws.onerror = (error) => {
        console.error(`${type} WebSocket error:`, error);
        setConnectionStatus((prev) => ({ ...prev, [type]: "error" }));
      };

      return ws;
    };

    // Create WebSocket connections
    cpuSocketRef.current = connectWebSocket("cpu", (data) => {
      setCpuUsage(data.value);
    });

    deviceSocketRef.current = connectWebSocket("devices", (data) => {
      setDevices(data.devices || []);
    });

    bwSocketRef.current = connectWebSocket("bandwidth", (data) => {
      setBandwidth((prev) => {
        const newData = {
          time: new Date(data.ts).toLocaleTimeString(),
          rx: data.rx,
          tx: data.tx,
          total: data.rx + data.tx,
        };

        // Keep only last 20 data points
        const updated = [...prev, newData].slice(-20);
        return updated;
      });
    });

    // Cleanup function
    return () => {
      if (cpuSocketRef.current) {
        cpuSocketRef.current.close();
      }
      if (deviceSocketRef.current) {
        deviceSocketRef.current.close();
      }
      if (bwSocketRef.current) {
        bwSocketRef.current.close();
      }
    };
  }, []);

  // --- Fetch APIs once ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch alerts
        const alertsResponse = await fetch("http://localhost:3001/api/alerts");
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json();
          setAlerts(alertsData);
        } else {
          console.error("Failed to fetch alerts:", alertsResponse.statusText);
        }

        // Fetch integrations
        const integrationsResponse = await fetch(
          "http://localhost:3001/api/integrations"
        );
        if (integrationsResponse.ok) {
          const integrationsData = await integrationsResponse.json();
          setIntegrations(integrationsData);
        } else {
          console.error(
            "Failed to fetch integrations:",
            integrationsResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Dummy fallback data for charts if API is empty
  const fallbackBandwidth = [
    { time: "T1", total: 100, rx: 60, tx: 40 },
    { time: "T2", total: 200, rx: 120, tx: 80 },
    { time: "T3", total: 150, rx: 90, tx: 60 },
  ];

  const fallbackDevices = [
    { ip: "192.168.1.1", mac: "aa:bb:cc:dd:ee:ff", vendor: "Router" },
    { ip: "192.168.1.2", mac: "11:22:33:44:55:66", vendor: "Switch" },
  ];

  // Connection status indicator
  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "#10b981"; // green
      case "disconnected":
        return "#ef4444"; // red
      case "error":
        return "#f59e0b"; // yellow
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <div
      className="p-6 max-w-full space-y-10"
      style={{ backgroundColor: "#111827", minHeight: "100vh" }}
    >
      {/* Connection Status */}
      <Card style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb" }}>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: getStatusColor(connectionStatus.cpu),
                }}
              ></div>
              <span className="text-sm text-gray-300">
                CPU: {connectionStatus.cpu}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: getStatusColor(connectionStatus.devices),
                }}
              ></div>
              <span className="text-sm text-gray-300">
                Devices: {connectionStatus.devices}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: getStatusColor(connectionStatus.bandwidth),
                }}
              ></div>
              <span className="text-sm text-gray-300">
                Bandwidth: {connectionStatus.bandwidth}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-8">
        <Card
          style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb" }}
        >
          <CardHeader>
            <CardTitle className="text-base">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold">{devices.length}</p>
          </CardContent>
        </Card>

        <Card
          style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb" }}
        >
          <CardHeader>
            <CardTitle className="text-base">Live CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold">
              {cpuUsage !== null ? `${cpuUsage}%` : "Loading..."}
            </p>
          </CardContent>
        </Card>

        <Card
          style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb" }}
        >
          <CardHeader>
            <CardTitle className="text-base">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold">{alerts.length}</p>
          </CardContent>
        </Card>

        <Card
          style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb" }}
        >
          <CardHeader>
            <CardTitle className="text-base">Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold">{integrations.length}</p>
          </CardContent>
        </Card>

        <Card
          style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb" }}
        >
          <CardHeader>
            <CardTitle className="text-base">Bandwidth Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold">{bandwidth.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bandwidth Chart */}
      <Card style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb" }}>
        <CardHeader>
          <CardTitle>Bandwidth Usage (Live)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bandwidth.length ? bandwidth : fallbackBandwidth}>
              <XAxis dataKey="time" stroke="#e0e7ff" />
              <YAxis stroke="#e0e7ff" />
              <Tooltip
                contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                itemStyle={{ color: "#e0e7ff" }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Total (KB/s)"
              />
              <Line
                type="monotone"
                dataKey="rx"
                stroke="#10b981"
                strokeWidth={1}
                name="RX (KB/s)"
              />
              <Line
                type="monotone"
                dataKey="tx"
                stroke="#f59e0b"
                strokeWidth={1}
                name="TX (KB/s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device List */}
      <Card style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb" }}>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border-collapse text-gray-300">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3">IP Address</th>
                <th className="text-left py-3">MAC Address</th>
                <th className="text-left py-3">Vendor</th>
              </tr>
            </thead>
            <tbody>
              {(devices.length ? devices : fallbackDevices).map((device, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="py-3">{device.ip}</td>
                  <td className="py-3">{device.mac || "N/A"}</td>
                  <td className="py-3">{device.vendor || "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb" }}>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <table className="w-full text-sm border-collapse text-gray-300">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3">Alert</th>
                  <th className="text-left py-3">Severity</th>
                  <th className="text-left py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="py-3">{a.alert}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          a.severity === "Critical"
                            ? "bg-red-600 text-white"
                            : "bg-yellow-600 text-white"
                        }`}
                      >
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3">
                      {new Date(a.time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">No active alerts</p>
          )}
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb" }}>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          {integrations.length > 0 ? (
            <table className="w-full text-sm border-collapse text-gray-300">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3">Integration</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Last Sync</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((i, idx) => (
                  <tr key={idx} className="border-b border-gray-700">
                    <td className="py-3">{i.name}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          i.status === "Connected"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {i.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {new Date(i.lastSync).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">No integrations configured</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
