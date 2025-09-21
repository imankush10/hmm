// components/reports/CarbonTrendsChart.js (Updated to use ML data)
"use client";

import { useState, useEffect } from "react";
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

export default function CarbonTrendsChart() {
  const [trendData, setTrendData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await fetch("/api/circularity?trends=true");
        if (!response.ok) {
          throw new Error("Failed to fetch trend data");
        }
        const data = await response.json();

        // Transform the trend data for the chart
        const chartData = data.trends.map((trend, index) => ({
          period: `Assessment ${index + 1}`,
          value: Math.round(trend.carbonFootprint / 1000), // Convert to tons
          actual: Math.round(trend.carbonFootprint / 1000),
          target: Math.round((trend.carbonFootprint / 1000) * 0.85), // 15% reduction target
          assessmentName: trend.assessmentName,
        }));

        setTrendData(chartData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Carbon Footprint Trends (ML Predictions)
        </h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Carbon Footprint Trends (ML Predictions)
        </h3>
        <div className="h-[300px] flex items-center justify-center text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Carbon Footprint Trends (ML Predictions)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="period" stroke="#A0AEC0" fontSize={12} />
          <YAxis stroke="#A0AEC0" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A202C",
              border: "1px solid #4A5568",
            }}
            formatter={(value, name) => [
              `${formatNumber(value)} tons CO₂e`,
              name === "actual" ? "ML Prediction" : "Target",
            ]}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3B82F6"
            strokeWidth={2}
            name="ML Prediction"
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
