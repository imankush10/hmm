// components/inventory/InventoryHeader.js (New File)
"use client";

import { Plus, Shield, Download } from "lucide-react";

export default function InventoryHeader({ isAdmin, onAdd, onExport }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Material Inventory</h1>
          <p className="text-gray-400 mt-2">
            Track and manage your material resources with full traceability
          </p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <button
              onClick={onAdd}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Material
            </button>
          )}
          <button
            onClick={onExport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
