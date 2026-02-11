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

type CandidateData = {
  name: string;
  votes: number;
  isWinner: boolean;
  partySlug: string | null;
};

export function VoteBarChart({ data }: { data: CandidateData[] }) {
  const chartData = data.map((d) => ({
    name: d.name.length > 20 ? d.name.slice(0, 20) + "..." : d.name,
    votes: d.votes,
    color: getPartyColor(d.partySlug),
    isWinner: d.isWinner,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 44)}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
        <XAxis
          type="number"
          tick={{ fill: "#475569", fontSize: 11 }}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
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
          formatter={(value: number) => [value.toLocaleString(), "Votes"]}
        />
        <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={28}>
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.color}
              opacity={entry.isWinner ? 1 : 0.6}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
