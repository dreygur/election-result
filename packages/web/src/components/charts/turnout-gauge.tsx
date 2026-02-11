"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function TurnoutGauge({
  percentage,
  label = "Voter Turnout",
}: {
  percentage: number;
  label?: string;
}) {
  const value = Math.min(100, Math.max(0, percentage));
  const data = [
    { value, name: "turnout" },
    { value: 100 - value, name: "remaining" },
  ];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="75%"
            startAngle={180}
            endAngle={0}
            innerRadius={65}
            outerRadius={90}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="#F42A41" />
            <Cell fill="#006A4E20" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="-mt-16 text-center">
        <p className="text-3xl font-bold tabular-nums">{value.toFixed(1)}%</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
