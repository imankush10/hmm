"use client";

import { useState } from "react";
import {
  environmentalReports,
  reportMetadata,
  improvementRecommendations,
} from "../../data/reports";
import { formatNumber, formatCurrency, formatDate, cn } from "../../lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Leaf,
  Droplets,
  Zap,
  Recycle,
  AlertTriangle,
  CheckCircle,
  Award,
  Target,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("sustainability");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add title
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Environmental Impact & Circularity Assessment Report", 20, 30);

      // Add metadata
      pdf.setFontSize(12);
      pdf.text(
        `Generated on: ${formatDate(reportMetadata.generatedDate)}`,
        20,
        45
      );
      pdf.text(`Reporting Period: ${reportMetadata.reportingPeriod}`, 20, 55);

      // Add carbon footprint section
      pdf.setFontSize(16);
      pdf.text("Carbon Footprint Analysis", 20, 75);
      pdf.setFontSize(12);
      pdf.text(
        `Total Emissions: ${formatNumber(
          environmentalReports.carbonFootprint.total
        )} ${environmentalReports.carbonFootprint.unit}`,
        20,
        90
      );

      // Add breakdown
      let yPosition = 105;
      pdf.text("Breakdown by Source:", 20, yPosition);
      Object.entries(environmentalReports.carbonFootprint.breakdown).forEach(
        ([key, value]) => {
          yPosition += 10;
          pdf.text(
            `• ${key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}: ${formatNumber(
              value
            )} tons CO2e`,
            25,
            yPosition
          );
        }
      );

      // Add water usage section
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.text("Water Usage", 20, yPosition);
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.text(
        `Total Usage: ${formatNumber(environmentalReports.waterUsage.total)} ${
          environmentalReports.waterUsage.unit
        }`,
        20,
        yPosition
      );
      yPosition += 10;
      pdf.text(
        `Recycled: ${formatNumber(
          environmentalReports.waterUsage.recycled
        )} m³ (${environmentalReports.waterUsage.recyclingRate}%)`,
        20,
        yPosition
      );

      // Add energy consumption
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.text("Energy Consumption", 20, yPosition);
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.text(
        `Total Consumption: ${formatNumber(
          environmentalReports.energyConsumption.total
        )} ${environmentalReports.energyConsumption.unit}`,
        20,
        yPosition
      );
      yPosition += 10;
      pdf.text(
        `Renewable: ${formatNumber(
          environmentalReports.energyConsumption.renewable
        )} kWh (${
          environmentalReports.energyConsumption.renewablePercentage
        }%)`,
        20,
        yPosition
      );

      // Add circularity metrics
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.text("Circularity Metrics", 20, yPosition);
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.text(
        `Overall Circularity Rate: ${environmentalReports.circularityMetrics.overall}%`,
        20,
        yPosition
      );

      // Add new page if needed
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 30;
      }

      // Add recommendations
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.text("Improvement Recommendations", 20, yPosition);
      yPosition += 15;

      improvementRecommendations.forEach((rec, index) => {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 30;
        }

        pdf.setFontSize(12);
        pdf.text(`${index + 1}. ${rec.recommendation}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`   Impact: ${rec.impact}`, 25, yPosition);
        yPosition += 8;
        pdf.text(
          `   Timeline: ${rec.timeline} | Investment: ${rec.investment}`,
          25,
          yPosition
        );
        yPosition += 15;
      });

      // Add footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
        pdf.text("LCA Platform - Environmental Report", 20, pageHeight - 10);
      }

      // Save the PDF
      pdf.save(
        `LCA-Environmental-Report-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const exportData = (format) => {
    const data = {
      reportMetadata,
      environmentalReports,
      improvementRecommendations,
      generatedAt: new Date().toISOString(),
    };

    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LCA-Report-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const carbonBreakdownData = Object.entries(
    environmentalReports.carbonFootprint.breakdown
  ).map(([key, value]) => ({
    name: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    value,
    percentage: Math.round(
      (value / environmentalReports.carbonFootprint.total) * 100
    ),
  }));

  const circularityRadarData = Object.entries(
    environmentalReports.circularityMetrics.components
  ).map(([key, value]) => ({
    metric: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    current: value,
    target: environmentalReports.circularityMetrics.targets[key] || 85,
  }));

  const MetricCard = ({
    title,
    value,
    unit,
    icon: Icon,
    color,
    trend,
    benchmark,
    target,
  }) => (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center ${
              trend > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm font-medium text-white">
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <div className="flex items-baseline mb-2">
        <span className="text-3xl font-bold text-white">
          {formatNumber(value)}
        </span>
        <span className="text-gray-500 ml-2">{unit}</span>
      </div>
      {benchmark && (
        <div className="text-sm text-gray-400 space-y-1">
          <div>
            Industry Avg: {formatNumber(benchmark.industryAverage)} {unit}
          </div>
          <div>
            Best in Class: {formatNumber(benchmark.bestInClass)} {unit}
          </div>
          {target && (
            <div>
              Target: {formatNumber(target)} {unit}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Environmental Impact & Circularity Reports
              </h1>
              <p className="text-gray-400 mt-2">
                Comprehensive sustainability assessment and compliance reporting
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => exportData("json")}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                {isGeneratingPDF ? "Generating..." : "Export PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* Report Metadata */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Report Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-300 mb-2">
                Reporting Period
              </h3>
              <p className="text-white">{reportMetadata.reportingPeriod}</p>
              <p className="text-sm text-gray-400">
                Generated: {formatDate(reportMetadata.generatedDate)}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-300 mb-2">
                Compliance Standards
              </h3>
              <div className="space-y-1">
                {reportMetadata.complianceStandards
                  .slice(0, 3)
                  .map((standard, index) => (
                    <div
                      key={index}
                      className="text-sm text-white flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      {standard}
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-300 mb-2">Certifications</h3>
              <div className="space-y-1">
                {reportMetadata.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="text-sm text-white flex items-center"
                  >
                    <Award className="w-4 h-4 text-blue-600 mr-2" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Carbon Footprint"
            value={environmentalReports.carbonFootprint.total}
            unit="tons CO₂e"
            icon={Leaf}
            color="bg-green-600"
            benchmark={environmentalReports.carbonFootprint.benchmarks}
            target={
              environmentalReports.carbonFootprint.benchmarks.targetReduction
            }
          />

          <MetricCard
            title="Water Usage"
            value={environmentalReports.waterUsage.total}
            unit="m³"
            icon={Droplets}
            color="bg-blue-600"
            benchmark={environmentalReports.waterUsage.benchmarks}
            target={environmentalReports.waterUsage.benchmarks.target}
          />

          <MetricCard
            title="Energy Consumption"
            value={environmentalReports.energyConsumption.total}
            unit="kWh"
            icon={Zap}
            color="bg-yellow-600"
            benchmark={environmentalReports.energyConsumption.benchmarks}
            target={environmentalReports.energyConsumption.benchmarks.target}
          />

          <MetricCard
            title="Circularity Rate"
            value={environmentalReports.circularityMetrics.overall}
            unit="%"
            icon={Recycle}
            color="bg-purple-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carbon Footprint Breakdown */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Carbon Footprint Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={carbonBreakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {carbonBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    formatNumber(value) + " tons CO₂e",
                    "Emissions",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Carbon Footprint Trends */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Carbon Footprint Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={environmentalReports.carbonFootprint.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    formatNumber(value) + " tons CO₂e",
                    name,
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#EF4444"
                  strokeWidth={3}
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Usage Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Energy Breakdown */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Energy Consumption Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(
                environmentalReports.energyConsumption.breakdown
              ).map(([category, value]) => (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-300 capitalize">
                    {category
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (value /
                              environmentalReports.energyConsumption.total) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-medium text-white w-16 text-right">
                      {formatNumber(value)} kWh
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">
                  {environmentalReports.energyConsumption.renewablePercentage}%
                  Renewable Energy
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {formatNumber(environmentalReports.energyConsumption.renewable)}{" "}
                kWh from renewable sources
              </p>
            </div>
          </div>

          {/* Circularity Assessment */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Circularity Assessment
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={circularityRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#10B981"
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Management */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Waste Management & Diversion
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-300 mb-3">
                Waste Generation
              </h4>
              <div className="space-y-3">
                {Object.entries(
                  environmentalReports.wasteGeneration.breakdown
                ).map(([type, amount]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-gray-400 capitalize">
                      {type.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-medium text-white">
                      {formatNumber(amount)} tons
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-3">
                Waste Diversion
              </h4>
              <div className="space-y-3">
                {Object.entries(
                  environmentalReports.wasteGeneration.diversion
                ).map(([method, amount]) => (
                  <div
                    key={method}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-400 capitalize">
                      {method.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-medium text-white">
                      {formatNumber(amount)} tons
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">
                    {environmentalReports.wasteGeneration.diversionRate}%
                    Diversion Rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Recommendations */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Improvement Recommendations
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {improvementRecommendations.map((rec, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-semibold rounded-full",
                        rec.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : rec.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      )}
                    >
                      {rec.priority} Priority
                    </span>
                    <h4 className="font-semibold text-white mt-2">
                      {rec.category}
                    </h4>
                  </div>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-300 mb-3">{rec.recommendation}</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-300">Impact:</span>
                    <span className="text-gray-400 ml-2">{rec.impact}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Timeline:</span>
                    <span className="text-gray-400 ml-2">{rec.timeline}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">
                      Investment:
                    </span>
                    <span className="text-gray-400 ml-2">{rec.investment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Comparison */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Industry Benchmark Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-300">
                    Industry
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">
                    Circularity Rate
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">
                    Our Performance
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  environmentalReports.circularityMetrics.industryComparison
                ).map(([industry, rate]) => (
                  <tr key={industry} className="border-b border-gray-100">
                    <td className="py-3 px-4 capitalize">{industry}</td>
                    <td className="py-3 px-4">{rate}%</td>
                    <td className="py-3 px-4 font-medium text-white">
                      {environmentalReports.circularityMetrics.overall}%
                    </td>
                    <td className="py-3 px-4">
                      {environmentalReports.circularityMetrics.overall >
                      rate ? (
                        <span className="text-green-600 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Above Average
                        </span>
                      ) : (
                        <span className="text-orange-600 flex items-center">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          Below Average
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
