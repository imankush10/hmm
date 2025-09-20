// app/dashboard/page.js (Final Version with All Components)
"use client";

import { useState, useEffect } from "react";

// Import all our dashboard components
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import KpiGrid from "@/app/components/dashboard/KpiGrid";
import MaterialFlowChart from "@/app/components/dashboard/MaterialFlowChart";
import ResourceUsage from "@/app/components/dashboard/ResourceUsage";
import MaterialSankey from "@/app/components/dashboard/MaterialSankey";
import ScenarioComparison from "@/app/components/dashboard/ScenarioComparison";
import StatusPanels from "@/app/components/dashboard/StatusPanels";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) throw new Error("Data could not be fetched.");
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  if (!dashboardData)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        No dashboard data available.
      </div>
    );

  const { kpis, scenarios, flowData } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />

        <KpiGrid kpis={kpis} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MaterialFlowChart data={flowData} />
          <ResourceUsage kpis={kpis} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <MaterialSankey />
          </div>
          <div className="lg:col-span-2">
            <ScenarioComparison scenarios={scenarios} />
          </div>
        </div>

        <StatusPanels />
      </div>
    </div>
  );
}
