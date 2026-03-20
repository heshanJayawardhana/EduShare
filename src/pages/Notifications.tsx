import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, ShoppingBag, CreditCard, Shield, Info } from "lucide-react";
import type { Notification } from "@/data/mockData";

const typeIcon: Record<Notification["type"], React.ReactNode> = {
  purchase: <ShoppingBag className="h-4 w-4 text-success" />,
  payment: <CreditCard className="h-4 w-4 text-info" />,
  verification: <Shield className="h-4 w-4 text-primary" />,
  info: <Info className="h-4 w-4 text-accent" />,
};

export default function Notifications() {
  const { notifications, markNotificationRead } = useApp();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground text-sm mt-1">{notifications.filter((n) => !n.read).length} unread</p>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground animate-fade-in">
          <Bell className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all animate-fade-up active:scale-[0.99] ${
                n.read ? "bg-card opacity-70" : "bg-card shadow-sm border-primary/15"
              }`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="mt-0.5 shrink-0">{typeIcon[n.type]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
              </div>
              {!n.read && (
                <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
