// components/reports/CarbonBreakdownChart.js (New File)
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/utils";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function CarbonBreakdownChart({ data }) {
  const chartData = Object.entries(data.breakdown).map(([key, value]) => ({
    name: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    value,
    percentage: Math.round((value / data.total) * 100),
  }));

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Carbon Footprint Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              `${formatNumber(value)} tons CO₂e`,
              "Emissions",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
