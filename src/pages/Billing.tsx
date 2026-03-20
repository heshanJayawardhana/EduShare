import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/StatCard";
import { DollarSign, TrendingUp, Clock, ArrowDownToLine, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { monthlyEarnings } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import jsPDF from "jspdf";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/20",
  verified: "bg-info/15 text-info border-info/20",
  paid: "bg-success/15 text-success border-success/20",
};

export default function Billing() {
  const { getBalance, transactions, currentUser, withdrawEarnings } = useApp();
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified" | "paid">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const balance = getBalance();

  const myTxns = transactions.filter((t) => t.sellerId === currentUser?.id || t.buyerId === currentUser?.id);
  const filteredTxns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return myTxns.filter((t) => {
      if (q && !t.resourceName.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;
      return true;
    });
  }, [myTxns, searchQuery, statusFilter, dateFrom, dateTo]);

  const handleWithdraw = async () => {
    setWithdrawing(true);
    await withdrawEarnings();
    setWithdrawing(false);
    setWithdrawn(true);
    setTimeout(() => setWithdrawn(false), 3000);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Brand palette (from your theme)
    const primary = { r: 108, g: 76, b: 241 }; // #6C4CF1
    const dark = { r: 75, g: 45, b: 191 }; // #4B2DBF
    const soft = { r: 237, g: 233, b: 254 }; // #EDE9FE
    const lightBg = { r: 245, g: 243, b: 255 }; // #F5F3FF

    const leftPad = 14;
    const maxWidth = pageWidth - leftPad - 14;

    const setFill = (c: { r: number; g: number; b: number }) => doc.setFillColor(c.r, c.g, c.b);
    const setTextColor = (c: { r: number; g: number; b: number }) => doc.setTextColor(c.r, c.g, c.b);

    const headerH = 42;
    let y = 0;

    const drawHeader = () => {
      setFill(primary);
      doc.rect(0, 0, pageWidth, headerH, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.text("Transaction History", leftPad, 20);
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleString()}`, leftPad, 30);
      doc.text("Filtered results", leftPad, 36);

      // Section heading bar
      setFill(dark);
      doc.rect(leftPad, headerH + 4, maxWidth, 16, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("Records", leftPad + 6, headerH + 14);

      y = headerH + 28;
      doc.setFontSize(9);
    };

    const statusTextColor = (s: string) => {
      if (s === "paid") return { r: 34, g: 197, b: 94 }; // green
      if (s === "verified") return { r: 59, g: 130, b: 246 }; // blue
      return { r: 245, g: 158, b: 11 }; // amber (pending)
    };

    const lineH = 10;
    drawHeader();

    if (filteredTxns.length === 0) {
      doc.setTextColor(50, 50, 50);
      doc.text("No records found for current filters.", leftPad, y);
      doc.save("billing-transactions.pdf");
      return;
    }

    filteredTxns.forEach((t, idx) => {
      const resourceLines = doc.splitTextToSize(`Resource: ${t.resourceName}`, maxWidth);

      // Date (1) + Resource (multi) + Amount (1) + Status (1)
      const rowLinesCount = 3 + resourceLines.length;
      const rowH = rowLinesCount * lineH + 10;

      if (y + rowH > pageHeight - 18) {
        doc.addPage();
        drawHeader();
      }

      // Alternating row background
      setFill(idx % 2 === 0 ? lightBg : soft);
      doc.rect(leftPad, y, maxWidth, rowH, "F");

      let rowY = y + 6;
      doc.setTextColor(35, 35, 55);

      doc.text(`Date: ${t.date}`, leftPad + 6, rowY);
      rowY += lineH;

      resourceLines.forEach((ln: string) => {
        doc.text(ln, leftPad + 6, rowY);
        rowY += lineH;
      });

      doc.setTextColor(35, 35, 55);
      doc.text(`Amount: Rs. ${t.amount}`, leftPad + 6, rowY);
      rowY += lineH;

      const sc = statusTextColor(t.status);
      setTextColor(sc);
      doc.text(`Status: ${t.status.toUpperCase()}`, leftPad + 6, rowY);

      y += rowH;
    });

    doc.save("billing-transactions.pdf");
  };

  return (
    <div className="space-y-8 max-w-8xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Billing Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your earnings and transactions</p>
        </div>
        <Button
          onClick={handleWithdraw}
          disabled={withdrawing || balance.available === 0}
          className="active:scale-[0.97] transition-transform"
        >
          {withdrawing ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Processing...</>
          ) : withdrawn ? (
            <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Withdrawn!</>
          ) : (
            <><ArrowDownToLine className="h-4 w-4 mr-1.5" /> Withdraw Earnings</>
          )}
        </Button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Earnings" value={`Rs. ${balance.total.toLocaleString()}`} icon={DollarSign} variant="default" />
        <StatCard title="Available Balance" value={`Rs. ${balance.available.toLocaleString()}`} subtitle="Ready to withdraw" icon={TrendingUp} variant="success" />
        <StatCard title="Pending Balance" value={`Rs. ${balance.pending.toLocaleString()}`} subtitle="Awaiting verification" icon={Clock} variant="warning" />
      </div>

      {/* Monthly chart */}
      <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-sm font-semibold mb-4">Monthly Earnings</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyEarnings}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `Rs.${v}`} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => [`Rs. ${v}`, "Earnings"]} />
            <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction table */}
      <div className="bg-card rounded-xl border overflow-hidden animate-fade-up" style={{ animationDelay: "0.15s" }}>
        <div className="px-5 py-4 border-b space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-sm font-semibold">Transaction History</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadPdf}>
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-end">
            <div className="min-w-[220px] flex-1">
              <Input placeholder="Search by resource name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className="min-w-[180px]">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[160px]">
              <Input type="date" aria-label="From date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="min-w-[160px]">
              <Input type="date" aria-label="To date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left py-3 px-5 font-medium text-muted-foreground text-xs">Date</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground text-xs">Resource</th>
                <th className="text-right py-3 px-5 font-medium text-muted-foreground text-xs">Amount</th>
                <th className="text-center py-3 px-5 font-medium text-muted-foreground text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t) => (
                <tr key={t.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-5 tabular-nums text-muted-foreground">{t.date}</td>
                  <td className="py-3 px-5 font-medium truncate max-w-[250px]">{t.resourceName}</td>
                  <td className="py-3 px-5 text-right tabular-nums font-medium">Rs. {t.amount}</td>
                  <td className="py-3 px-5 text-center">
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${statusStyles[t.status]}`}>
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
