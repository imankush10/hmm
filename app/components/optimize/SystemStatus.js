// components/optimize/SystemStatus.js (New File)
"use client";
import { CheckCircle } from "lucide-react";

const StatusItem = ({ label }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-400">{label}</span>
    <div className="flex items-center">
      <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
      <span className="text-green-400 text-sm">Online</span>
    </div>
  </div>
);

export default function SystemStatus({ result }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
      <div className="space-y-3">
        <StatusItem label="AI Model" />
        <StatusItem label="Data Sources" />
        <StatusItem label="Inventory" />
        <StatusItem label="Market Data" />
      </div>
      {result && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h4 className="font-medium text-white mb-2">Last Optimization</h4>
          <div className="text-sm text-gray-400 space-y-1">
            <div>ID: {result.optimization_id.slice(-8)}</div>
            <div>Confidence: {result.confidence_score}%</div>
            <div>Processing: {result.processing_time_ms.toFixed(0)}ms</div>
          </div>
        </div>
      )}
    </div>
  );
}
