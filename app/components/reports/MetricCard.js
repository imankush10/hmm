// components/reports/MetricCard.js (New File)
"use client";

import { formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  trend,
  benchmark,
}) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-5 border border-gray-700 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div
              className={`flex items-center text-sm font-semibold ${
                trend > 0 ? "text-red-400" : "text-green-400"
              }`}
            >
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-white">
            {formatNumber(value)}
          </span>
          <span className="text-gray-500 ml-2">{unit}</span>
        </div>
      </div>
      {benchmark && (
        <div className="text-xs text-gray-500 mt-3 border-t border-gray-700 pt-2 space-y-1">
          <div>
            Industry Avg: {formatNumber(benchmark.industryAverage)} {unit}
          </div>
          <div>
            Best in Class: {formatNumber(benchmark.bestInClass)} {unit}
          </div>
        </div>
      )}
    </div>
  );
}
