import { StatCard } from "@/components/StatCard";
import { Download, TrendingUp, BookOpen, Users } from "lucide-react";
import { users, resources, downloadStats, modules, monthlyEarnings } from "@/data/mockData";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminReports() {
  const totalDownloads = resources.reduce((s, r) => s + r.downloads, 0);
  const students = users.filter((u) => u.role === "student");

  const popularModules = [...modules].sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <div className="space-y-8 max-w-8xl">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Downloads" value={totalDownloads.toLocaleString()} icon={Download} variant="accent" />
        <StatCard title="Active Students" value={String(students.length)} icon={Users} />
        <StatCard title="Verified Resources" value={String(resources.filter((r) => r.status === "verified").length)} icon={BookOpen} />
        <StatCard title="Platform Revenue" value="Rs. 11,600" icon={TrendingUp} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-5 animate-fade-up">
          <h3 className="text-sm font-semibold mb-4">Downloads by Resource</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={downloadStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="resource" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Bar dataKey="downloads" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <h3 className="text-sm font-semibold mb-4">Monthly Platform Earnings</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Line type="monotone" dataKey="earnings" stroke="hsl(var(--chart-5))" strokeWidth={2.5} dot={{ fill: "hsl(var(--chart-5))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-sm font-semibold mb-4">Popular Modules</h3>
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
