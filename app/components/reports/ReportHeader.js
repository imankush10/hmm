// components/reports/ReportHeader.js (New File)
"use client";

import { Download, FileText } from "lucide-react";

export default function ReportHeader({
  onExport,
  onGeneratePDF,
  isGeneratingPDF,
}) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Environmental & Circularity Report
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive sustainability assessment and compliance reporting.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onExport("json")}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button
            onClick={onGeneratePDF}
            disabled={isGeneratingPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />{" "}
            {isGeneratingPDF ? "Generating..." : "Export PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
