// components/reports/ReportMetadata.js (New File)
"use client";

import { CheckCircle, Award } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ReportMetadata({ metadata }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">
        Report Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium text-gray-400 mb-2">Reporting Period</h3>
          <p className="text-white font-semibold">{metadata.reportingPeriod}</p>
          <p className="text-sm text-gray-500">
            Generated: {formatDate(metadata.generatedDate)}
          </p>
        </div>
        <div>
          <h3 className="font-medium text-gray-400 mb-2">
            Compliance Standards
          </h3>
          <div className="space-y-1">
            {metadata.complianceStandards.map((standard, index) => (
              <div
                key={index}
                className="text-sm text-gray-300 flex items-center"
              >
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                {standard}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-400 mb-2">Certifications</h3>
          <div className="space-y-1">
            {metadata.certifications.map((cert, index) => (
              <div
                key={index}
                className="text-sm text-gray-300 flex items-center"
              >
                <Award className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
