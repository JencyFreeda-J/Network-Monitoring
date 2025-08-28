import {
  BookMarked,
  Cable,
  GlobeLock,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Workflow,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Link } from "react-router-dom";
import { NavUser } from "./nav-user";

const items = [
  { title: "Dashboard", url: "/dashboard/", icon: LayoutDashboard },
  { title: "Network", url: "/dashboard/network", icon: GlobeLock },
  { title: "Devices", url: "/dashboard/devices", icon: Cable },
  {
    title: "Alerts And Events",
    url: "/dashboard/alertsandevents",
    icon: ShieldAlert,
  },
  { title: "Reports", url: "/dashboard/reports", icon: BookMarked },
  { title: "Integrations", url: "/dashboard/integrations", icon: Workflow },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const data = {
  user: {
    name: "Networks",
    email: "abc@gmail.com",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxcGAQbgGTFNoB5mkZiskJ0-FdzYwWO5d9CQ&s",
  },
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon style={{ marginRight: "0.5rem" }} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
