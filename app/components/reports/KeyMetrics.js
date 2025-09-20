// components/reports/KeyMetrics.js (New File)
"use client";

import MetricCard from "./MetricCard";
import { Leaf, Droplets, Zap, Recycle } from "lucide-react";

export default function KeyMetrics({ reports }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Carbon Footprint"
        value={reports.carbonFootprint.total}
        unit="tons CO₂e"
        icon={Leaf}
        color="bg-green-600"
        benchmark={reports.carbonFootprint.benchmarks}
      />
      <MetricCard
        title="Water Usage"
        value={reports.waterUsage.total}
        unit="m³"
        icon={Droplets}
        color="bg-blue-600"
        benchmark={reports.waterUsage.benchmarks}
      />
      <MetricCard
        title="Energy Consumption"
        value={reports.energyConsumption.total}
        unit="kWh"
        icon={Zap}
        color="bg-yellow-600"
        benchmark={reports.energyConsumption.benchmarks}
      />
      <MetricCard
        title="Circularity Rate"
        value={reports.circularityMetrics.overall}
        unit="%"
        icon={Recycle}
        color="bg-purple-600"
      />
    </div>
  );
}
