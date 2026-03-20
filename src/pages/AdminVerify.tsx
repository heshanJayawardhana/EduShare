import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { users } from "@/data/mockData";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/20",
  verified: "bg-success/15 text-success border-success/20",
  rejected: "bg-destructive/15 text-destructive border-destructive/20",
};

export default function AdminVerify() {
  const { resources, updateResourceStatus } = useApp();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Resource Verification</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve uploaded resources</p>
      </div>

      <div className="space-y-3">
        {resources.map((r, i) => {
          const uploader = users.find((u) => u.id === r.uploadedBy);
          return (
            <div key={r.id} className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold truncate">{r.title}</h3>
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider shrink-0 ${statusStyles[r.status]}`}>
                      {r.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{r.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>by {uploader?.name}</span>
                    <span>·</span>
                    <span>{r.faculty}</span>
                    <span>·</span>
                    <span>Rs. {r.price}</span>
                  </div>
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => updateResourceStatus(r.id, "verified")} className="active:scale-95">
                      <Check className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateResourceStatus(r.id, "rejected")} className="active:scale-95">
                      <X className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
