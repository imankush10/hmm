// components/dashboard/DashboardHeader.js (New File)
"use client";

export default function DashboardHeader() {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">LCA Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Lifecycle & Circularity Assessment Platform
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Data as of</div>
          <div className="text-lg font-semibold text-white">{lastUpdated}</div>
        </div>
      </div>
    </div>
  );
}
