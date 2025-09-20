// components/dashboard/MaterialFlowChart.js (New File)
"use client";

import {
  Bar,
  ComposedChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/utils";

export default function MaterialFlowChart({ data }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Material Flow Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="month" stroke="#A0AEC0" fontSize={12} />
          <YAxis stroke="#A0AEC0" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A202C",
              border: "1px solid #4A5568",
            }}
            formatter={(value) => [`${formatNumber(value)} tons`]}
          />
          <Bar dataKey="primary" fill="#EF4444" name="Primary Materials" />
          <Bar dataKey="recycled" fill="#10B981" name="Recycled Materials" />
          <Line
            type="monotone"
            dataKey="recovered"
            stroke="#3B82F6"
            strokeWidth={3}
            name="Recovered"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
