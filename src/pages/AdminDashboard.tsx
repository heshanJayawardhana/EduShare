import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/StatCard";
import { Users, FileCheck, Download, TrendingUp } from "lucide-react";
import { users, resources as allResources, downloadStats } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const { resources } = useApp();
  const students = users.filter((u) => u.role === "student");
  const totalDownloads = allResources.reduce((s, r) => s + r.downloads, 0);
  const pendingCount = resources.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-8 max-w-8xl">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={String(students.length)} icon={Users} />
        <StatCard title="Total Resources" value={String(resources.length)} icon={FileCheck} />
        <StatCard title="Total Downloads" value={totalDownloads.toLocaleString()} icon={Download} variant="accent" />
        <StatCard title="Pending Review" value={String(pendingCount)} icon={TrendingUp} variant="warning" />
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
              <Bar dataKey="downloads" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <h3 className="text-sm font-semibold mb-4">Top Earning Students</h3>
          <div className="space-y-3">
            {students.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                    {s.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.faculty}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold tabular-nums">Rs. {[3750, 950, 550][i] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
