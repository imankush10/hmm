// components/optimize/MetricCard.js (New File)
"use client";

import { TrendingDown, TrendingUp, CheckCircle } from "lucide-react";

export default function MetricCard({ icon, title, value, trend }) {
  const TrendIcon =
    trend === "down" ? TrendingDown : trend === "up" ? TrendingUp : CheckCircle;
  const colorClass =
    trend === "down"
      ? "text-green-400"
      : trend === "up"
      ? "text-red-400"
      : "text-green-400";

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-5 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-gray-700 rounded-lg">{icon}</div>
        <TrendIcon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div className="mt-4">
        <p className="text-gray-400 text-sm">{title}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
}
