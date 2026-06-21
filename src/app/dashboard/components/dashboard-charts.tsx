"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

type ChartData = {
  date: string;
  revenue: number;
  profit: number;
};

export function DashboardCharts({ data }: { data: ChartData[] }) {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      displayDate: format(parseISO(item.date), "MMM d"),
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Revenue vs. Profit (Last 30 Days)</CardTitle>
        <CardDescription>
          Aggregated financial performance across all active business modules.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="displayDate" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                labelStyle={{ color: 'black' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                name="Revenue"
                stroke="#8884d8" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                name="Net Profit"
                stroke="#82ca9d" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorProfit)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
