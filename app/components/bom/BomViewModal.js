// components/bom/BomViewModal.js (New File)
"use client";

import {
  cn,
  formatCurrency,
  formatDate,
  getCriticalityColor,
} from "@/lib/utils";
import { Download, X } from "lucide-react";

export default function BomViewModal({ bom, onClose, onExport }) {
  if (!bom) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-white">{bom.productName}</h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-gray-400 text-sm font-mono">{bom.id}</span>
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-semibold rounded-full",
                  getCriticalityColor(bom.criticalityLevel)
                )}
              >
                {bom.criticalityLevel}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-300 mb-1 text-sm">
                Description
              </h3>
              <p className="text-white">{bom.description}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">
                  Estimated Cost:
                </span>
                <span className="text-white">
                  {formatCurrency(bom.estimatedCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">
                  Created Date:
                </span>
                <span className="text-white">
                  {formatDate(bom.createdDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Components:</span>
                <span className="text-white">{bom.components.length}</span>
              </div>
            </div>
          </div>
          <h3 className="font-semibold text-white mb-4 border-t border-gray-700 pt-4">
            Components
          </h3>
          <div className="space-y-3">
            {bom.components.map((component, index) => (
              <div
                key={index}
                className="bg-gray-900/50 border border-gray-700 rounded-lg p-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-white">{component.name}</p>
                    <p className="text-gray-400">
                      {component.materialType}{" "}
                      {component.materialGrade &&
                        `(${component.materialGrade})`}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="font-medium text-white">
                      {component.requiredQuantity} {component.unit}
                    </p>
                  </div>
                  {component.requiredProperties &&
                    component.requiredProperties.length > 0 && (
                      <div className="md:col-span-3 border-t border-gray-700 mt-2 pt-2">
                        <p className="text-xs font-medium text-gray-400 mb-1">
                          Required Properties:
                        </p>
                        <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                          {component.requiredProperties.map(
                            (prop, propIndex) => (
                              <li key={propIndex}>{prop}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-700 flex justify-end gap-4">
          <button
            onClick={() => onExport(bom)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
