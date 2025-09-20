// components/dashboard/KpiCard.js (New File)
"use client";

import { formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({
  title,
  value,
  unit,
  trend,
  icon: Icon,
  color,
}) {
  const isPositiveTrend = trend?.startsWith("+");

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
                isPositiveTrend ? "text-green-400" : "text-red-400"
              }`}
            >
              {isPositiveTrend ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {trend}
            </div>
          )}
        </div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div className="flex items-baseline mt-1">
          <span className="text-2xl font-bold text-white">
            {formatNumber(value)}
          </span>
          <span className="text-gray-500 ml-2">{unit}</span>
        </div>
      </div>
    </div>
  );
}
