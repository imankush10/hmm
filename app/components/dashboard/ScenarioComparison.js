// components/dashboard/ScenarioComparison.js (New File)
"use client";

import { useState } from "react";
import { formatNumber, formatCurrency } from "@/lib/utils";

export default function ScenarioComparison({ scenarios }) {
  const [selected, setSelected] = useState(Object.keys(scenarios)[0]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          Scenario Comparison
        </h3>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="px-3 py-1 border border-gray-600 rounded-lg text-white bg-gray-700 text-sm"
        >
          {Object.keys(scenarios).map((scenario) => (
            <option key={scenario} value={scenario}>
              {scenario}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {scenarios[selected].scenarios.map((scenario, index) => (
          <div
            key={index}
            className="bg-gray-900/50 border border-gray-700 rounded-lg p-4"
          >
            <h4 className="font-semibold text-white mb-3">{scenario.name}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">CO₂ Footprint:</span>
                <span className="font-medium text-white ml-2">
                  {formatNumber(scenario.co2Footprint)} kg
                </span>
              </div>
              <div>
                <span className="text-gray-400">Cost:</span>
                <span className="font-medium text-white ml-2">
                  {formatCurrency(scenario.cost)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Energy Use:</span>
                <span className="font-medium text-white ml-2">
                  {formatNumber(scenario.energyUse)} kWh
                </span>
              </div>
              <div>
                <span className="text-gray-400">Water Use:</span>
                <span className="font-medium text-white ml-2">
                  {formatNumber(scenario.waterUse)} m³
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
