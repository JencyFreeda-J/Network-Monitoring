import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          backgroundColor: "var(--background)", // use your CSS variable
          color: "var(--foreground)", // use your CSS variable
          // optionally add font smoothing, etc.
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <AppSidebar />
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              backgroundColor: "var(--card)", // dark theme card background
              borderBottom: `1px solid var(--border)`,
              width: "100%", // Force header full width
            }}
          >
            <SidebarTrigger />
            <h2 style={{ marginLeft: "1rem", color: "var(--card-foreground)" }}>
              Network Monitoring
            </h2>
          </div>

          {/* Page Content */}
          <main
            style={{
              flexGrow: 1,
              overflowY: "auto",
              padding: "1rem",
              width: "100%", // Force outlet container full width
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
