import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";
import { users } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import jsPDF from "jspdf";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/20",
  verified: "bg-info/15 text-info border-info/20",
  paid: "bg-success/15 text-success border-success/20",
};

export default function AdminPayments() {
  const { transactions, updateTransactionStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified" | "paid">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredTxns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return transactions.filter((t) => {
      if (q && !t.resourceName.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;
      return true;
    });
  }, [transactions, searchQuery, statusFilter, dateFrom, dateTo]);

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
      doc.text("Payment Management", leftPad, 20);
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleString()}`, leftPad, 30);
      doc.text("Filtered results", leftPad, 36);

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
      doc.save("admin-payment-history.pdf");
      return;
    }

    filteredTxns.forEach((t, idx) => {
      const buyer = users.find((u) => u.id === t.buyerId);
      const buyerName = buyer?.name || t.buyerId;

      const buyerLines = doc.splitTextToSize(`Buyer: ${buyerName}`, maxWidth);
      const resourceLines = doc.splitTextToSize(`Resource: ${t.resourceName}`, maxWidth);

      // Date (1) + Buyer (multi) + Resource (multi) + Amount (1) + Status (1)
      const rowLinesCount = 2 + buyerLines.length + resourceLines.length + 1 + 1; // date + amount + status + buyer+resource
      const rowH = rowLinesCount * lineH + 10;

      if (y + rowH > pageHeight - 18) {
        doc.addPage();
        drawHeader();
      }

      setFill(idx % 2 === 0 ? lightBg : soft);
      doc.rect(leftPad, y, maxWidth, rowH, "F");

      let rowY = y + 6;
      doc.setTextColor(35, 35, 55);

      doc.text(`Date: ${t.date}`, leftPad + 6, rowY);
      rowY += lineH;

      buyerLines.forEach((ln: string) => {
        doc.text(ln, leftPad + 6, rowY);
        rowY += lineH;
      });

      resourceLines.forEach((ln: string) => {
        doc.text(ln, leftPad + 6, rowY);
        rowY += lineH;
      });

      doc.text(`Amount: Rs. ${t.amount}`, leftPad + 6, rowY);
      rowY += lineH;

      const sc = statusTextColor(t.status);
      setTextColor(sc);
      doc.text(`Status: ${t.status.toUpperCase()}`, leftPad + 6, rowY);

      y += rowH;
    });

    doc.save("admin-payment-history.pdf");
  };

  return (
    <div className="space-y-6 max-w-10xl">
      <div>
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve student payments</p>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="px-5 py-4 border-b space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm font-semibold">Payments</div>
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
                <th className="text-left py-3 px-5 font-medium text-muted-foreground text-xs">Buyer</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground text-xs">Resource</th>
                <th className="text-right py-3 px-5 font-medium text-muted-foreground text-xs">Amount</th>
                <th className="text-center py-3 px-5 font-medium text-muted-foreground text-xs">Status</th>
                <th className="text-center py-3 px-5 font-medium text-muted-foreground text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t, i) => {
                const buyer = users.find((u) => u.id === t.buyerId);
                const seller = users.find((u) => u.id === t.sellerId);
                return (
                  <tr key={t.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
                    <td className="py-3 px-5 tabular-nums text-muted-foreground text-xs">{t.date}</td>
                    <td className="py-3 px-5">
                      <div>
                        <p className="font-medium text-xs">{buyer?.name || "Unknown"}</p>
                        <p className="text-[11px] text-muted-foreground">→ {seller?.name || "Unknown"}</p>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-medium truncate max-w-[200px] text-xs">{t.resourceName}</td>
                    <td className="py-3 px-5 text-right tabular-nums font-semibold text-xs">Rs. {t.amount}</td>
                    <td className="py-3 px-5 text-center">
                      <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${statusStyles[t.status]}`}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-center gap-1.5">
                        {t.status === "pending" && (
                          <>
                            <Button size="sm" variant="default" onClick={() => updateTransactionStatus(t.id, "paid")} className="h-7 text-xs active:scale-95">
                              <Check className="h-3 w-3 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateTransactionStatus(t.id, "verified")} className="h-7 text-xs active:scale-95">
                              <Clock className="h-3 w-3 mr-1" /> Verify
                            </Button>
                          </>
                        )}
                        {t.status === "verified" && (
                          <Button size="sm" variant="default" onClick={() => updateTransactionStatus(t.id, "paid")} className="h-7 text-xs active:scale-95">
                            <Check className="h-3 w-3 mr-1" /> Approve
                          </Button>
                        )}
                        {t.status === "paid" && (
                          <span className="text-xs text-muted-foreground">Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
