// components/reports/ImprovementCard.js (New File)
"use client";

import { cn } from "@/lib/utils";
import { Target } from "lucide-react";

export default function ImprovementCard({ recommendation }) {
  const priorityColor = {
    High: "bg-red-500/20 text-red-300",
    Medium: "bg-yellow-500/20 text-yellow-300",
    Low: "bg-green-500/20 text-green-300",
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className={cn(
              "px-2 py-1 text-xs font-semibold rounded-full",
              priorityColor[recommendation.priority]
            )}
          >
            {recommendation.priority} Priority
          </span>
          <h4 className="font-semibold text-white mt-2">
            {recommendation.category}
          </h4>
        </div>
        <Target className="w-5 h-5 text-blue-400 flex-shrink-0" />
      </div>
      <p className="text-gray-300 mb-3 flex-grow">
        {recommendation.recommendation}
      </p>
      <div className="space-y-2 text-sm border-t border-gray-700 pt-3">
        <div>
          <span className="font-medium text-gray-400">Impact:</span>
          <span className="text-gray-300 ml-2">{recommendation.impact}</span>
        </div>
        <div>
          <span className="font-medium text-gray-400">Timeline:</span>
          <span className="text-gray-300 ml-2">{recommendation.timeline}</span>
        </div>
        <div>
          <span className="font-medium text-gray-400">Investment:</span>
          <span className="text-gray-300 ml-2">
            {recommendation.investment}
          </span>
        </div>
      </div>
    </div>
  );
}
