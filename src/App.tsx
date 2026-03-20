import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import { AppLayout } from "@/components/AppLayout";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/StudentDashboard";
import Resources from "@/pages/Resources";
import Cart from "@/pages/Cart";
import Payment from "@/pages/Payment";
import Billing from "@/pages/Billing";
import Notifications from "@/pages/Notifications";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminVerify from "@/pages/AdminVerify";
import AdminPayments from "@/pages/AdminPayments";
import AdminReports from "@/pages/AdminReports";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;

  return (
    <AppLayout>
      <Routes>
        {currentUser.role === "student" ? (
          <>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/notifications" element={<Notifications />} />
          </>
        ) : (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/verify" element={<AdminVerify />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginRedirect />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

function LoginRedirect() {
  const { currentUser } = useApp();
  if (currentUser) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }
  return <Login />;
}

export default App;
