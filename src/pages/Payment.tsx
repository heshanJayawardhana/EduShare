import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle2, Shield } from "lucide-react";

type PayMethod = "card" | "paypal";
type Step = "form" | "processing" | "success";

export default function Payment() {
  const { cart, resources, checkout } = useApp();
  const navigate = useNavigate();
  const [method, setMethod] = useState<PayMethod>("card");
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ cardNumber: boolean; expiry: boolean; cvv: boolean }>({
    cardNumber: false,
    expiry: false,
    cvv: false,
  });
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const cartItems = cart.map((c) => resources.find((r) => r.id === c.resourceId)!).filter(Boolean);
  const total = cartItems.reduce((s, r) => s + r.price, 0);

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const cardDigits = cardNumber.replace(/\s/g, "");
  const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);
  const fullCardErrors: string[] = [];
  const displayedCardErrors: string[] = [];

  if (method === "card") {
    const cardOk = /^\d{16}$/.test(cardDigits);
    if (!cardOk) {
      fullCardErrors.push("Card number must be exactly 16 digits.");
    }
    if (touched.cardNumber && !cardOk) {
      displayedCardErrors.push("Card number must be exactly 16 digits.");
    }

    if (!expiryMatch) {
      fullCardErrors.push("Expiry date must be in MM/YY format.");
      if (touched.expiry) {
        displayedCardErrors.push("Expiry date must be in MM/YY format.");
      }
    } else {
      const month = Number(expiryMatch[1]);
      const year = 2000 + Number(expiryMatch[2]);

      if (Number.isNaN(month) || Number.isNaN(year)) {
        fullCardErrors.push("Expiry date is invalid.");
        if (touched.expiry) displayedCardErrors.push("Expiry date is invalid.");
      } else if (month < 1 || month > 12) {
        fullCardErrors.push("Expiry month must be between 01 and 12.");
        if (touched.expiry) displayedCardErrors.push("Expiry month must be between 01 and 12.");
      } else {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        // Treat expiry as invalid if it's earlier than the current month/year.
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          fullCardErrors.push("Card expiry date is expired.");
          if (touched.expiry) displayedCardErrors.push("Card expiry date is expired.");
        }
      }
    }

    const cvvOk = /^\d{3}$/.test(cvv);
    if (!cvvOk) {
      fullCardErrors.push("CVV must be exactly 3 digits.");
    }
    if (touched.cvv && !cvvOk) {
      displayedCardErrors.push("CVV must be exactly 3 digits.");
    }
  }

  const isValid = method === "paypal" || fullCardErrors.length === 0;

  const handlePay = async () => {
    setError(null);
    setTouched({ cardNumber: true, expiry: true, cvv: true });
    if (!isValid) return;
    setStep("processing");
    try {
      const cardPayload =
        method === "card"
          ? (() => {
              const [, mm, yy] = expiry.match(/^(\d{2})\/(\d{2})$/) || [];
              return {
                cardLast4: cardDigits.slice(-4),
                expiryMonth: Number(mm),
                expiryYear: 2000 + Number(yy),
              };
            })()
          : undefined;

      await checkout({ paymentMethod: method, card: cardPayload });
      setStep("success");
    } catch (e) {
      setStep("form");
      setError(e instanceof Error ? e.message : "Payment failed");
    }
  };

  if (step === "processing") {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="relative mb-6">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
        <h2 className="text-lg font-semibold">Processing Payment</h2>
        <p className="text-sm text-muted-foreground mt-1">Please wait while we verify your payment...</p>
        <div className="flex gap-1.5 mt-6">
          <div className="h-2 w-2 rounded-full bg-primary pulse-dot" />
          <div className="h-2 w-2 rounded-full bg-primary pulse-dot" style={{ animationDelay: "0.2s" }} />
          <div className="h-2 w-2 rounded-full bg-primary pulse-dot" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-scale-in text-center">
        <div className="h-16 w-16 rounded-full bg-success/15 flex items-center justify-center mb-5">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-xl font-bold">Payment Successful</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">Your payment of Rs. {total.toLocaleString()} has been processed. Resources are now available in your library.</p>
        <div className="flex gap-3 mt-8">
          <Button variant="secondary" onClick={() => navigate("/resources")}>Browse More</Button>
          <Button onClick={() => navigate("/billing")}>View Billing</Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment</h1>
        <p className="text-muted-foreground text-sm mt-1">Complete your purchase</p>
      </div>

      {/* Order Summary */}
      <div className="bg-card rounded-xl border p-5 animate-fade-up">
        <h3 className="text-sm font-semibold mb-3">Order Summary</h3>
        {cartItems.map((r) => (
          <div key={r.id} className="flex items-center justify-between py-2 text-sm">
            <span className="text-muted-foreground truncate pr-4">{r.title}</span>
            <span className="tabular-nums font-medium shrink-0">Rs. {r.price}</span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-3 mt-3 border-t">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold tabular-nums">Rs. {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: "0.05s" }}>
        <h3 className="text-sm font-semibold mb-3">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMethod("card")}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all active:scale-[0.97] ${method === "card" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
          >
            <CreditCard className="h-5 w-5 mb-1.5 mx-auto" />
            Credit Card
          </button>
          <button
            onClick={() => setMethod("paypal")}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all active:scale-[0.97] ${method === "paypal" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
          >
            <div className="h-5 w-5 mb-1.5 mx-auto font-bold text-info text-base leading-none">P</div>
            PayPal
          </button>
        </div>
      </div>

      {/* Card Form */}
      {method === "card" && (
        <div className="bg-card rounded-xl border p-5 space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div>
            <Label htmlFor="cardNum">Card Number</Label>
            <Input
              id="cardNum"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(formatCardNumber(e.target.value));
                setTouched((prev) => ({ ...prev, cardNumber: true }));
              }}
              className="mt-1.5 font-mono"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => {
                  setExpiry(formatExpiry(e.target.value));
                  setTouched((prev) => ({ ...prev, expiry: true }));
                }}
                className="mt-1.5 font-mono"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="•••"
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
                  setTouched((prev) => ({ ...prev, cvv: true }));
                }}
                className="mt-1.5 font-mono"
                maxLength={3}
                type="password"
              />
            </div>
          </div>

          {(touched.cardNumber || touched.expiry || touched.cvv) && displayedCardErrors.length > 0 && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-1">
              {displayedCardErrors.map((m) => (
                <div key={m}>{m}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {method === "paypal" && (
        <div className="bg-card rounded-xl border p-5 text-center animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm text-muted-foreground">You'll be redirected to PayPal to complete payment (simulated)</p>
        </div>
      )}

      <Button className="w-full active:scale-[0.98] transition-transform" onClick={handlePay} disabled={!isValid}>
        <Shield className="h-4 w-4 mr-1.5" />
        Pay Rs. {total.toLocaleString()}
      </Button>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
          {error}
        </p>
      )}
    </div>
  );
}
