import {
  LayoutDashboard, BookOpen, ShoppingCart, CreditCard, Receipt,
  Bell, Users, FileCheck, BarChart3, LogOut, GraduationCap, Wallet,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const studentItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Resources", url: "/resources", icon: BookOpen },
  { title: "Cart", url: "/cart", icon: ShoppingCart },
  { title: "Billing", url: "/billing", icon: Receipt },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Verify Resources", url: "/admin/verify", icon: FileCheck },
  { title: "Payments", url: "/admin/payments", icon: Wallet },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { currentUser, logout, unreadCount, cart } = useApp();

  const items = currentUser?.role === "admin" ? adminItems : studentItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2">
            <GraduationCap className="h-4 w-4" />
            {!collapsed && <span>EduShare</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/dashboard" || item.url === "/admin"} activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && (
                        <span className="flex-1 flex items-center justify-between">
                          {item.title}
                          {item.title === "Notifications" && unreadCount > 0 && (
                            <Badge className="ml-2 bg-accent text-accent-foreground text-[10px] px-1.5 py-0">{unreadCount}</Badge>
                          )}
                          {item.title === "Cart" && cart.length > 0 && (
                            <Badge className="ml-2 bg-accent text-accent-foreground text-[10px] px-1.5 py-0">{cart.length}</Badge>
                          )}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
