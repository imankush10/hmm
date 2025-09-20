// components/optimize/ConfigurationPanel.js (New File)
"use client";
import { Play } from "lucide-react";

export default function ConfigurationPanel({
  boms,
  selectedBom,
  onBomChange,
  preferences,
  onPreferenceChange,
  onRunOptimization,
  isOptimizing,
}) {
  const handleSliderChange = (e, weightType) => {
    const value = parseFloat(e.target.value);
    if (weightType === "cost") {
      onPreferenceChange({
        cost_weight: value,
        environmental_weight: 1 - value,
      });
    } else {
      onPreferenceChange({
        environmental_weight: value,
        cost_weight: 1 - value,
      });
    }
  };

  return (
    <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">
        Optimization Configuration
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Bill of Materials
          </label>
          <select
            value={selectedBom}
            onChange={(e) => onBomChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
          >
            <option value="">Choose a BOM...</option>
            {boms.map((bom) => (
              <option key={bom.id} value={bom.id}>
                {bom.productName} ({bom.components.length} components)
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3 className="text-lg font-medium text-white mb-3">
            Optimization Preferences
          </h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.prioritize_recycled}
                onChange={(e) =>
                  onPreferenceChange({ prioritize_recycled: e.target.checked })
                }
                className="rounded text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500"
              />{" "}
              <span className="ml-2 text-sm text-gray-300">
                Prioritize recycled materials
              </span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Cost Weight: {Math.round(preferences.cost_weight * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={preferences.cost_weight}
                onChange={(e) => handleSliderChange(e, "cost")}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Environmental Weight:{" "}
                {Math.round(preferences.environmental_weight * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={preferences.environmental_weight}
                onChange={(e) => handleSliderChange(e, "env")}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <button
          onClick={onRunOptimization}
          disabled={isOptimizing || !selectedBom}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isOptimizing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Run AI Optimization</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
