"use client";

import { useState, useEffect } from "react";
import { bomTemplates } from "../../data/bom";
import { materialsInventory } from "../../data/materials";
import { formatNumber, formatCurrency, cn } from "../../lib/utils";
import {
  Bot,
  Play,
  CheckCircle,
  AlertTriangle,
  Truck,
  Leaf,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function OptimizePage() {
  const [selectedBom, setSelectedBom] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [preferences, setPreferences] = useState({
    prioritize_recycled: true,
    cost_weight: 0.3,
    environmental_weight: 0.7,
  });

  const runOptimization = async () => {
    if (!selectedBom) {
      alert("Please select a BOM to optimize");
      return;
    }

    setIsOptimizing(true);
    setOptimizationResult(null);

    try {
      const bomData = bomTemplates.find((bom) => bom.id === selectedBom);

      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bom: bomData,
          inventory: materialsInventory,
          preferences: preferences,
        }),
      });

      if (!response.ok) {
        throw new Error("Optimization failed");
      }

      const result = await response.json();
      setOptimizationResult(result);
    } catch (error) {
      console.error("Optimization error:", error);
      alert("Optimization failed. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const OptimizationCard = ({ recommendation }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-white">
            {recommendation.component}
          </h3>
          <p className="text-sm text-gray-400">
            {recommendation.material} ({recommendation.grade})
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-white">
            Confidence: {recommendation.confidence}%
          </div>
          <div className="text-sm text-gray-400">
            Score: {recommendation.sustainability_score}/100
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {recommendation.allocations.map((allocation, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-semibold rounded-full mr-2",
                    allocation.source === "Recycled"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  )}
                >
                  {allocation.source}
                </span>
                <span className="font-medium text-white">
                  {allocation.percentage}%
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {allocation.quantity} {allocation.unit}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Cost:</span>
                <span className="font-medium text-white ml-1">
                  ₹{allocation.cost_per_unit}/{allocation.unit}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Lead Time:</span>
                <span className="font-medium text-white ml-1">
                  {allocation.lead_time} days
                </span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="text-green-600 font-medium ml-1">
                  {allocation.availability}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  AI-Powered Optimization
                </h1>
                <p className="text-gray-400 mt-1">
                  Intelligent material allocation and logistics optimization
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Optimization Configuration
            </h2>

            <div className="space-y-6">
              {/* BOM Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Bill of Materials
                </label>
                <select
                  value={selectedBom}
                  onChange={(e) => setSelectedBom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
                >
                  <option value="">Choose a BOM...</option>
                  {bomTemplates.map((bom) => (
                    <option key={bom.id} value={bom.id}>
                      {bom.productName} ({bom.components.length} components)
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Optimization Preferences
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.prioritize_recycled}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            prioritize_recycled: e.target.checked,
                          }))
                        }
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-300">
                        Prioritize recycled materials
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cost Weight: {Math.round(preferences.cost_weight * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={preferences.cost_weight}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          cost_weight: parseFloat(e.target.value),
                          environmental_weight: 1 - parseFloat(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Environmental Weight:{" "}
                      {Math.round(preferences.environmental_weight * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={preferences.environmental_weight}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          environmental_weight: parseFloat(e.target.value),
                          cost_weight: 1 - parseFloat(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={runOptimization}
                disabled={isOptimizing || !selectedBom}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {/* Status Panel */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">AI Model</span>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Data Sources</span>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 text-sm">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Inventory</span>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 text-sm">Updated</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Market Data</span>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 text-sm">Live</span>
                </div>
              </div>
            </div>

            {optimizationResult && (
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="font-medium text-white mb-2">
                  Last Optimization
                </h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>ID: {optimizationResult.optimization_id.slice(-8)}</div>
                  <div>Confidence: {optimizationResult.confidence_score}%</div>
                  <div>
                    Processing: {optimizationResult.processing_time_ms}ms
                  </div>
                  <div>Model: v{optimizationResult.model_version}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {optimizationResult && (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <TrendingDown className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">
                  CO₂ Savings
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {optimizationResult.logistics.estimated_total_co2_saving}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingDown className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">
                  Cost Savings
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {optimizationResult.logistics.estimated_cost_saving}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Truck className="w-6 h-6 text-purple-600" />
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">
                  Routes
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {optimizationResult.logistics.optimal_routes.length}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">
                  Confidence
                </h3>
                <p className="text-2xl font-bold text-orange-600">
                  {optimizationResult.confidence_score}%
                </p>
              </div>
            </div>

            {/* Material Recommendations */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Material Allocation Recommendations
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {optimizationResult.recommendations.map((rec, index) => (
                  <OptimizationCard key={index} recommendation={rec} />
                ))}
              </div>
            </div>

            {/* Logistics Optimization */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Logistics Optimization
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {optimizationResult.logistics.optimal_routes.map(
                  (route, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 rounded-lg p-4"
                    >
                      <h3 className="font-semibold text-white mb-2">
                        Route {index + 1}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {route.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Distance:</span>
                          <span className="font-medium text-white ml-1">
                            {formatNumber(route.total_distance)} km
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Cost:</span>
                          <span className="font-medium text-white ml-1">
                            {formatCurrency(route.estimated_cost)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">CO₂:</span>
                          <span className="font-medium text-white ml-1">
                            {formatNumber(route.estimated_co2)} kg
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Delivery:</span>
                          <span className="font-medium text-white ml-1">
                            {route.estimated_delivery} days
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-gray-400">
                          Transport:{" "}
                        </span>
                        <span className="text-xs text-gray-800">
                          {route.transport_modes.join(" + ")}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Environmental Impact Assessment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {Object.entries(optimizationResult.environmental_impact).map(
                  ([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {value}%
                      </div>
                      <div className="text-sm text-gray-400 capitalize">
                        {key.replace(/_/g, " ")}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
