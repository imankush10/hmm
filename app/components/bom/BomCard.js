// components/bom/BomCard.js (New File)
"use client";

import {
  cn,
  formatCurrency,
  formatDate,
  getCriticalityColor,
} from "@/lib/utils";
import { Download, Edit, Eye, Trash2, Lock } from "lucide-react";

export default function BomCard({
  bom,
  onEdit,
  onView,
  onDelete,
  onExport,
  isAdmin,
}) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col justify-between border border-gray-700 hover:border-blue-500 transition-all duration-300">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{bom.productName}</h3>
            <p className="text-xs text-gray-500 font-mono mt-1">{bom.id}</p>
          </div>
          <span
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-full",
              getCriticalityColor(bom.criticalityLevel)
            )}
          >
            {bom.criticalityLevel}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
          {bom.description}
        </p>
        <div className="space-y-2 mb-5 border-t border-gray-700 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Components:</span>
            <span className="font-medium text-white">
              {bom.components?.length || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Est. Cost:</span>
            <span className="font-medium text-white">
              {formatCurrency(bom.estimatedCost)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Created:</span>
            <span className="font-medium text-white">
              {formatDate(bom.createdDate)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onView(bom)}
          className="flex-1 bg-gray-700 text-gray-300 px-3 py-2 rounded-md text-sm hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors"
        >
          <Eye className="w-4 h-4" /> View
        </button>
        {isAdmin ? (
          <>
            <button
              onClick={() => onEdit(bom)}
              className="flex-1 bg-blue-600/20 text-blue-300 px-3 py-2 rounded-md text-sm hover:bg-blue-500 hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => onExport(bom)}
              className="bg-green-600/20 text-green-300 p-2 rounded-md text-sm hover:bg-green-500 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(bom._id)}
              className="bg-red-600/20 text-red-300 p-2 rounded-md text-sm hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-1 text-gray-500 text-xs">
            <Lock className="w-3 h-3" /> Admin Only
          </div>
        )}
      </div>
    </div>
  );
}
