/** In-app notification center; view details and mark as read. */
import { useState } from "react";
import type { KeyboardEvent } from "react";

import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Info, CreditCard, Shield, ShoppingBag } from "lucide-react";
import type { Notification } from "@/data/mockData";

import type { ReactNode } from "react";

const typeIcon: Record<Notification["type"], ReactNode> = {
  purchase: <ShoppingBag className="h-4 w-4 text-success" />,
  payment: <CreditCard className="h-4 w-4 text-info" />,
  verification: <Shield className="h-4 w-4 text-primary" />,
  info: <Info className="h-4 w-4 text-accent" />,
};

export default function Notifications() {
  const { notifications, markNotificationRead } = useApp();
  const [active, setActive] = useState<Notification | null>(null);
  const [open, setOpen] = useState(false);

  const openDetails = (n: Notification) => {
    setActive(n);
    setOpen(true);
  };

  const handleListKeyDown = (e: KeyboardEvent<HTMLButtonElement>, n: Notification) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetails(n);
    }
  };

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
            <button
              key={n.id}
              type="button"
              onClick={() => openDetails(n)}
              onKeyDown={(e) => handleListKeyDown(e, n)}
              className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all animate-fade-up active:scale-[0.99] ${
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
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setActive(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="mt-0.5 shrink-0">{active ? typeIcon[active.type] : null}</div>
              <DialogTitle className="text-base">{active ? active.type.toUpperCase() : "Notification"}</DialogTitle>
            </div>
            <DialogDescription>{active?.date}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm leading-relaxed">{active?.message}</p>
            {active && (
              <Badge
                variant="outline"
                className={`uppercase tracking-wider ${
                  active.read ? "text-muted-foreground" : "text-accent border-accent/20 bg-accent/10"
                }`}
              >
                {active.read ? "Read" : "Unread"}
              </Badge>
            )}
          </div>

          <DialogFooter>
            {active && !active.read ? (
              <Button
                onClick={() => {
                  markNotificationRead(active.id);
                  setActive({ ...active, read: true });
                  setOpen(false);
                }}
              >
                Mark as read
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
