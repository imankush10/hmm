// components/optimize/ResultsDashboard.js (New File)
"use client";

import MetricCard from "./MetricCard";
import OptimizationCard from "./OptimizationCard";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Leaf, DollarSign, Truck, Clock } from "lucide-react";

export default function ResultsDashboard({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Leaf className="w-6 h-6 text-green-400" />}
          title="CO₂ Savings"
          value={result.logistics.estimated_total_co2_saving}
          trend="down"
        />
        <MetricCard
          icon={<DollarSign className="w-6 h-6 text-blue-400" />}
          title="Cost Savings"
          value={result.logistics.estimated_cost_saving}
          trend="down"
        />
        <MetricCard
          icon={<Truck className="w-6 h-6 text-purple-400" />}
          title="Optimal Routes"
          value={result.logistics.optimal_routes.length}
        />
        <MetricCard
          icon={<Clock className="w-6 h-6 text-orange-400" />}
          title="Confidence Score"
          value={`${result.confidence_score}%`}
        />
      </div>

      {/* Material Recommendations */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">
          Material Allocation Recommendations
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {result.recommendations.map((rec, index) => (
            <OptimizationCard key={index} recommendation={rec} />
          ))}
        </div>
      </div>

      {/* Other result sections can be added here in the same pattern */}
    </div>
  );
}
