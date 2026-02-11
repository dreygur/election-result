"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = { yes: "#16a34a", no: "#dc2626" };

export function ReferendumDonut({ yes, no }: { yes: number; no: number }) {
  const chartData = [
    { name: "Yes", value: yes, color: COLORS.yes },
    { name: "No", value: no, color: COLORS.no },
  ].filter((d) => d.value > 0);

  if (chartData.length === 0) return null;

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
          formatter={(value: number, name: string) => [
            `${value.toLocaleString("en-US")} votes`,
            name,
          ]}
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
