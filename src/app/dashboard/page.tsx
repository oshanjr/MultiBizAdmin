import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, TrendingUp } from "lucide-react";
import { DashboardCharts } from "./components/dashboard-charts";
import { ExportButton } from "./components/export-button";
import { format, subDays } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const thirtyDaysAgo = subDays(new Date(), 30);

  // Fetch KPI data
  const [activeBusinessesCount, totalAggregates, recentSyncs, chartDataRaw] = await Promise.all([
    prisma.businessModule.count({ where: { isActive: true } }),
    prisma.dailyFinancialSummary.aggregate({
      _sum: {
        totalRevenue: true,
        netProfit: true,
      },
    }),
    prisma.dailyFinancialSummary.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      include: { business: true },
    }),
    // Fetch data for the chart (last 30 days)
    prisma.dailyFinancialSummary.groupBy({
      by: ['date'],
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        totalRevenue: true,
        netProfit: true,
      },
      orderBy: {
        date: 'asc',
      },
    }),
  ]);

  const totalRevenue = Number(totalAggregates._sum.totalRevenue || 0);
  const totalProfit = Number(totalAggregates._sum.netProfit || 0);

  // Format chart data
  const chartData = chartDataRaw.map(day => ({
    date: day.date.toISOString(),
    revenue: Number(day._sum.totalRevenue || 0),
    profit: Number(day._sum.netProfit || 0),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your global business operations and financials.
          </p>
        </div>
        <ExportButton data={recentSyncs} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Global Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Global Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProfit.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBusinessesCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
        {/* Chart taking up 3/4 width on large screens */}
        <DashboardCharts data={chartData} />

        {/* Recent syncs table taking up 1/4 width on large screens or full width below */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Syncs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Net Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSyncs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No financial data synced yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentSyncs.map((sync) => (
                    <TableRow key={sync.id}>
                      <TableCell>
                        <div className="font-medium">{sync.business.name}</div>
                        <Badge variant="secondary" className="mt-1 text-[10px]">
                          {sync.business.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(sync.date), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">${Number(sync.totalRevenue).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={Number(sync.netProfit) >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          ${Number(sync.netProfit).toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
