// components/reports/CarbonTrendsChart.js (New File)
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/utils";

export default function CarbonTrendsChart({ data }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Carbon Footprint Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="period" stroke="#A0AEC0" fontSize={12} />
          <YAxis stroke="#A0AEC0" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A202C",
              border: "1px solid #4A5568",
            }}
            formatter={(value) => [`${formatNumber(value)} tons CO₂e`]}
          />
          <Line 
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Actual"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
