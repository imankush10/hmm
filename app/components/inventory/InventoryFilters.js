// components/inventory/InventoryFilters.js (New File)
"use client";

import { Search, Filter } from "lucide-react";

export default function InventoryFilters({
  searchTerm,
  filterType,
  filterStatus,
  onFilterChange,
  materialTypes,
  resultCount,
  totalCount,
}) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
        >
          <option value="">All Types</option>
          {materialTypes
            .filter((type, index, arr) => type && arr.indexOf(type) === index)
            .map((type, index) => (
              <option key={`type-${index}-${type}`} value={type}>
                {type}
              </option>
            ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <div className="flex items-center justify-center text-sm text-gray-400 bg-gray-900 rounded-lg px-4 py-2">
          <Filter className="w-4 h-4 mr-2" />
          {resultCount} of {totalCount} materials
        </div>
      </div>
    </div>
  );
}
