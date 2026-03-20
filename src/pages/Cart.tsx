import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, resources, removeFromCart } = useApp();
  const navigate = useNavigate();

  const cartItems = cart.map((c) => resources.find((r) => r.id === c.resourceId)!).filter(Boolean);
  const total = cartItems.reduce((s, r) => s + r.price, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h2 className="text-lg font-semibold">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-6">Browse resources and add them to your cart</p>
        <Button onClick={() => navigate("/resources")}>Browse Resources</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Cart</h1>
        <p className="text-muted-foreground text-sm mt-1">{cart.length} item{cart.length > 1 ? "s" : ""}</p>
      </div>

      <div className="space-y-3">
        {cartItems.map((r, i) => (
          <div key={r.id} className="bg-card rounded-xl border p-4 flex items-center justify-between gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate">{r.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{r.faculty} · Year {r.year}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-semibold tabular-nums text-sm">Rs. {r.price}</span>
              <button onClick={() => removeFromCart(r.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors active:scale-95">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-xl font-bold tabular-nums">Rs. {total.toLocaleString()}</span>
        </div>
        <Button className="w-full active:scale-[0.98] transition-transform" onClick={() => navigate("/payment")}>
          Proceed to Payment <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
