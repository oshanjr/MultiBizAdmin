"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export function ExportButton({ data }: { data: any[] }) {
  const handleExport = () => {
    try {
      if (data.length === 0) {
        toast.info("No data to export");
        return;
      }

      // Format data for excel
      const exportData = data.map(item => ({
        Business: item.business.name,
        Type: item.business.type,
        Date: new Date(item.date).toLocaleDateString(),
        Revenue: Number(item.totalRevenue),
        Expenses: Number(item.totalExpenses),
        'Net Profit': Number(item.netProfit),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Syncs");
      
      XLSX.writeFile(workbook, `financial_syncs_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Export successful");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export data");
    }
  };

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
      <Download className="h-4 w-4" />
      Export to Excel
    </Button>
  );
}
