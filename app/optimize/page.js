// app/optimize/page.js (Updated and Final)
"use client";

import { useState, useEffect } from "react";
import { Bot } from "lucide-react";

// Import our new components
import ConfigurationPanel from "@/app/components/optimize/ConfigurationPanel";
import SystemStatus from "@/app/components/optimize/SystemStatus";
import ResultsDashboard from "@/app/components/optimize/ResultsDashboard";

export default function OptimizePage() {
  const [boms, setBoms] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBom, setSelectedBom] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [preferences, setPreferences] = useState({
    prioritize_recycled: true,
    cost_weight: 0.3,
    environmental_weight: 0.7,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bomsResponse, inventoryResponse] = await Promise.all([
          fetch("/api/boms"),
          fetch("/api/materials"),
        ]);
        if (!bomsResponse.ok || !inventoryResponse.ok)
          throw new Error("Failed to fetch necessary optimization data.");

        const bomsData = await bomsResponse.json();
        const inventoryData = await inventoryResponse.json();

        setBoms(bomsData.bomsForML);
        setInventory(inventoryData.inventoryForML);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const runOptimization = async () => {
    if (!selectedBom) return alert("Please select a BOM to optimize");
    setIsOptimizing(true);
    setOptimizationResult(null);
    try {
      const bomData = boms.find((bom) => bom.id === selectedBom);
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bom: bomData, inventory, preferences }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Optimization failed");
      }
      const result = await response.json();
      setOptimizationResult(result);
    } catch (error) {
      console.error("Optimization error:", error);
      alert(`Optimization failed: ${error.message}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handlePreferenceChange = (newPrefs) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading Optimization Data...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ConfigurationPanel
            boms={boms}
            selectedBom={selectedBom}
            onBomChange={setSelectedBom}
            preferences={preferences}
            onPreferenceChange={handlePreferenceChange}
            onRunOptimization={runOptimization}
            isOptimizing={isOptimizing}
          />
          <SystemStatus result={optimizationResult} />
        </div>

        {optimizationResult && <ResultsDashboard result={optimizationResult} />}
      </div>
    </div>
  );
}
