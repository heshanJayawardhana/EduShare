import { useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  BookOpen,
  ShoppingCart,
  Wallet,
  Bell,
  Users,
  FileCheck,
  BarChart3,
  CreditCard,
  Shield,
} from "lucide-react";

type HomeNavItem = {
  label: string;
  url: string;
  icon: ReactNode;
  badge?: number | null;
};

export default function Home() {
  const { currentUser, unreadCount, cart } = useApp();
  const navigate = useNavigate();

  const studentNav: HomeNavItem[] = useMemo(
    () => [
      { label: "Dashboard", url: "/dashboard", icon: <GraduationCap className="h-4 w-4" /> },
      { label: "Resources", url: "/resources", icon: <BookOpen className="h-4 w-4" /> },
      { label: "Cart", url: "/cart", icon: <ShoppingCart className="h-4 w-4" />, badge: cart.length || null },
      { label: "Billing", url: "/billing", icon: <Wallet className="h-4 w-4" /> },
      { label: "Payments", url: "/payment", icon: <CreditCard className="h-4 w-4" /> },
      { label: "Notifications", url: "/notifications", icon: <Bell className="h-4 w-4" />, badge: unreadCount || null },
    ],
    [cart.length, unreadCount],
  );

  const adminNav: HomeNavItem[] = useMemo(
    () => [
      { label: "Admin Dashboard", url: "/admin", icon: <Shield className="h-4 w-4" /> },
      { label: "Users", url: "/admin/users", icon: <Users className="h-4 w-4" /> },
      { label: "Verify Resources", url: "/admin/verify", icon: <FileCheck className="h-4 w-4" /> },
      { label: "Payments", url: "/admin/payments", icon: <Wallet className="h-4 w-4" /> },
      { label: "Reports", url: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
    ],
    [],
  );

  const navItems = currentUser?.role === "admin" ? adminNav : studentNav;

  const onGo = (url: string) => navigate(url);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button type="button" className="flex items-center gap-3" onClick={() => navigate("/")}>
            <img src="/placeholder.svg" alt="EduShare logo" className="h-8 w-auto" />
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentUser.role === "admin" ? "Admin" : "Student"}</Badge>
              <Button variant="outline" onClick={() => onGo(currentUser.role === "admin" ? "/admin" : "/dashboard")}>
                Go to Portal
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onGo("/login")}>
                Login
              </Button>
              <Button onClick={() => onGo("/signup")}>Sign Up</Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Badge variant="secondary" className="mb-3">
              Monetized Academic Resource Hub
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Share learning materials. Earn with verified payments.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl">
              EduShare helps students access verified resources and manage payments with an admin approval workflow.
            </p>

            {!currentUser ? (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button onClick={() => onGo("/login")}>Login</Button>
                <Button variant="outline" onClick={() => onGo("/signup")}>
                  Create Account
                </Button>
              </div>
            ) : (
              <div className="mt-7 flex flex-wrap gap-3">
                {navItems.map((item) => (
                  <Button key={item.url} variant="outline" onClick={() => onGo(item.url)} className="gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <img src="/placeholder.svg" alt="EduShare logo" className="h-9 w-auto" />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Verified Resources</p>
                  <p className="text-sm text-muted-foreground">Students can buy and download only verified items.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Admin Approval</p>
                  <p className="text-sm text-muted-foreground">Admin can review transactions and move payment states.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Withdraw Earnings</p>
                  <p className="text-sm text-muted-foreground">Sellers can withdraw once payments are completed.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-xl border bg-muted/30 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <h2 className="text-xl font-semibold">EduShare</h2>
              <p className="text-sm text-muted-foreground mt-1">
                An academic resource marketplace with payment approval workflow and seller withdrawals.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" onClick={() => onGo(currentUser ? (currentUser.role === "admin" ? "/admin" : "/dashboard") : "/login")}>
                Get Started
              </Button>
              <Button variant="secondary" onClick={() => onGo("/resources")} disabled={!currentUser}>
                Browse Resources
              </Button>
            </div>
          </div>
        </section>

        <footer className="mt-10 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EduShare. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

