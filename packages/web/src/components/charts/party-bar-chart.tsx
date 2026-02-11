"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getPartyColor } from "@/lib/party-colors";

type PartyData = {
  name: string;
  slug: string;
  seats: number;
};

export function PartyBarChart({ data }: { data: PartyData[] }) {
  const chartData = data.slice(0, 10).map((d) => ({
    name: d.name.length > 18 ? d.name.slice(0, 18) + "..." : d.name,
    seats: Number(d.seats),
    color: getPartyColor(d.slug),
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 44)}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
        <XAxis
          type="number"
          tick={{ fill: "#475569", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          tick={{ fill: "#334155", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            color: "#1e293b",
          }}
          formatter={(value: number) => [`${value} seats`]}
        />
        <Bar dataKey="seats" radius={[0, 4, 4, 0]} barSize={28}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
