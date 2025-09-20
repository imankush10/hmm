"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { formatNumber, formatCurrency, cn } from "../../lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sankey,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle,
  Droplets,
  Factory,
  Recycle,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export default function DashboardPage() {
  // State for data, loading, and errors
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedScenario, setSelectedScenario] = useState(
    "Primary vs Recycled Mix"
  );

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Data could not be fetched.");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  // Display a loading message while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  }

  // Display an error message if fetching failed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }
  
  // Destructure the fetched data for easier use
  const { kpis: dashboardKpis, scenarios: scenarioComparisons, flowData: materialFlowData } = dashboardData;


  const KPICard = ({
    title,
    value,
    unit,
    trend,
    icon: Icon,
    color,
    target,
    description,
  }) => (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center ${
              trend.startsWith("+") ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.startsWith("+") ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-bold text-white">
            {formatNumber(value)}
          </span>
          <span className="text-gray-400 ml-2">{unit}</span>
        </div>
        {target && (
          <div className="mt-2 text-sm text-gray-400">
            Target: {formatNumber(target)} {unit}
          </div>
        )}
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );

  const CircularProgressBar = ({
    percentage,
    size = 120,
    strokeWidth = 8,
    color = "#3B82F6",
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
    );
  };

  const SimpleSankeyDiagram = () => {
    const sankeyData = [
      { name: "Primary Materials", value: 200, color: "#EF4444" },
      { name: "Recycled Materials", value: 280, color: "#10B981" },
      { name: "Processing", value: 480, color: "#3B82F6" },
      { name: "Manufacturing", value: 450, color: "#8B5CF6" },
      { name: "Products", value: 420, color: "#06B6D4" },
      { name: "Waste", value: 30, color: "#F59E0B" },
    ];

    return (
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Material Flow</h3>
        <div className="space-y-4">
          {sankeyData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm font-medium text-gray-300">
                {item.name}
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className="h-6 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(item.value / 480) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-medium text-white text-right">
                {formatNumber(item.value)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">87.5%</div>
            <div className="text-sm text-gray-400">Process Efficiency</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">58.3%</div>
            <div className="text-sm text-gray-400">Recycled Content</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">6.7%</div>
            <div className="text-sm text-gray-400">Waste Rate</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">LCA Dashboard</h1>
              <p className="text-gray-400 mt-2">
                Lifecycle & Circularity Assessment Platform
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Last Updated</div>
              <div className="text-lg font-semibold text-white">
                {new Date().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Inventory Levels"
            value={dashboardKpis.inventoryLevels.available}
            unit={dashboardKpis.inventoryLevels.unit}
            trend="+5.2%"
            icon={Factory}
            color="bg-blue-600"
            target={dashboardKpis.inventoryLevels.total}
            description={`${dashboardKpis.inventoryLevels.lowStock} tons low stock`}
          />

          <KPICard
            title="Recycled Content"
            value={dashboardKpis.recycledContent.percentage}
            unit="%"
            trend={dashboardKpis.recycledContent.improvement}
            icon={Recycle}
            color="bg-green-600"
            target={dashboardKpis.recycledContent.target}
            description="Target: 75%"
          />

          <KPICard
            title="CO₂ Savings"
            value={dashboardKpis.co2Savings.amount}
            unit="kg CO₂e"
            trend={dashboardKpis.co2Savings.monthlyTrend}
            icon={TrendingDown}
            color="bg-emerald-600"
            description={dashboardKpis.co2Savings.comparedToPrimary}
          />

          <KPICard
            title="Circularity Rate"
            value={dashboardKpis.circularityRate.current}
            unit="%"
            trend={dashboardKpis.circularityRate.improvement}
            icon={CheckCircle}
            color="bg-purple-600"
            target={dashboardKpis.circularityRate.target}
            description="Towards target: 85%"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Material Flow Trends */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Material Flow Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={materialFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    formatNumber(value) + " tons",
                    name,
                  ]}
                />
                <Bar
                  dataKey="primary"
                  fill="#EF4444"
                  name="Primary Materials"
                />
                <Bar
                  dataKey="recycled"
                  fill="#10B981"
                  name="Recycled Materials"
                />
                <Line
                  type="monotone"
                  dataKey="recovered"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Recovered"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Energy & Water Usage */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Resource Usage
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <CircularProgressBar
                  percentage={
                    dashboardKpis.energyConsumption.renewablePercentage
                  }
                  color="#10B981"
                />
                <h4 className="font-semibold text-white mt-4">
                  Renewable Energy
                </h4>
                <p className="text-sm text-gray-400">
                  {formatNumber(dashboardKpis.energyConsumption.renewable)} /{" "}
                  {formatNumber(dashboardKpis.energyConsumption.total)} kWh
                </p>
              </div>
              <div className="text-center">
                <CircularProgressBar
                  percentage={dashboardKpis.waterUsage.recycledPercentage}
                  color="#06B6D4"
                />
                <h4 className="font-semibold text-white mt-4">
                  Water Recycling
                </h4>
                <p className="text-sm text-gray-400">
                  {formatNumber(dashboardKpis.waterUsage.recycled)} /{" "}
                  {formatNumber(dashboardKpis.waterUsage.total)} m³
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sankey Diagram and Scenario Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleSankeyDiagram />

          {/* Scenario Comparison */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Scenario Comparison
              </h3>
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
              >
                {Object.keys(scenarioComparisons).map((scenario) => (
                  <option key={scenario} value={scenario}>
                    {scenario}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {scenarioComparisons[selectedScenario].scenarios.map(
                (scenario, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-white mb-3">
                      {scenario.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">CO₂ Footprint:</span>
                        <span className="font-medium text-white ml-2">
                          {formatNumber(scenario.co2Footprint)} kg
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Cost:</span>
                        <span className="font-medium text-white ml-2">
                          {formatCurrency(scenario.cost)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Energy:</span>
                        <span className="font-medium text-white ml-2">
                          {formatNumber(scenario.energyUse)} kWh
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Water:</span>
                        <span className="font-medium text-white ml-2">
                          {formatNumber(scenario.waterUse)} m³
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Health */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Inventory Tracking</span>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-600 font-medium">
                    Operational
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">BOM Management</span>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-600 font-medium">
                    Operational
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">AI Optimization</span>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-600 font-medium">
                    Operational
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Report Generation</span>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-600 font-medium">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-white">New BOM Created</div>
                <div className="text-gray-400">
                  Battery Housing - 2 hours ago
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-white">Optimization Run</div>
                <div className="text-gray-400">
                  Car Door Frame - 4 hours ago
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-white">Inventory Updated</div>
                <div className="text-gray-400">
                  Aluminum stock - 6 hours ago
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-white">Report Generated</div>
                <div className="text-gray-400">
                  Q3 Sustainability - 1 day ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}