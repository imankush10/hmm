import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrency(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "available":
      return "bg-green-100 text-green-800";
    case "low stock":
      return "bg-yellow-100 text-yellow-800";
    case "out of stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getCriticalityColor(level) {
  switch (level.toLowerCase()) {
    case "low":
      return "bg-blue-100 text-blue-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "critical":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function calculateCircularityScore(data) {
  const weights = {
    recycledContent: 0.3,
    materialRecovery: 0.25,
    durability: 0.2,
    repairability: 0.15,
    endOfLife: 0.1,
  };

  return Object.entries(weights).reduce((score, [key, weight]) => {
    return score + (data[key] || 0) * weight;
  }, 0);
}

export function generateOptimizationId() {
  return `OPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function downloadAsJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
