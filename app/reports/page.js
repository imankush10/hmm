// app/reports/page.js (Final and Complete)
"use client";

import { useState, useEffect } from "react";

// Import all our report components
import ReportHeader from "@/app/components/reports/ReportHeader";
import ReportMetadata from "@/app/components/reports/ReportMetadata";
import KeyMetrics from "@/app/components/reports/KeyMetrics";
import CarbonBreakdownChart from "@/app/components/reports/CarbonBreakdownChart";
import CarbonTrendsChart from "@/app/components/reports/CarbonTrendsChart";
import CircularityChart from "@/app/components/reports/CircularityChart";
import EnergyBreakdown from "@/app/components/reports/EnergyBreakdown"; // Import the new component
import ImprovementCard from "@/app/components/reports/ImprovementCard";
import IndustryComparison from "@/app/components/reports/IndustryComparison";

export default function ReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch("/api/reports");
        if (!response.ok) throw new Error("Failed to fetch report data.");
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    window.print();
    setTimeout(() => setIsGeneratingPDF(false), 1000);
  };

  const exportData = (format) => {
    if (!reportData || format !== "json") return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LCA-Report-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading Reports...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  if (!reportData)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        No report data available.
      </div>
    );

  const { environmentalReports, reportMetadata, improvementRecommendations } =
    reportData;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6 print-container">
        <div className="no-print">
          <ReportHeader
            onExport={exportData}
            onGeneratePDF={generatePDF}
            isGeneratingPDF={isGeneratingPDF}
          />
        </div>

        <ReportMetadata metadata={reportMetadata} />
        <KeyMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CarbonBreakdownChart data={environmentalReports.carbonFootprint} />
          <CarbonTrendsChart />
        </div>

        {/* ✅ ADDED: The missing components in their own grid row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnergyBreakdown data={environmentalReports.energyConsumption} />
          <CircularityChart data={environmentalReports.circularityMetrics} />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Improvement Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {improvementRecommendations.map((rec, index) => (
              <ImprovementCard key={index} recommendation={rec} />
            ))}
          </div>
        </div>

        <IndustryComparison data={environmentalReports.circularityMetrics} />
      </div>
    </div>
  );
}
