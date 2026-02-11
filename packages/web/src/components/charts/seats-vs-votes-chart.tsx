"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { getPartyColor } from "@/lib/party-colors";

type PartyComparison = {
  name: string;
  slug: string;
  seatShare: number;
  voteShare: number;
};

export function SeatsVsVotesChart({ data }: { data: PartyComparison[] }) {
  const chartData = data.slice(0, 8).map((d) => ({
    name: d.name.length > 14 ? d.name.slice(0, 14) + "..." : d.name,
    "Seat %": Number(d.seatShare.toFixed(1)),
    "Vote %": Number(d.voteShare.toFixed(1)),
    color: getPartyColor(d.slug),
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: "#475569", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-25}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fill: "#475569", fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
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
          formatter={(value: number) => `${value}%`}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "#475569" }}
        />
        <Bar dataKey="Seat %" radius={[4, 4, 0, 0]} barSize={20}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
        <Bar dataKey="Vote %" radius={[4, 4, 0, 0]} barSize={20} opacity={0.5}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
