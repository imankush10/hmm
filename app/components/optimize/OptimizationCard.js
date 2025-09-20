// components/optimize/OptimizationCard.js (New File)
"use client";
import { cn } from "@/lib/utils";

export default function OptimizationCard({ recommendation }) {
  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-white">
            {recommendation.component}
          </h3>
          <p className="text-sm text-gray-400">
            {recommendation.material} ({recommendation.grade})
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-sm font-medium text-blue-300">
            Confidence: {recommendation.confidence}%
          </div>
          <div className="text-sm text-gray-400">
            Score: {recommendation.sustainability_score}/100
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {recommendation.allocations.map((alloc, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-semibold rounded-full mr-2",
                    alloc.source === "Recycled"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-blue-500/20 text-blue-300"
                  )}
                >
                  {alloc.source}
                </span>
                <span className="font-medium text-white">
                  {alloc.percentage}%
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {alloc.quantity} {alloc.unit}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 text-sm mt-3 border-t border-gray-700 pt-2">
              <div>
                <span className="text-gray-400">Cost:</span>
                <span className="font-medium text-white ml-1">
                  ₹{alloc.cost_per_unit}/{alloc.unit}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Lead Time:</span>
                <span className="font-medium text-white ml-1">
                  {alloc.lead_time} days
                </span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-medium ml-1">
                  {alloc.availability}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
