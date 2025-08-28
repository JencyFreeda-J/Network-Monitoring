import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00BFFF", "#FF9500", "#FF3B30", "#32CD32", "#8A2BE2"];
const darkTheme = {
  background: "#121212",
  text: "#E0E0E0",
  cardBg: "#1E1E1E",
  border: "#333",
  accent: "#00BFFF",
  alert: "#FF3B30",
};

const sampleData = {
  devicesSummary: {
    total: 150,
    online: 120,
    offline: 30,
    byType: [
      { name: "Switch", value: 50 },
      { name: "Router", value: 40 },
      { name: "Firewall", value: 30 },
      { name: "Server", value: 30 },
    ],
    byVendor: [
      { name: "Cisco", value: 55 },
      { name: "HP", value: 25 },
      { name: "Dell", value: 30 },
      { name: "Extreme", value: 20 },
      { name: "Others", value: 20 },
    ],
    recentDevices: [
      {
        name: "Device123",
        ip: "192.168.1.5",
        type: "Router",
        vendor: "Cisco",
        status: "Online",
        lastSeen: "10 mins ago",
        alerts: 0,
      },
      {
        name: "Device456",
        ip: "10.0.0.11",
        type: "Server",
        vendor: "Dell",
        status: "Offline",
        lastSeen: "1 hour ago",
        alerts: 2,
      },
      {
        name: "Device789",
        ip: "172.16.0.2",
        type: "Firewall",
        vendor: "HP",
        status: "Online",
        lastSeen: "5 mins ago",
        alerts: 1,
      },
    ],
    criticalAlerts: [
      {
        name: "Firewall01",
        ip: "172.16.0.10",
        type: "Firewall",
        vendor: "Cisco",
        status: "Online",
        lastSeen: "2 mins ago",
        alerts: 5,
      },
      {
        name: "Switch21",
        ip: "192.168.10.12",
        type: "Switch",
        vendor: "Extreme",
        status: "Offline",
        lastSeen: "30 mins ago",
        alerts: 3,
      },
    ],
  },

  switches: {
    total: 50,
    up: 40,
    down: 10,
    byVendor: [
      { name: "Cisco", value: 20 },
      { name: "Extreme", value: 15 },
      { name: "HP", value: 10 },
      { name: "Dell", value: 5 },
    ],
    switchesList: [
      {
        name: "Switch01",
        ip: "192.168.10.2",
        vendor: "Cisco",
        region: "NA",
        status: "Up",
        portsUsed: 24,
        portsTotal: 48,
        cpu: 35,
        memory: 40,
        lastCheckIn: "5 mins ago",
      },
      {
        name: "Switch02",
        ip: "192.168.10.3",
        vendor: "Extreme",
        region: "EU",
        status: "Down",
        portsUsed: 30,
        portsTotal: 48,
        cpu: 70,
        memory: 85,
        lastCheckIn: "1 hour ago",
      },
    ],
  },

  routers: {
    total: 40,
    up: 35,
    down: 5,
    byVendor: [
      { name: "Cisco", value: 30 },
      { name: "HP", value: 5 },
      { name: "Dell", value: 5 },
    ],
    routersList: [
      {
        name: "RouterA",
        ip: "10.1.1.1",
        vendor: "Cisco",
        region: "EU",
        status: "Up",
        trafficIn: 450,
        trafficOut: 420,
        latency: 12,
        uptime: 99.95,
      },
      {
        name: "RouterB",
        ip: "10.1.1.2",
        vendor: "Dell",
        region: "AS",
        status: "Down",
        trafficIn: 0,
        trafficOut: 0,
        latency: null,
        uptime: 90.2,
      },
    ],
  },

  firewalls: {
    total: 30,
    active: 25,
    down: 5,
    threatAlerts: 12,
    firewallsList: [
      {
        name: "FW01",
        ip: "172.16.0.2",
        vendor: "Palo Alto",
        region: "AS",
        status: "Active",
        cpu: 60,
        memory: 55,
        alerts: 5,
        lastCheckIn: "2 mins ago",
      },
      {
        name: "FW02",
        ip: "172.16.0.3",
        vendor: "Cisco",
        region: "EU",
        status: "Down",
        cpu: 0,
        memory: 0,
        alerts: 0,
        lastCheckIn: "1 day ago",
      },
    ],
  },

  servers: {
    total: 30,
    up: 25,
    down: 5,
    byOS: [
      { name: "Windows", value: 12 },
      { name: "Linux", value: 15 },
      { name: "Others", value: 3 },
    ],
    serversList: [
      {
        name: "Server01",
        ip: "10.0.5.5",
        os: "Linux",
        status: "Up",
        cpu: 70,
        memory: 65,
        disk: 55,
        alerts: 1,
        lastCheckIn: "1 min ago",
      },
      {
        name: "Server02",
        ip: "10.0.5.6",
        os: "Windows",
        status: "Down",
        cpu: 0,
        memory: 0,
        disk: 0,
        alerts: 0,
        lastCheckIn: "2 hours ago",
      },
    ],
  },
};

const KPICard = ({ title, value, subtitle, alert }) => (
  <div
    style={{
      backgroundColor: darkTheme.cardBg,
      borderRadius: 8,
      padding: 20,
      margin: "10px",
      minWidth: 140,
      flex: "1 1 140px",
      boxShadow: alert
        ? `0 0 10px ${darkTheme.alert}`
        : `0 0 10px ${darkTheme.accent}`,
      color: alert ? darkTheme.alert : darkTheme.text,
      userSelect: "none",
    }}
  >
    <div style={{ fontSize: 28, fontWeight: "bold" }}>{value}</div>
    <div style={{ fontSize: 14, opacity: 0.7 }}>{title}</div>
    {subtitle && (
      <div style={{ fontSize: 12, marginTop: 4, opacity: 0.6 }}>{subtitle}</div>
    )}
  </div>
);

export default function DevicesPage() {
  const [tab, setTab] = useState("inventory");
  const { devicesSummary, switches, routers, firewalls, servers } = sampleData;

  const percent = (val, total) => ((val / total) * 100).toFixed(1) + "%";

  const Table = ({ columns, data, renderCell }) => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: darkTheme.cardBg,
        color: darkTheme.text,
      }}
    >
      <thead>
        <tr>
          {columns.map((h) => (
            <th
              key={h}
              style={{
                borderBottom: `1px solid ${darkTheme.border}`,
                padding: "8px 12px",
                textAlign: "left",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map(renderCell)}</tbody>
    </table>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: darkTheme.background,
        padding: 20,
        color: darkTheme.text,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Device Inventory</h1>

      {/* Tabs */}
      <div
        style={{ marginBottom: 20, display: "flex", gap: 20, flexWrap: "wrap" }}
      >
        {[
          { key: "inventory", label: "Inventory Summary" },
          { key: "switches", label: "Switches" },
          { key: "routers", label: "Routers" },
          { key: "firewalls", label: "Firewalls" },
          { key: "servers", label: "Servers" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: 8,
              border: "none",
              fontWeight: tab === key ? "bold" : "normal",
              backgroundColor:
                tab === key ? darkTheme.accent : darkTheme.cardBg,
              color: tab === key ? darkTheme.background : darkTheme.text,
              boxShadow: tab === key ? `0 0 10px ${darkTheme.accent}` : "none",
              transition: "all 0.3s ease",
              userSelect: "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tab === "inventory" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <KPICard title="Total Devices" value={devicesSummary.total} />
              <KPICard
                title="Online Devices"
                value={devicesSummary.online}
                subtitle={percent(devicesSummary.online, devicesSummary.total)}
              />
              <KPICard
                title="Offline Devices"
                value={devicesSummary.offline}
                subtitle={percent(devicesSummary.offline, devicesSummary.total)}
                alert
              />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: 20,
                justifyContent: "space-around",
              }}
            >
              {/* Donut chart */}
              <div
                style={{
                  marginTop: 20,
                  width: 400,
                  height: 340,
                  backgroundColor: darkTheme.cardBg,
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                <h3 style={{ color: darkTheme.text, textAlign: "center" }}>
                  Devices by Type
                </h3>
                <ResponsiveContainer width="100%" height={290}>
                  <PieChart>
                    <Pie
                      data={devicesSummary.byType}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      label
                    >
                      {devicesSummary.byType.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkTheme.cardBg,
                        borderRadius: 8,
                      }}
                      itemStyle={{ color: darkTheme.text }}
                    />
                    <Legend wrapperStyle={{ color: darkTheme.text }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar chart */}
              <div
                style={{
                  marginTop: 20,
                  width: 400,
                  height: 340,
                  backgroundColor: darkTheme.cardBg,
                  borderRadius: 12,
                  // padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                }}
              >
                <h3 style={{ color: darkTheme.text, textAlign: "center" }}>
                  Devices by Vendor
                </h3>
                <ResponsiveContainer width="100%" height={290}>
                  <BarChart
                    data={devicesSummary.byVendor}
                    margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke={darkTheme.text} />
                    <YAxis stroke={darkTheme.text} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkTheme.cardBg,
                        borderRadius: 8,
                      }}
                      itemStyle={{ color: darkTheme.text }}
                    />
                    <Bar dataKey="value" fill={darkTheme.accent} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recently Added Devices */}
            <div style={{ marginTop: 30 }}>
              <h3 style={{ color: darkTheme.text }}>Recently Added Devices</h3>
              <Table
                columns={[
                  "Device Name",
                  "IP",
                  "Type",
                  "Vendor",
                  "Status",
                  "Last Seen",
                  "Alerts Count",
                ]}
                data={devicesSummary.recentDevices}
                renderCell={(device) => (
                  <tr
                    key={device.name}
                    style={{ borderBottom: `1px solid ${darkTheme.border}` }}
                  >
                    <td style={{ padding: "8px 12px" }}>{device.name}</td>
                    <td style={{ padding: "8px 12px" }}>{device.ip}</td>
                    <td style={{ padding: "8px 12px" }}>{device.type}</td>
                    <td style={{ padding: "8px 12px" }}>{device.vendor}</td>
                    <td
                      style={{
                        padding: "8px 12px",
                        color:
                          device.status === "Online"
                            ? "#32CD32"
                            : darkTheme.alert,
                        fontWeight: "bold",
                      }}
                    >
                      {device.status}
                    </td>
                    <td style={{ padding: "8px 12px" }}>{device.lastSeen}</td>
                    <td style={{ padding: "8px 12px" }}>{device.alerts}</td>
                  </tr>
                )}
              />
            </div>

            {/* Devices with Critical Alerts */}
            <div style={{ marginTop: 40 }}>
              <h3 style={{ color: darkTheme.alert }}>
                Devices with Critical Alerts (
                {devicesSummary.criticalAlerts.length})
              </h3>
              <Table
                columns={[
                  "Device Name",
                  "IP",
                  "Type",
                  "Vendor",
                  "Status",
                  "Last Seen",
                  "Alerts Count",
                ]}
                data={devicesSummary.criticalAlerts}
                renderCell={(device) => (
                  <tr
                    key={device.name}
                    style={{ borderBottom: `1px solid ${darkTheme.border}` }}
                  >
                    <td style={{ padding: "8px 12px" }}>{device.name}</td>
                    <td style={{ padding: "8px 12px" }}>{device.ip}</td>
                    <td style={{ padding: "8px 12px" }}>{device.type}</td>
                    <td style={{ padding: "8px 12px" }}>{device.vendor}</td>
                    <td
                      style={{
                        padding: "8px 12px",
                        color:
                          device.status === "Online"
                            ? "#32CD32"
                            : darkTheme.alert,
                        fontWeight: "bold",
                      }}
                    >
                      {device.status}
                    </td>
                    <td style={{ padding: "8px 12px" }}>{device.lastSeen}</td>
                    <td style={{ padding: "8px 12px" }}>{device.alerts}</td>
                  </tr>
                )}
              />
            </div>
          </>
        )}

        {tab === "switches" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <KPICard title="Total Switches" value={switches.total} />
              <KPICard
                title="Up"
                value={switches.up}
                subtitle={percent(switches.up, switches.total)}
              />
              <KPICard
                title="Down"
                value={switches.down}
                subtitle={percent(switches.down, switches.total)}
                alert
              />
            </div>

            <div
              style={{
                marginTop: 20,
                width: 400,
                height: 340,
                backgroundColor: darkTheme.cardBg,
                borderRadius: 12,
                // padding: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <h3 style={{ color: darkTheme.text, textAlign: "center" }}>
                Switches by Vendor
              </h3>
              <ResponsiveContainer width="100%" height={290}>
                <PieChart>
                  <Pie
                    data={switches.byVendor}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {switches.byVendor.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkTheme.cardBg,
                      borderRadius: 8,
                    }}
                    itemStyle={{ color: darkTheme.text }}
                  />
                  <Legend wrapperStyle={{ color: darkTheme.text }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 30 }}>
              <h3 style={{ color: darkTheme.text }}>Switches</h3>
              <Table
                columns={[
                  "Switch Name",
                  "IP",
                  "Vendor",
                  "Region",
                  "Status",
                  "Ports Used/Total",
                  "CPU %",
                  "Memory %",
                  "Last Check-in",
                ]}
                data={switches.switchesList}
                renderCell={(sw) => (
                  <tr
                    key={sw.name}
                    style={{ borderBottom: `1px solid ${darkTheme.border}` }}
                  >
                    <td style={{ padding: "8px 12px" }}>{sw.name}</td>
                    <td style={{ padding: "8px 12px" }}>{sw.ip}</td>
                    <td style={{ padding: "8px 12px" }}>{sw.vendor}</td>
                    <td style={{ padding: "8px 12px" }}>{sw.region}</td>
                    <td
                      style={{
                        padding: "8px 12px",
                        color: sw.status === "Up" ? "#32CD32" : darkTheme.alert,
                        fontWeight: "bold",
                      }}
                    >
                      {sw.status}
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      {sw.portsUsed}/{sw.portsTotal}
                    </td>
                    <td style={{ padding: "8px 12px" }}>{sw.cpu}%</td>
                    <td style={{ padding: "8px 12px" }}>{sw.memory}%</td>
                    <td style={{ padding: "8px 12px" }}>{sw.lastCheckIn}</td>
                  </tr>
                )}
              />
            </div>
          </>
        )}

        {tab === "routers" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <KPICard title="Total Routers" value={routers.total} />
              <KPICard
                title="Up"
                value={routers.up}
                subtitle={percent(routers.up, routers.total)}
              />
              <KPICard
                title="Down"
                value={routers.down}
                subtitle={percent(routers.down, routers.total)}
                alert
              />
            </div>

            <div
              style={{
                marginTop: 20,
                width: 400,
                height: 320,
                backgroundColor: darkTheme.cardBg,
                borderRadius: 12,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <h3 style={{ color: darkTheme.text, textAlign: "center" }}>
                Routers by Vendor
              </h3>
              <ResponsiveContainer width="100%" height={290}>
                <BarChart data={routers.byVendor} margin={{ bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke={darkTheme.text} />
                  <YAxis stroke={darkTheme.text} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkTheme.cardBg,
                      borderRadius: 8,
                    }}
                    itemStyle={{ color: darkTheme.text }}
                  />
                  <Bar dataKey="value" fill={darkTheme.accent} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 30 }}>
              <h3 style={{ color: darkTheme.text }}>Routers</h3>
              <Table
                columns={[
                  "Router Name",
                  "IP",
                  "Vendor",
                  "Region",
                  "Status",
                  "Traffic In (Mbps)",
                  "Traffic Out (Mbps)",
                  "Latency (ms)",
                  "Uptime %",
                ]}
                data={routers.routersList}
                renderCell={(router) => (
                  <tr
                    key={router.name}
                    style={{ borderBottom: `1px solid ${darkTheme.border}` }}
                  >
                    <td style={{ padding: "8px 12px" }}>{router.name}</td>
                    <td style={{ padding: "8px 12px" }}>{router.ip}</td>
                    <td style={{ padding: "8px 12px" }}>{router.vendor}</td>
                    <td style={{ padding: "8px 12px" }}>{router.region}</td>
                    <td
                      style={{
                        padding: "8px 12px",
                        color:
                          router.status === "Up" ? "#32CD32" : darkTheme.alert,
                        fontWeight: "bold",
                      }}
                    >
                      {router.status}
                    </td>
                    <td style={{ padding: "8px 12px" }}>{router.trafficIn}</td>
                    <td style={{ padding: "8px 12px" }}>{router.trafficOut}</td>
                    <td style={{ padding: "8px 12px" }}>
                      {router.latency === null ? "N/A" : router.latency}
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      {router.uptime.toFixed(2)}
                    </td>
                  </tr>
                )}
              />
            </div>
          </>
        )}

        {tab === "firewalls" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <KPICard title="Total Firewalls" value={firewalls.total} />
              <KPICard
                title="Active"
                value={firewalls.active}
                subtitle={percent(firewalls.active, firewalls.total)}
              />
              <KPICard
                title="Down"
                value={firewalls.down}
                subtitle={percent(firewalls.down, firewalls.total)}
                alert
              />
              <KPICard
                title="Threat Alerts"
                value={firewalls.threatAlerts}
                alert
              />
            </div>

            <div style={{ marginTop: 30 }}>
              <h3 style={{ color: darkTheme.text }}>Firewalls</h3>
              <Table
                columns={[
                  "Firewall Name",
                  "IP",
                  "Vendor",
                  "Region",
                  "Status",
                  "CPU %",
                  "Memory %",
                  "Alerts Count",
                  "Last Check-in",
                ]}
                data={firewalls.firewallsList}
                renderCell={(fw) => (
                  <tr
                    key={fw.name}
                    style={{ borderBottom: `1px solid ${darkTheme.border}` }}
                  >
                    <td style={{ padding: "8px 12px" }}>{fw.name}</td>
                    <td style={{ padding: "8px 12px" }}>{fw.ip}</td>
                    <td style={{ padding: "8px 12px" }}>{fw.vendor}</td>
                    <td style={{ padding: "8px 12px" }}>{fw.region}</td>
                    <td
                      style={{
                        padding: "8px 12px",
                        color:
                          fw.status === "Active" ? "#32CD32" : darkTheme.alert,
                        fontWeight: "bold",
                      }}
                    >
                      {fw.status}
                    </td>
                    <td style={{ padding: "8px 12px" }}>{fw.cpu}%</td>
                    <td style={{ padding: "8px 12px" }}>{fw.memory}%</td>
                    <td style={{ padding: "8px 12px" }}>{fw.alerts}</td>
                    <td style={{ padding: "8px 12px" }}>{fw.lastCheckIn}</td>
                  </tr>
                )}
              />
            </div>
          </>
        )}

        {tab === "servers" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <KPICard title="Total Servers" value={servers.total} />
              <KPICard
                title="Up"
                value={servers.up}
                subtitle={percent(servers.up, servers.total)}
              />
              <KPICard
                title="Down"
                value={servers.down}
                subtitle={percent(servers.down, servers.total)}
                alert
              />
            </div>

            <div
              style={{
                marginTop: 20,
                width: 400,
                height: 340,
                backgroundColor: darkTheme.cardBg,
                borderRadius: 12,
                // padding: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <h3 style={{ color: darkTheme.text, textAlign: "center" }}>
                Servers by OS
              </h3>
              <ResponsiveContainer width="100%" height={290}>
                <PieChart>
                  <Pie
                    data={servers.byOS}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {servers.byOS.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkTheme.cardBg,
                      borderRadius: 8,
                    }}
                    itemStyle={{ color: darkTheme.text }}
                  />
                  <Legend wrapperStyle={{ color: darkTheme.text }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 30 }}>
              <h3 style={{ color: darkTheme.text }}>Servers</h3>
              <Table
                columns={[
                  "Server Name",
                  "IP",
                  "OS",
                  "Status",
                  "CPU %",
                  "Memory %",
                  "Disk %",
                  "Alerts Count",
                  "Last Check-in",
                ]}
                data={servers.serversList}
                renderCell={(server) => (
                  <tr
                    key={server.name}
                    style={{ borderBottom: `1px solid ${darkTheme.border}` }}
                  >
                    <td style={{ padding: "8px 12px" }}>{server.name}</td>
                    <td style={{ padding: "8px 12px" }}>{server.ip}</td>
                    <td style={{ padding: "8px 12px" }}>{server.os}</td>
                    <td
                      style={{
                        padding: "8px 12px",
                        color:
                          server.status === "Up" ? "#32CD32" : darkTheme.alert,
                        fontWeight: "bold",
                      }}
                    >
                      {server.status}
                    </td>
                    <td style={{ padding: "8px 12px" }}>{server.cpu}%</td>
                    <td style={{ padding: "8px 12px" }}>{server.memory}%</td>
                    <td style={{ padding: "8px 12px" }}>{server.disk}%</td>
                    <td style={{ padding: "8px 12px" }}>{server.alerts}</td>
                    <td style={{ padding: "8px 12px" }}>
                      {server.lastCheckIn}
                    </td>
                  </tr>
                )}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
