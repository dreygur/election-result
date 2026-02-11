"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getPartyColor } from "@/lib/party-colors";

type PartyData = {
  name: string;
  slug: string;
  seats: number;
};

export function SeatDonut({ data }: { data: PartyData[] }) {
  const chartData = data.filter((d) => d.seats > 0).map((d) => ({
    name: d.name,
    value: Number(d.seats),
    color: getPartyColor(d.slug),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            color: "#1e293b",
          }}
          formatter={(value: number, name: string) => [`${value} seats`, name]}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: "#475569", fontSize: 12 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
