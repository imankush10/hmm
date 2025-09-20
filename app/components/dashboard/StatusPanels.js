// components/dashboard/StatusPanels.js (New File)
"use client";

import { CheckCircle } from "lucide-react";

const HealthItem = ({ title }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-400">{title}</span>
    <div className="flex items-center">
      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
      <span className="text-green-400 font-medium">Operational</span>
    </div>
  </div>
);

const ActivityItem = ({ title, description }) => (
  <div className="text-sm">
    <div className="font-medium text-white">{title}</div>
    <div className="text-gray-400">{description}</div>
  </div>
);

export default function StatusPanels() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
        <div className="space-y-3">
          <HealthItem title="Inventory Tracking" />
          <HealthItem title="BOM Management" />
          <HealthItem title="AI Optimization" />
          <HealthItem title="Report Generation" />
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          <ActivityItem
            title="New BOM Created"
            description="Chassis Cross-Member - 2 hours ago"
          />
          <ActivityItem
            title="Optimization Run"
            description="EV Door Frame - 4 hours ago"
          />
          <ActivityItem
            title="Inventory Updated"
            description="SS 316 stock - 6 hours ago"
          />
          <ActivityItem
            title="Report Generated"
            description="Q3 Sustainability - 1 day ago"
          />
        </div>
      </div>
    </div>
  );
}
