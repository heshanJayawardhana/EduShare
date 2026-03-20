import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      const user = email === "admin@test.com" ? "admin" : "student";
      navigate(user === "admin" ? "/admin" : "/dashboard");
    } else {
      setError("Invalid email or password. Try the demo accounts below.");
    }
  };

  const fillDemo = (role: "student" | "admin") => {
    setEmail(role === "student" ? "student@test.com" : "admin@test.com");
    setPassword("123456");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary mb-4">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">EduShare</h1>
          <p className="text-muted-foreground text-sm mt-1">Monetized Academic Resource Hub</p>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex mb-6 bg-muted rounded-lg p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 text-sm py-2 rounded-md font-medium transition-all ${mode === "login" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 text-sm py-2 rounded-md font-medium transition-all ${mode === "register" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" className="mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" required />
            </div>
            {mode === "register" && (
              <div>
                <Label>Role</Label>
                <div className="flex gap-3 mt-1.5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="role" defaultChecked className="accent-[hsl(var(--primary))]" /> Student
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="role" className="accent-[hsl(var(--primary))]" /> Admin
                  </label>
                </div>
              </div>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </div>

        <div className="mt-4 bg-card rounded-xl border p-4">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fillDemo("student")}
              className="text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors active:scale-[0.98]"
            >
              <p className="text-xs font-semibold">Student</p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">student@test.com</p>
            </button>
            <button
              onClick={() => fillDemo("admin")}
              className="text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors active:scale-[0.98]"
            >
              <p className="text-xs font-semibold">Admin</p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">admin@test.com</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
