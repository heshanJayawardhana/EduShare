import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/StatCard";
import { Download, TrendingUp, BookOpen, DollarSign } from "lucide-react";
import { downloadStats, monthlyEarnings, modules } from "@/data/mockData";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function StudentDashboard() {
  const { currentUser, getBalance } = useApp();
  const balance = getBalance();

  return (
    <div className="space-y-8 max-w-8xl">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your academic hub overview</p>
      </div>

      {/* Profile card */}
      <div className="bg-card rounded-xl border p-5 animate-fade-up">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Profile</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><span className="text-muted-foreground">Name</span><p className="font-medium mt-0.5">{currentUser?.name}</p></div>
          <div><span className="text-muted-foreground">Student ID</span><p className="font-medium mt-0.5 font-mono text-xs">{currentUser?.studentId}</p></div>
          <div><span className="text-muted-foreground">Faculty</span><p className="font-medium mt-0.5">{currentUser?.faculty}</p></div>
          <div><span className="text-muted-foreground">Year / Sem</span><p className="font-medium mt-0.5">Year {currentUser?.year}, Sem {currentUser?.semester}</p></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Earnings" value={`Rs. ${balance.total.toLocaleString()}`} icon={DollarSign} variant="success" />
        <StatCard title="Available" value={`Rs. ${balance.available.toLocaleString()}`} icon={TrendingUp} variant="accent" />
        <StatCard title="Total Downloads" value="822" icon={Download} />
        <StatCard title="Resources" value="4" subtitle="3 verified" icon={BookOpen} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-sm font-semibold mb-4">Downloads by Resource</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={downloadStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="resource" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Bar dataKey="downloads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <h3 className="text-sm font-semibold mb-4">Earnings Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Line type="monotone" dataKey="earnings" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modules */}
      <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-sm font-semibold mb-4">Enrolled Modules</h3>
        <div className="grid gap-2">
          {modules.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{m.code}</p>
              </div>
              <span className="text-xs text-muted-foreground">{m.credits} credits</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
