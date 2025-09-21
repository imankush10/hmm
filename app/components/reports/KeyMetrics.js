// components/reports/KeyMetrics.js (Updated to fetch from circularity API)
"use client";

import { useState, useEffect } from "react";
import MetricCard from "./MetricCard";
import { Leaf, Droplets, Zap, Recycle } from "lucide-react";

export default function KeyMetrics() {
  const [metricsData, setMetricsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetricsData = async () => {
      try {
        const response = await fetch("/api/circularity");
        if (!response.ok)
          throw new Error("Failed to fetch metrics data from circularity API");
        const data = await response.json();

        setMetricsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetricsData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
          Error loading metrics data: {error}
        </div>
      </div>
    );
  }

  if (!metricsData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 text-yellow-400">
          No metrics data available
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Carbon Footprint"
        value={metricsData.carbonFootprint.total}
        unit="tons CO₂e"
        icon={Leaf}
        color="bg-green-600"
        benchmark={metricsData.carbonFootprint.benchmarks}
      />
      <MetricCard
        title="Water Usage"
        value={metricsData.waterUsage.total}
        unit="m³"
        icon={Droplets}
        color="bg-blue-600"
        benchmark={metricsData.waterUsage.benchmarks}
      />
      <MetricCard
        title="Energy Consumption"
        value={metricsData.energyConsumption.total}
        unit="kWh"
        icon={Zap}
        color="bg-yellow-600"
        benchmark={metricsData.energyConsumption.benchmarks}
      />
      <MetricCard
        title="Circularity Rate"
        value={metricsData.circularityIndex.total}
        unit="%"
        icon={Recycle}
        color="bg-purple-600"
        benchmark={metricsData.circularityIndex.benchmarks}
      />
    </div>
  );
}
