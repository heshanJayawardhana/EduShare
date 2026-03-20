import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  User, Resource, Transaction, Notification, CartItem,
  users as mockUsers,
  resources as mockResources,
  transactions as mockTransactions,
  notifications as mockNotifications,
} from "@/data/mockData";

type PaymentMethod = "card" | "paypal";

type CardPayload = {
  cardLast4: string;
  expiryMonth: number;
  expiryYear: number;
};

type CheckoutPayload = {
  paymentMethod: PaymentMethod;
  card?: CardPayload;
};

type Withdrawal = {
  id: string;
  sellerId: string;
  amount: number;
  status: "completed" | "failed";
  date: string;
};

interface AppState {
  currentUser: User | null;
  resources: Resource[];
  transactions: Transaction[];
  notifications: Notification[];
  cart: CartItem[];
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToCart: (resourceId: string) => void;
  removeFromCart: (resourceId: string) => void;
  clearCart: () => void;
  checkout: (payload: CheckoutPayload) => Promise<Transaction[]>;
  addNotification: (message: string, type: Notification["type"]) => void;
  markNotificationRead: (id: string) => void;
  updateResourceStatus: (id: string, status: Resource["status"]) => void;
  updateTransactionStatus: (id: string, status: Transaction["status"]) => void;
  addReview: (resourceId: string, rating: number, comment: string) => void;
  withdrawEarnings: () => Promise<boolean>;
  getBalance: () => { total: number; available: number; pending: number };
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const user = mockUsers.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
  }, []);

  const addToCart = useCallback((resourceId: string) => {
    setCart((prev) => {
      if (prev.some((c) => c.resourceId === resourceId)) return prev;
      return [...prev, { resourceId, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((resourceId: string) => {
    setCart((prev) => prev.filter((c) => c.resourceId !== resourceId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const addNotification = useCallback((message: string, type: Notification["type"]) => {
    setNotifications((prev) => [
      { id: `n${Date.now()}`, message, type, read: false, date: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
  }, []);

  const loadPaymentData = useCallback(async () => {
    if (!currentUser) return;

    try {
      const [txnRes, wRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/payments/transactions`, {
          method: "GET",
          headers: { "x-user-id": currentUser.id },
        }),
        fetch(`${API_BASE_URL}/api/payments/withdrawals`, {
          method: "GET",
          headers: { "x-user-id": currentUser.id },
        }),
      ]);

      const txnJson = txnRes.ok ? await txnRes.json() : null;
      const wJson = wRes.ok ? await wRes.json() : null;

      if (txnJson?.transactions) setTransactions(txnJson.transactions);
      if (wJson?.withdrawals) setWithdrawals(wJson.withdrawals);
    } catch {
      // If the backend isn't running yet, keep the original dummy state.
    }
  }, [API_BASE_URL, currentUser]);

  useEffect(() => {
    void loadPaymentData();
  }, [loadPaymentData]);

  const checkout = useCallback(
    async (payload: CheckoutPayload): Promise<Transaction[]> => {
      if (!currentUser) return [];
      if (cart.length === 0) return [];

      const items = cart.map((c) => ({ resourceId: c.resourceId, quantity: c.quantity }));

      const body = {
        paymentMethod: payload.paymentMethod,
        items,
        card: payload.paymentMethod === "card" ? payload.card : undefined,
      };

      const res = await fetch(`${API_BASE_URL}/api/payments/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Checkout failed");
      }

      const json = await res.json();
      const newTxns: Transaction[] = json.transactions || [];

      newTxns.forEach((t) => {
        addNotification(
          `Payment of Rs. ${t.amount} submitted for '${t.resourceName}'. Awaiting admin approval.`,
          "payment"
        );
      });

      setCart([]);
      await loadPaymentData();

      return newTxns;
    },
    [API_BASE_URL, addNotification, cart, currentUser, loadPaymentData]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const updateResourceStatus = useCallback((id: string, status: Resource["status"]) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (status === "verified") {
      addNotification(`Your resource has been verified by admin.`, "verification");
    }
  }, [addNotification]);

  const updateTransactionStatus = useCallback((id: string, status: Transaction["status"]) => {
    // Keep the UI responsive: fire-and-refresh, and notify only after a successful backend update.
    void (async () => {
      if (!currentUser) return;
      const res = await fetch(`${API_BASE_URL}/api/payments/transactions/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) return;

      const updatedJson = await res.json().catch(() => null);
      const t = updatedJson?.transaction;
      if (t) {
        if (status === "paid") {
          addNotification(`Payment of Rs. ${t.amount} for '${t.resourceName}' has been approved.`, "payment");
        } else if (status === "verified") {
          addNotification(`Payment of Rs. ${t.amount} for '${t.resourceName}' has been verified.`, "info");
        }
      }

      await loadPaymentData();
    })();
  }, [API_BASE_URL, addNotification, currentUser, loadPaymentData]);

  const addReview = useCallback((resourceId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    setResources((prev) =>
      prev.map((r) => {
        if (r.id !== resourceId) return r;
        const newReview = {
          id: `rv${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          rating,
          comment,
          date: new Date().toISOString().split("T")[0],
        };
        const allReviews = [...r.reviews, newReview];
        const avg = allReviews.reduce((s, rv) => s + rv.rating, 0) / allReviews.length;
        return { ...r, reviews: allReviews, rating: Math.round(avg * 10) / 10, ratingCount: allReviews.length };
      })
    );
  }, [currentUser]);

  const withdrawEarnings = useCallback(async (): Promise<boolean> => {
    if (!currentUser) return false;

    const res = await fetch(`${API_BASE_URL}/api/payments/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": currentUser.id,
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) return false;

    await loadPaymentData();
    addNotification("Withdrawal processed successfully. Funds will arrive in 2-3 business days.", "info");
    return true;
  }, [API_BASE_URL, addNotification, currentUser, loadPaymentData]);

  const getBalance = useCallback(() => {
    if (!currentUser) return { total: 0, available: 0, pending: 0 };
    const myTxns = transactions.filter((t) => t.sellerId === currentUser.id);
    const total = myTxns.reduce((s, t) => s + t.amount, 0);
    const availableGross = myTxns.filter((t) => t.status === "paid").reduce((s, t) => s + t.amount, 0);
    const withdrawnTotal = withdrawals
      .filter((w) => w.sellerId === currentUser.id && w.status === "completed")
      .reduce((s, w) => s + w.amount, 0);
    const available = Math.max(0, availableGross - withdrawnTotal);
    // Pending = everything not yet marked paid, regardless of withdrawals.
    const pending = total - availableGross;
    return { total, available, pending };
  }, [currentUser, transactions, withdrawals]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser, resources, transactions, notifications, cart,
        login, logout, addToCart, removeFromCart, clearCart, checkout,
        addNotification, markNotificationRead, updateResourceStatus, updateTransactionStatus,
        addReview, withdrawEarnings, getBalance, unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
