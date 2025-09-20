// components/reports/EnergyBreakdown.js (New File)
"use client";

import { formatNumber } from "@/lib/utils";
import { Zap } from "lucide-react";

export default function EnergyBreakdown({ data }) {
  const formatCategoryName = (name) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Energy Consumption Breakdown
      </h3>
      <div className="space-y-4">
        {Object.entries(data.breakdown).map(([category, value]) => (
          <div key={category} className="flex items-center text-sm">
            <span className="w-28 text-gray-300 capitalize">
              {formatCategoryName(category)}
            </span>
            <div className="flex-1 mx-3">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${(value / data.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="w-20 font-medium text-white text-right">
              {formatNumber(value)} kWh
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-green-400 mr-2" />
          <span className="font-medium text-green-300">
            {data.renewablePercentage}% Renewable Energy
          </span>
        </div>
        <p className="text-sm text-green-400/80 mt-1 ml-7">
          {formatNumber(data.renewable)} kWh from renewable sources
        </p>
      </div>
    </div>
  );
}
