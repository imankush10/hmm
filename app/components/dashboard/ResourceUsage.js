// components/dashboard/ResourceUsage.js (New File)
"use client";

import CircularProgressBar from "./CircularProgressBar";
import { formatNumber } from "@/lib/utils";

export default function ResourceUsage({ kpis }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Resource Usage</h3>
      <div className="grid grid-cols-2 gap-8">
        <div className="text-center">
          <CircularProgressBar
            percentage={kpis.energyConsumption.renewablePercentage}
            color="#10B981"
          />
          <h4 className="font-semibold text-white mt-4">Renewable Energy</h4>
          <p className="text-sm text-gray-400">
            {formatNumber(kpis.energyConsumption.renewable)} /{" "}
            {formatNumber(kpis.energyConsumption.total)} kWh
          </p>
        </div>
        <div className="text-center">
          <CircularProgressBar
            percentage={kpis.waterUsage.recycledPercentage}
            color="#06B6D4"
          />
          <h4 className="font-semibold text-white mt-4">Water Recycling</h4>
          <p className="text-sm text-gray-400">
            {formatNumber(kpis.waterUsage.recycled)} /{" "}
            {formatNumber(kpis.waterUsage.total)} m³
          </p>
        </div>
      </div>
    </div>
  );
}
