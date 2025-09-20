// components/dashboard/KpiGrid.js (New File)
"use client";

import KpiCard from "./KpiCard";
import { Factory, Recycle, TrendingDown, CheckCircle } from "lucide-react";

export default function KpiGrid({ kpis }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Inventory Levels"
        value={kpis.inventoryLevels.available}
        unit={kpis.inventoryLevels.unit}
        trend="+5.2%"
        icon={Factory}
        color="bg-blue-600"
      />
      <KpiCard
        title="Recycled Content"
        value={kpis.recycledContent.percentage}
        unit="%"
        trend={kpis.recycledContent.improvement}
        icon={Recycle}
        color="bg-green-600"
      />
      <KpiCard
        title="CO₂ Savings"
        value={kpis.co2Savings.amount}
        unit="kg CO₂e"
        trend={kpis.co2Savings.monthlyTrend}
        icon={TrendingDown}
        color="bg-emerald-600"
      />
      <KpiCard
        title="Circularity Rate"
        value={kpis.circularityRate.current}
        unit="%"
        trend={kpis.circularityRate.improvement}
        icon={CheckCircle}
        color="bg-purple-600"
      />
    </div>
  );
}
