// components/dashboard/KpiGrid.js (Updated to fetch from ML API)
"use client";

import { useState, useEffect } from "react";
import KpiCard from "./KpiCard";
import { Factory, Recycle, TrendingDown, CheckCircle } from "lucide-react";

export default function KpiGrid() {
  const [kpiData, setKpiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const response = await fetch("/api/circularity");
        if (!response.ok)
          throw new Error("Failed to fetch KPI data from circularity API");
        const data = await response.json();

        // Data is already in the correct format from our API
        setKpiData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKpiData();
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
          Error loading KPI data: {error}
        </div>
      </div>
    );
  }

  if (!kpiData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 text-yellow-400">
          No KPI data available
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Carbon Footprint"
        value={kpiData.carbonFootprint.value}
        unit={kpiData.carbonFootprint.unit}
        trend={kpiData.carbonFootprint.trend}
        icon={TrendingDown}
        color="bg-red-600"
      />
      <KpiCard
        title="Water Usage"
        value={kpiData.waterUsage.value}
        unit={kpiData.waterUsage.unit}
        trend={kpiData.waterUsage.trend}
        icon={Factory}
        color="bg-blue-600"
      />
      <KpiCard
        title="Waste Generated"
        value={kpiData.wasteGenerated.value}
        unit={kpiData.wasteGenerated.unit}
        trend={kpiData.wasteGenerated.trend}
        icon={Recycle}
        color="bg-orange-600"
      />
      <KpiCard
        title="Circularity Index"
        value={kpiData.circularityIndex.value}
        unit={kpiData.circularityIndex.unit}
        trend={kpiData.circularityIndex.trend}
        icon={CheckCircle}
        color="bg-purple-600"
      />
    </div>
  );
}
