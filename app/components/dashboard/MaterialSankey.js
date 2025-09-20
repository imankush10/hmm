// components/dashboard/MaterialSankey.js (Final Version)
"use client";

import { formatNumber } from "@/lib/utils";

const sankeyData = [
  { name: "Primary Materials", value: 200, color: "#EF4444" },
  { name: "Recycled Materials", value: 280, color: "#10B981" },
  { name: "Processing", value: 480, color: "#3B82F6" },
  { name: "Manufacturing", value: 450, color: "#8B5CF6" },
  { name: "Products", value: 420, color: "#06B6D4" },
  { name: "Waste", value: 30, color: "#F59E0B" },
];

export default function MaterialSankey() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">
        Simplified Material Flow
      </h3>

      {/* This wrapper will still grow, but now has less space to fill */}
      <div className="flex-grow flex flex-col justify-center space-y-3">
        {sankeyData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-32 text-sm font-medium text-gray-300">
              {item.name}
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-700 rounded-full h-6">
                <div
                  className="h-6 rounded-full"
                  style={{
                    width: `${(item.value / 500) * 100}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
            </div>
            <div className="w-20 text-sm font-medium text-white text-right">
              {formatNumber(item.value)} tons
            </div>
          </div>
        ))}
      </div>

      {/* ✅ ADDED: Summary stats footer */}
      <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-400">87.5%</div>
          <div className="text-sm text-gray-400">Process Efficiency</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">58.3%</div>
          <div className="text-sm text-gray-400">Recycled Content</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-400">6.7%</div>
          <div className="text-sm text-gray-400">Waste Rate</div>
        </div>
      </div>
    </div>
  );
}
