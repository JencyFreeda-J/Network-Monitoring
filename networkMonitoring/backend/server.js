import express from "express";
import os from "os";
import { exec } from "child_process";
import { WebSocketServer } from "ws";
import si from "systeminformation";
import cors from "cors";
import { createServer } from "http";

const app = express();
const PORT = 3001;

// ---------------------- CORS Configuration ---------------------- //
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ---------------------- Helpers ---------------------- //

// Scan devices on LAN using nmap
function scanDevices(subnet = "192.168.1.0/24") {
  return new Promise((resolve) => {
    exec(`nmap -sn ${subnet}`, (err, stdout) => {
      if (err) return resolve([]);
      const devices = [];
      let current = {};
      stdout.split("\n").forEach((line) => {
        if (line.startsWith("Nmap scan report for")) {
          if (current.ip) devices.push(current);
          current = { ip: line.split(" ").pop() };
        }
        if (line.includes("MAC Address")) {
          current.mac = line.split("MAC Address: ")[1].split(" ")[0];
          current.vendor = line.split("(")[1]?.replace(")", "") || "";
        }
      });
      if (current.ip) devices.push(current);
      resolve(devices);
    });
  });
}

// Get CPU usage (systeminformation)
async function getCpuUsage() {
  try {
    const load = await si.currentLoad();
    return parseFloat(load.currentLoad.toFixed(2));
  } catch (error) {
    console.error("Error getting CPU usage:", error);
    return 0;
  }
}

// Get network bandwidth (rx/tx bytes)
let lastNet = null;
async function getBandwidth() {
  try {
    const stats = await si.networkStats();
    const now = Date.now();

    if (!lastNet || !stats || stats.length === 0) {
      lastNet = { stats, ts: now };
      return { rx: 0, tx: 0, ts: now };
    }

    const diffTime = (now - lastNet.ts) / 1000; // seconds
    const rxDiff = stats[0].rx_bytes - lastNet.stats[0].rx_bytes;
    const txDiff = stats[0].tx_bytes - lastNet.stats[0].tx_bytes;

    lastNet = { stats, ts: now };

    return {
      rx: Math.max(0, parseFloat((rxDiff / diffTime / 1024).toFixed(2))), // KB/s
      tx: Math.max(0, parseFloat((txDiff / diffTime / 1024).toFixed(2))), // KB/s
      ts: now,
    };
  } catch (error) {
    console.error("Error getting bandwidth:", error);
    return { rx: 0, tx: 0, ts: Date.now() };
  }
}

// Fake alerts (could be pulled from DB)
function getAlerts() {
  return [
    {
      alert: "High CPU usage",
      severity: "Critical",
      time: new Date().toISOString(),
    },
    {
      alert: "Router latency above threshold",
      severity: "Warning",
      time: new Date().toISOString(),
    },
  ];
}

// Fake integrations
function getIntegrations() {
  return [
    {
      name: "Grafana",
      status: "Connected",
      lastSync: new Date().toISOString(),
    },
    {
      name: "Slack",
      status: "Connected",
      lastSync: new Date().toISOString(),
    },
  ];
}

// ---------------------- REST API ---------------------- //

app.get("/api/cpu", async (req, res) => {
  try {
    const cpu = await getCpuUsage();
    res.json({ cpu });
  } catch (error) {
    console.error("Error in /api/cpu:", error);
    res.status(500).json({ error: "Failed to get CPU usage" });
  }
});

app.get("/api/devices", async (req, res) => {
  try {
    const devices = await scanDevices();
    res.json(devices);
  } catch (error) {
    console.error("Error in /api/devices:", error);
    res.status(500).json({ error: "Failed to scan devices" });
  }
});

app.get("/api/bandwidth", async (req, res) => {
  try {
    const bw = await getBandwidth();
    res.json(bw);
  } catch (error) {
    console.error("Error in /api/bandwidth:", error);
    res.status(500).json({ error: "Failed to get bandwidth" });
  }
});

app.get("/api/alerts", (req, res) => {
  try {
    res.json(getAlerts());
  } catch (error) {
    console.error("Error in /api/alerts:", error);
    res.status(500).json({ error: "Failed to get alerts" });
  }
});

app.get("/api/integrations", (req, res) => {
  try {
    res.json(getIntegrations());
  } catch (error) {
    console.error("Error in /api/integrations:", error);
    res.status(500).json({ error: "Failed to get integrations" });
  }
});

// ---------------------- Create HTTP Server ---------------------- //

const server = createServer(app);

// ---------------------- WebSockets ---------------------- //

const wss = new WebSocketServer({
  server: server,
  path: "/ws",
});

console.log(
  "WebSocket server will be available at ws://localhost:" + PORT + "/ws"
);

// Store active connections by type
const connections = {
  cpu: new Set(),
  devices: new Set(),
  bandwidth: new Set(),
};

// Handle WebSocket connections
wss.on("connection", (ws, req) => {
  console.log("New WebSocket connection established");

  // Parse the URL to determine connection type
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const connectionType = url.searchParams.get("type");

  console.log("Connection type:", connectionType);

  if (connectionType === "cpu") {
    connections.cpu.add(ws);

    // Send initial data
    getCpuUsage().then((cpu) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: "cpu", value: cpu, ts: Date.now() }));
      }
    });

    ws.on("close", () => {
      connections.cpu.delete(ws);
      console.log("CPU WebSocket connection closed");
    });
  }

  if (connectionType === "devices") {
    connections.devices.add(ws);

    // Send initial data
    scanDevices().then((devices) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: "devices", devices }));
      }
    });

    ws.on("close", () => {
      connections.devices.delete(ws);
      console.log("Devices WebSocket connection closed");
    });
  }

  if (connectionType === "bandwidth") {
    connections.bandwidth.add(ws);

    // Send initial data
    getBandwidth().then((bw) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: "bandwidth", ...bw }));
      }
    });

    ws.on("close", () => {
      connections.bandwidth.delete(ws);
      console.log("Bandwidth WebSocket connection closed");
    });
  }

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Broadcast data to connected clients
function broadcastToCpuClients() {
  getCpuUsage()
    .then((cpu) => {
      const data = JSON.stringify({ type: "cpu", value: cpu, ts: Date.now() });
      connections.cpu.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(data);
        }
      });
    })
    .catch((error) => {
      console.error("Error broadcasting CPU data:", error);
    });
}

function broadcastToDeviceClients() {
  scanDevices()
    .then((devices) => {
      const data = JSON.stringify({ type: "devices", devices });
      connections.devices.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(data);
        }
      });
    })
    .catch((error) => {
      console.error("Error broadcasting device data:", error);
    });
}

function broadcastToBandwidthClients() {
  getBandwidth()
    .then((bw) => {
      const data = JSON.stringify({ type: "bandwidth", ...bw });
      connections.bandwidth.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(data);
        }
      });
    })
    .catch((error) => {
      console.error("Error broadcasting bandwidth data:", error);
    });
}

// Set up intervals for broadcasting
setInterval(broadcastToCpuClients, 2000); // Every 2 seconds
setInterval(broadcastToDeviceClients, 10000); // Every 10 seconds
setInterval(broadcastToBandwidthClients, 3000); // Every 3 seconds

// ---------------------- Start Server ---------------------- //

server.listen(PORT, () => {
  console.log(`REST API running at http://localhost:${PORT}`);
  console.log(`WebSocket server running at ws://localhost:${PORT}/ws`);
  console.log("CORS enabled for:", corsOptions.origin);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
