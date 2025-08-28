import React, { useState, useEffect } from "react";

const darkTheme = {
  background: "#121212",
  text: "#E0E0E0",
  cardBg: "#1E1E1E",
  border: "#333",
  accent: "#00BFFF",
  alertCritical: "#FF3B30",
  alertWarning: "#FF9500",
  alertInfo: "#007AFF",
  acknowledged: "#32CD32",
};

const sampleAlertsActive = [
  {
    id: "A001",
    name: "CPU Spike on RouterA",
    severity: "Critical",
    device: "RouterA",
    region: "EU",
    source: "SolarWinds",
    timestamp: "2025-07-21 14:32:10",
    duration: "00:12:45",
    status: "Unacknowledged",
    description:
      "CPU usage on RouterA spiked above 90% continuously for 10 minutes.",
    affectedInterfaces: ["eth0", "eth1"],
    troubleshooting:
      "Check for routing loops or misconfigured processes on the router.",
    historyTrend: [5, 15, 40, 80, 95, 92, 91],
  },
  {
    id: "A002",
    name: "WAN Link Down - Site B",
    severity: "Warning",
    device: "WAN Link B",
    region: "NA",
    source: "Azure",
    timestamp: "2025-07-21 13:20:05",
    duration: "00:58:00",
    status: "Acknowledged",
    description: "WAN Link B reported loss of connectivity.",
    affectedInterfaces: ["wan0"],
    troubleshooting: "Check ISP connectivity and link hardware.",
    historyTrend: [20, 15, 10, 0, 0, 0, 0],
  },
  {
    id: "A003",
    name: "Port Flapping - Switch22",
    severity: "Info",
    device: "Switch22 - Port 10",
    region: "AS",
    source: "Switch Vendor",
    timestamp: "2025-07-21 15:05:50",
    duration: "00:05:30",
    status: "Unacknowledged",
    description: "Port 10 on Switch22 flapping detected.",
    affectedInterfaces: ["port10"],
    troubleshooting: "Verify cable connections and port configuration.",
    historyTrend: [0, 0, 5, 10, 3, 0, 0],
  },
  // Add more sample alerts as needed...
];

const sampleAlertsHistory = [
  {
    id: "H001",
    name: "Memory Leak on FirewallX",
    severity: "Critical",
    device: "FirewallX",
    region: "EU",
    source: "CATO",
    timestamp: "2025-07-15 10:00:00",
    resolutionTime: "2025-07-15 12:30:00",
    duration: "02:30:00",
    finalStatus: "Resolved",
    acknowledgedBy: "admin",
  },
  {
    id: "H002",
    name: "Interface Down - Switch09",
    severity: "Warning",
    device: "Switch09",
    region: "NA",
    source: "SolarWinds",
    timestamp: "2025-07-10 08:00:00",
    resolutionTime: "2025-07-10 09:15:00",
    duration: "01:15:00",
    finalStatus: "False Positive",
    acknowledgedBy: "tech1",
  },
  // Add more historical alerts...
];

// Utility: color based on severity
const severityColors = {
  Critical: darkTheme.alertCritical,
  Warning: darkTheme.alertWarning,
  Info: darkTheme.alertInfo,
};

// Utility: color based on status
const statusColors = {
  Acknowledged: darkTheme.acknowledged,
  Unacknowledged: darkTheme.alertCritical,
};

const KPICard = ({ title, value, color }) => (
  <div
    style={{
      backgroundColor: darkTheme.cardBg,
      borderRadius: 8,
      padding: 20,
      minWidth: 160,
      flex: "1 1 160px",
      margin: 8,
      boxShadow: `0 0 10px ${color}`,
      color: color,
      fontWeight: "600",
      userSelect: "none",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 30, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 16, marginTop: 6 }}>{title}</div>
  </div>
);

const Table = ({ columns, data, renderRow }) => (
  <div
    style={{
      overflowX: "auto",
      marginTop: 24,
      borderRadius: 8,
      boxShadow: `0 0 15px ${darkTheme.border}`,
    }}
  >
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: darkTheme.cardBg,
        color: darkTheme.text,
        fontSize: 14,
      }}
    >
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              style={{
                padding: "14px 16px",
                textAlign: "left",
                borderBottom: `2px solid ${darkTheme.border}`,
                whiteSpace: "nowrap",
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map(renderRow)}</tbody>
    </table>
  </div>
);

export default function AlertsEventsPage() {
  const [tab, setTab] = useState("active");
  const [alertsActive, setAlertsActive] = useState(sampleAlertsActive);
  const [alertsHistory, setAlertsHistory] = useState(sampleAlertsHistory);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filters, setFilters] = useState({
    severity: "All",
    source: "All",
    region: "All",
    deviceType: "All",
    search: "",
  });
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Filtering helpers for Active Alerts
  const filterActiveAlerts = () => {
    return alertsActive.filter((alert) => {
      if (filters.severity !== "All" && alert.severity !== filters.severity)
        return false;
      if (filters.source !== "All" && alert.source !== filters.source)
        return false;
      if (filters.region !== "All" && alert.region !== filters.region)
        return false;
      if (filters.deviceType !== "All") {
        // For demo, filter by if device string includes deviceType (simple)
        if (
          !alert.device.toLowerCase().includes(filters.deviceType.toLowerCase())
        )
          return false;
      }
      if (
        filters.search &&
        !alert.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !alert.device.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  };

  // Filtering helpers for History Alerts (also date filtering)
  const filterHistoryAlerts = () => {
    return alertsHistory.filter((alert) => {
      if (filters.severity !== "All" && alert.severity !== filters.severity)
        return false;
      if (filters.source !== "All" && alert.source !== filters.source)
        return false;
      if (filters.region !== "All" && alert.region !== filters.region)
        return false;
      if (filters.deviceType !== "All") {
        if (
          !alert.device.toLowerCase().includes(filters.deviceType.toLowerCase())
        )
          return false;
      }
      if (
        filters.search &&
        !alert.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !alert.device.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;

      if (dateRange.from) {
        if (new Date(alert.timestamp) < new Date(dateRange.from)) return false;
      }
      if (dateRange.to) {
        if (new Date(alert.timestamp) > new Date(dateRange.to)) return false;
      }
      return true;
    });
  };

  // Summary counts for active alerts
  const activeCounts = alertsActive.reduce(
    (acc, alert) => {
      acc.total++;
      if (alert.severity === "Critical") acc.critical++;
      else if (alert.severity === "Warning") acc.warning++;
      else if (alert.severity === "Info") acc.info++;
      return acc;
    },
    { total: 0, critical: 0, warning: 0, info: 0 }
  );

  // Summary counts for history alerts in date range
  const historyCounts = filterHistoryAlerts().reduce(
    (acc, alert) => {
      acc.total++;
      if (alert.severity === "Critical") acc.critical++;
      else if (alert.severity === "Warning") acc.warning++;
      else if (alert.severity === "Info") acc.info++;
      return acc;
    },
    { total: 0, critical: 0, warning: 0, info: 0 }
  );

  // Unique filter options from sample data for selects
  const uniqueValues = (arr, key) => [
    "All",
    ...Array.from(new Set(arr.map((i) => i[key]))).sort(),
  ];

  // Handle acknowledgment toggle for active alerts
  const toggleAcknowledge = (alertId) => {
    setAlertsActive((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status:
                a.status === "Acknowledged" ? "Unacknowledged" : "Acknowledged",
            }
          : a
      )
    );
  };

  // Clear selection when switching tabs
  useEffect(() => {
    setSelectedAlert(null);
  }, [tab]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: darkTheme.background,
        color: darkTheme.text,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <h1 style={{ margin: 0, fontWeight: "700" }}>Alerts & Events</h1>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 40,
          borderBottom: `2px solid ${darkTheme.border}`,
        }}
      >
        {[
          { key: "active", label: "Active Alerts" },
          { key: "history", label: "Alert History" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: "12px 24px",
              cursor: "pointer",
              border: "none",
              borderBottom:
                tab === key ? `4px solid ${darkTheme.accent}` : "none",
              backgroundColor: "transparent",
              color: tab === key ? darkTheme.accent : darkTheme.text,
              fontWeight: tab === key ? "700" : "500",
              fontSize: 18,
              userSelect: "none",
              transition: "all 0.3s ease",
            }}
            aria-selected={tab === key}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters and KPIs */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            flexGrow: 1,
            minWidth: 320,
          }}
        >
          {/* Severity */}
          <select
            value={filters.severity}
            onChange={(e) =>
              setFilters((f) => ({ ...f, severity: e.target.value }))
            }
            style={selectStyle}
            aria-label="Filter by severity"
          >
            {uniqueValues(
              tab === "active" ? alertsActive : alertsHistory,
              "severity"
            ).map((sev) => (
              <option key={sev} value={sev}>
                {sev}
              </option>
            ))}
          </select>

          {/* Source */}
          <select
            value={filters.source}
            onChange={(e) =>
              setFilters((f) => ({ ...f, source: e.target.value }))
            }
            style={selectStyle}
            aria-label="Filter by alert source"
          >
            {uniqueValues(
              tab === "active" ? alertsActive : alertsHistory,
              "source"
            ).map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>

          {/* Region */}
          <select
            value={filters.region}
            onChange={(e) =>
              setFilters((f) => ({ ...f, region: e.target.value }))
            }
            style={selectStyle}
            aria-label="Filter by region"
          >
            {uniqueValues(
              tab === "active" ? alertsActive : alertsHistory,
              "region"
            ).map((rgn) => (
              <option key={rgn} value={rgn}>
                {rgn}
              </option>
            ))}
          </select>

          {/* Device Type */}
          <input
            type="text"
            placeholder="Device Type"
            value={filters.deviceType}
            onChange={(e) =>
              setFilters((f) => ({ ...f, deviceType: e.target.value }))
            }
            style={{
              ...selectStyle,
              minWidth: 120,
              color: darkTheme.text,
              backgroundColor: darkTheme.cardBg,
              borderColor: darkTheme.border,
            }}
            aria-label="Filter by device type"
          />

          {/* Search */}
          <input
            type="search"
            placeholder="Search alert or device"
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            style={{
              ...selectStyle,
              minWidth: 180,
              color: darkTheme.text,
              backgroundColor: darkTheme.cardBg,
              borderColor: darkTheme.border,
            }}
            aria-label="Search alerts by name or device"
          />
        </div>

        {/* Date Range filter for history */}
        {tab === "history" && (
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            <label htmlFor="fromDate" style={{ fontSize: 14, opacity: 0.7 }}>
              From:
            </label>
            <input
              id="fromDate"
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((d) => ({ ...d, from: e.target.value }))
              }
              style={dateInputStyle}
              aria-label="Start date filter"
            />
            <label htmlFor="toDate" style={{ fontSize: 14, opacity: 0.7 }}>
              To:
            </label>
            <input
              id="toDate"
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((d) => ({ ...d, to: e.target.value }))
              }
              style={dateInputStyle}
              aria-label="End date filter"
            />
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginTop: 12,
          justifyContent: tab === "active" ? "flex-start" : "center",
        }}
      >
        {tab === "active" ? (
          <>
            <KPICard
              title="Total Active Alerts"
              value={activeCounts.total}
              color={darkTheme.accent}
            />
            <KPICard
              title="Critical"
              value={activeCounts.critical}
              color={darkTheme.alertCritical}
            />
            <KPICard
              title="Warning"
              value={activeCounts.warning}
              color={darkTheme.alertWarning}
            />
            <KPICard
              title="Info"
              value={activeCounts.info}
              color={darkTheme.alertInfo}
            />
          </>
        ) : (
          <>
            <KPICard
              title="Total Alerts"
              value={historyCounts.total}
              color={darkTheme.accent}
            />
            <KPICard
              title="Critical"
              value={historyCounts.critical}
              color={darkTheme.alertCritical}
            />
            <KPICard
              title="Warning"
              value={historyCounts.warning}
              color={darkTheme.alertWarning}
            />
            <KPICard
              title="Info"
              value={historyCounts.info}
              color={darkTheme.alertInfo}
            />
          </>
        )}
      </div>

      {/* Main content & side panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          marginTop: 16,
          flexGrow: 1,
          minHeight: 420,
          position: "relative",
        }}
      >
        {/* Alerts Table */}
        <div style={{ flex: 1, minWidth: 320, overflow: "auto" }}>
          {tab === "active" && (
            <Table
              columns={[
                "Alert ID / Name",
                "Severity",
                "Device / Interface",
                "Region / Location",
                "Alert Source",
                "Timestamp",
                "Duration",
                "Status",
                "Actions",
              ]}
              data={filterActiveAlerts()}
              renderRow={(alert) => (
                <tr
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedAlert?.id === alert.id
                        ? darkTheme.accent + "22"
                        : "transparent",
                    transition: "background-color 0.3s",
                    userSelect: "none",
                    height: 48,
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setSelectedAlert(alert);
                  }}
                  aria-selected={selectedAlert?.id === alert.id}
                >
                  <td style={{ padding: "10px 12px", fontWeight: "600" }}>
                    <div>{alert.id}</div>
                    <div
                      style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}
                      title={alert.name}
                    >
                      {alert.name.length > 30
                        ? alert.name.slice(0, 27) + "..."
                        : alert.name}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        color: severityColors[alert.severity],
                        fontWeight: "700",
                      }}
                      aria-label={`Severity: ${alert.severity}`}
                    >
                      ● {alert.severity}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>{alert.device}</td>
                  <td style={{ padding: "10px 12px" }}>{alert.region}</td>
                  <td style={{ padding: "10px 12px" }}>{alert.source}</td>
                  <td style={{ padding: "10px 12px" }}>{alert.timestamp}</td>
                  <td style={{ padding: "10px 12px" }}>{alert.duration}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        color: statusColors[alert.status],
                        fontWeight: "700",
                      }}
                      aria-label={`Status: ${alert.status}`}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAcknowledge(alert.id);
                      }}
                      style={{
                        backgroundColor:
                          alert.status === "Acknowledged"
                            ? darkTheme.acknowledged
                            : darkTheme.alertCritical,
                        color: darkTheme.background,
                        border: "none",
                        borderRadius: 4,
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                      aria-label={
                        alert.status === "Acknowledged"
                          ? "Unacknowledge alert"
                          : "Acknowledge alert"
                      }
                    >
                      {alert.status === "Acknowledged" ? "Unack" : "Ack"}
                    </button>
                  </td>
                </tr>
              )}
            />
          )}

          {tab === "history" && (
            <>
              <Table
                columns={[
                  "Alert ID / Name",
                  "Severity",
                  "Device / Interface",
                  "Region / Location",
                  "Alert Source",
                  "Timestamp",
                  "Resolution Time",
                  "Duration",
                  "Final Status",
                  "Acknowledged By",
                ]}
                data={filterHistoryAlerts()}
                renderRow={(alert) => (
                  <tr
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedAlert?.id === alert.id
                          ? darkTheme.accent + "22"
                          : "transparent",
                      transition: "background-color 0.3s",
                      userSelect: "none",
                      height: 48,
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setSelectedAlert(alert);
                    }}
                    aria-selected={selectedAlert?.id === alert.id}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: "600" }}>
                      <div>{alert.id}</div>
                      <div
                        style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}
                        title={alert.name}
                      >
                        {alert.name.length > 30
                          ? alert.name.slice(0, 27) + "..."
                          : alert.name}
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={{
                          color: severityColors[alert.severity],
                          fontWeight: "700",
                        }}
                        aria-label={`Severity: ${alert.severity}`}
                      >
                        ● {alert.severity}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>{alert.device}</td>
                    <td style={{ padding: "10px 12px" }}>{alert.region}</td>
                    <td style={{ padding: "10px 12px" }}>{alert.source}</td>
                    <td style={{ padding: "10px 12px" }}>{alert.timestamp}</td>
                    <td style={{ padding: "10px 12px" }}>
                      {alert.resolutionTime}
                    </td>
                    <td style={{ padding: "10px 12px" }}>{alert.duration}</td>
                    <td style={{ padding: "10px 12px" }}>
                      {alert.finalStatus}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      {alert.acknowledgedBy}
                    </td>
                  </tr>
                )}
              />

              {/* Export Button */}
              <div style={{ marginTop: 16, textAlign: "right" }}>
                <button
                  onClick={() => {
                    // Simple CSV export demo
                    const rows = [
                      [
                        "Alert ID",
                        "Name",
                        "Severity",
                        "Device",
                        "Region",
                        "Source",
                        "Timestamp",
                        "Resolution Time",
                        "Duration",
                        "Final Status",
                        "Acknowledged By",
                      ],
                      ...filterHistoryAlerts().map((a) => [
                        a.id,
                        `"${a.name}"`,
                        a.severity,
                        a.device,
                        a.region,
                        a.source,
                        a.timestamp,
                        a.resolutionTime,
                        a.duration,
                        a.finalStatus,
                        a.acknowledgedBy,
                      ]),
                    ];
                    const csvContent =
                      "data:text/csv;charset=utf-8," +
                      rows.map((e) => e.join(",")).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute(
                      "download",
                      `alert_history_${new Date()
                        .toISOString()
                        .slice(0, 10)}.csv`
                    );
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  style={{
                    backgroundColor: darkTheme.accent,
                    color: darkTheme.background,
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 20px",
                    fontWeight: "700",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  aria-label="Export alerts to CSV"
                >
                  Export CSV
                </button>
              </div>

              {/* Trend charts placeholder */}
              <div
                style={{
                  marginTop: 40,
                  color: darkTheme.text,
                  fontStyle: "italic",
                  opacity: 0.6,
                  textAlign: "center",
                }}
              >
                [Trend Charts - volume by day/week/month to be implemented]
              </div>
            </>
          )}
        </div>

        {/* Alert Details Flyout */}
        {selectedAlert && (
          <aside
            role="complementary"
            aria-label="Alert details"
            style={{
              width: 380,
              backgroundColor: darkTheme.cardBg,
              borderLeft: `2px solid ${darkTheme.border}`,
              borderRadius: 8,
              padding: 24,
              overflowY: "auto",
              boxShadow: `-6px 0 15px ${darkTheme.border}`,
            }}
          >
            <button
              onClick={() => setSelectedAlert(null)}
              aria-label="Close alert details"
              style={{
                background: "transparent",
                border: "none",
                color: darkTheme.text,
                fontSize: 24,
                fontWeight: "700",
                cursor: "pointer",
                position: "absolute",
                top: 16,
                right: 24,
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              &times;
            </button>

            <h2 style={{ marginTop: 0, marginBottom: 12 }}>
              {selectedAlert.name}
            </h2>
            <p style={{ fontSize: 14, opacity: 0.8 }}>
              {selectedAlert.description}
            </p>

            <div style={{ marginTop: 16 }}>
              <strong>Affected Interfaces:</strong>
              <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                {selectedAlert.affectedInterfaces?.map((intf) => (
                  <li key={intf}>{intf}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 16 }}>
              <strong>Troubleshooting Tips:</strong>
              <p style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
                {selectedAlert.troubleshooting}
              </p>
            </div>

            <div style={{ marginTop: 16 }}>
              <strong>Historical Trend:</strong>
              <TrendChart data={selectedAlert.historyTrend || []} />
            </div>

            {/* Comments and escalation area (basic placeholder) */}
            {tab === "active" && (
              <div style={{ marginTop: 24 }}>
                <button
                  style={{
                    backgroundColor: darkTheme.accent,
                    color: darkTheme.background,
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontWeight: "700",
                    width: "100%",
                    userSelect: "none",
                  }}
                  onClick={() => alert("Escalate action triggered (demo)")}
                >
                  Escalate Alert
                </button>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

// Simple sparkline trend chart using inline SVG
function TrendChart({ data }) {
  if (!data.length) {
    return <div style={{ fontSize: 12, opacity: 0.5 }}>No trend data</div>;
  }
  const max = Math.max(...data);
  const min = Math.min(...data);
  const width = 320;
  const height = 60;
  const padding = 8;
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 2 * padding) + padding;
      // invert y: higher value is higher on chart
      const y =
        height -
        padding -
        ((val - min) / (max - min || 1)) * (height - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} aria-label="Historical alert trend">
      <polyline
        fill="none"
        stroke="#00BFFF"
        strokeWidth="2"
        points={points}
        style={{ filter: "drop-shadow(0 0 1px #00BFFF)" }}
      />
      {/* Circles */}
      {data.map((val, idx) => {
        const x = (idx / (data.length - 1)) * (width - 2 * padding) + padding;
        const y =
          height -
          padding -
          ((val - min) / (max - min || 1)) * (height - 2 * padding);
        return (
          <circle
            key={idx}
            cx={x}
            cy={y}
            r={3}
            fill="#00BFFF"
            stroke="white"
            strokeWidth={0.5}
          />
        );
      })}
    </svg>
  );
}

// Styles reused
const selectStyle = {
  padding: "8px 12px",
  borderRadius: 6,
  border: `1px solid #444`,
  backgroundColor: darkTheme.cardBg,
  color: darkTheme.text,
  minWidth: 120,
  fontSize: 14,
  cursor: "pointer",
  userSelect: "none",
};

const dateInputStyle = {
  padding: "6px 10px",
  borderRadius: 6,
  border: `1px solid #444`,
  backgroundColor: darkTheme.cardBg,
  color: darkTheme.text,
  fontSize: 14,
  cursor: "pointer",
  userSelect: "none",
};
