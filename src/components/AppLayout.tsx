import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useApp } from "@/context/AppContext";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, unreadCount } = useApp();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm font-medium text-muted-foreground">
                {currentUser?.role === "admin" ? "Admin Panel" : "Student Portal"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(currentUser?.role === "admin" ? "/admin" : "/notifications")}
                className="relative p-2 rounded-md hover:bg-muted transition-colors active:scale-95"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[9px] px-1 py-0 min-w-[16px] h-4 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                  {currentUser?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <span className="text-sm font-medium hidden sm:block">{currentUser?.name}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
