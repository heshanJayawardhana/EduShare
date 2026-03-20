import { useState } from "react";
import { users } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminUsers() {
  const [faculty, setFaculty] = useState("all");
  const students = users.filter((u) => u.role === "student");
  const filtered = faculty === "all" ? students : students.filter((u) => u.faculty === faculty);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{students.length} registered students</p>
        </div>
        <Select value={faculty} onValueChange={setFaculty}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faculties</SelectItem>
            <SelectItem value="Computing">Computing</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left py-3 px-5 font-medium text-muted-foreground text-xs">Student</th>
              <th className="text-left py-3 px-5 font-medium text-muted-foreground text-xs">ID</th>
              <th className="text-left py-3 px-5 font-medium text-muted-foreground text-xs">Faculty</th>
              <th className="text-center py-3 px-5 font-medium text-muted-foreground text-xs">Year</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                      {u.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 font-mono text-xs text-muted-foreground">{u.studentId}</td>
                <td className="py-3 px-5"><Badge variant="secondary" className="text-[10px]">{u.faculty}</Badge></td>
                <td className="py-3 px-5 text-center">Year {u.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
