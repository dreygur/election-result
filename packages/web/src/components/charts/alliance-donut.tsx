"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type AllianceData = {
  name: string;
  seats: number;
  color: string;
};

export function AllianceDonut({ data }: { data: AllianceData[] }) {
  const hasSeats = data.some((d) => d.seats > 0);
  const chartData = hasSeats
    ? data.filter((d) => d.seats > 0).map((d) => ({ name: d.name, value: d.seats, color: d.color }))
    : [{ name: "No results yet", value: 1, color: "#e2e8f0" }];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={hasSeats ? 2 : 0}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          {hasSeats && (
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#1e293b",
              }}
              formatter={(value: number, name: string) => [`${value} seats`, name]}
            />
          )}
          {hasSeats && (
            <Legend
              formatter={(value) => (
                <span style={{ color: "#475569", fontSize: 12 }}>{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
      {!hasSeats && (
        <p className="text-sm text-muted-foreground -mt-8">0 seats — results pending</p>
      )}
      {hasSeats && (
        <div className="-mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {data.filter((d) => d.seats === 0).map((d) => (
            <span key={d.name} className="text-xs text-muted-foreground">
              {d.name}: 0
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
