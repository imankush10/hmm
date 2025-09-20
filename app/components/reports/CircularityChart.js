// components/reports/CircularityChart.js (New File)
"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CircularityChart({ data }) {
  const chartData = Object.entries(data.components).map(([key, value]) => ({
    metric: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    current: value,
    target: data.targets[key] || 85,
  }));

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Circularity Assessment
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#4A5568" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#A0AEC0", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#A0AEC0", fontSize: 10 }}
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Target"
            dataKey="target"
            stroke="#10B981"
            fill="none"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A202C",
              border: "1px solid #4A5568",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
