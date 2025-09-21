// components/dashboard/MaterialFlowChart.js (Updated to use ML data)
"use client";

import { useState, useEffect } from "react";
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

export default function MaterialFlowChart() {
  const [flowData, setFlowData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlowData = async () => {
      try {
        const response = await fetch("/api/circularity?trends=true");
        if (!response.ok) {
          throw new Error("Failed to fetch flow data");
        }
        const data = await response.json();

        // Transform the trend data into material flow data
        const chartData = data.trends.map((trend, index) => {
          const wasteGenerated = trend.wasteGenerated || 5000;
          const circularityIndex = trend.circularityIndex || 30;

          // Calculate material flows based on ML predictions
          const totalMaterials = 1000; // Base unit
          const recycledPercentage = circularityIndex / 100;
          const recycled = Math.round(totalMaterials * recycledPercentage);
          const primary = totalMaterials - recycled;
          const recovered = Math.round((wasteGenerated * 0.7) / 1000); // 70% recovery rate

          return {
            period: `Period ${index + 1}`,
            primary: primary,
            recycled: recycled,
            recovered: recovered,
            wasteGenerated: Math.round(wasteGenerated / 1000), // Convert to tons
          };
        });

        setFlowData(chartData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlowData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Material Flow Trends (ML-Based)
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
          Material Flow Trends (ML-Based)
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
        Material Flow Trends (ML-Based)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={flowData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="period" stroke="#A0AEC0" fontSize={12} />
          <YAxis stroke="#A0AEC0" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A202C",
              border: "1px solid #4A5568",
            }}
            formatter={(value, name) => [
              `${formatNumber(value)} tons`,
              name
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase()),
            ]}
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
