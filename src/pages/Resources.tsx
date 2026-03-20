import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Resources() {
  const { resources, addToCart, cart } = useApp();
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("all");
  const [year, setYear] = useState("all");

  const verified = resources.filter((r) => r.status === "verified");
  const filtered = verified.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (faculty !== "all" && r.faculty !== faculty) return false;
    if (year !== "all" && r.year !== Number(year)) return false;
    return true;
  });

  const inCart = (id: string) => cart.some((c) => c.resourceId === id);

  return (
    <div className="space-y-6 max-w-8xl">
      <div>
        <h1 className="text-2xl font-bold">Resources</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse and purchase academic materials</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={faculty} onValueChange={setFaculty}>
          <SelectTrigger className="w-[160px]"><Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faculties</SelectItem>
            <SelectItem value="Computing">Computing</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="1">Year 1</SelectItem>
            <SelectItem value="2">Year 2</SelectItem>
            <SelectItem value="3">Year 3</SelectItem>
            <SelectItem value="4">Year 4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r, i) => (
          <div key={r.id} className="bg-card rounded-xl border p-5 flex flex-col animate-fade-up hover:shadow-md transition-shadow" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wide shrink-0">{r.type.replace("-", " ")}</Badge>
              {r.rating > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-warning text-warning" /> {r.rating}
                  <span className="text-muted-foreground/60">({r.ratingCount})</span>
                </span>
              )}
            </div>
            <h3 className="font-semibold text-sm leading-snug mb-2">{r.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{r.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <span>{r.faculty}</span>
              <span>·</span>
              <span>Year {r.year}, Sem {r.semester}</span>
              <span>·</span>
              <span>{r.downloads} downloads</span>
            </div>
            <div className="mt-auto flex items-center justify-between pt-3 border-t">
              <span className="font-semibold tabular-nums">{r.price === 0 ? "Free" : `Rs. ${r.price}`}</span>
              {r.price > 0 ? (
                <Button
                  size="sm"
                  variant={inCart(r.id) ? "secondary" : "default"}
                  onClick={() => addToCart(r.id)}
                  disabled={inCart(r.id)}
                  className="active:scale-95 transition-transform"
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                  {inCart(r.id) ? "In Cart" : "Add to Cart"}
                </Button>
              ) : (
                <Button size="sm" variant="secondary">Download Free</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No resources match your filters</p>
        </div>
      )}
    </div>
  );
}

function BookOpen(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}
