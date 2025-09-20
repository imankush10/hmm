// components/reports/IndustryComparison.js (New File)
"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function IndustryComparison({ data }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Industry Benchmark Comparison
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-400 uppercase">
                Industry
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-400 uppercase">
                Avg. Circularity Rate
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-400 uppercase">
                Our Performance
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-400 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.industryComparison).map(([industry, rate]) => (
              <tr
                key={industry}
                className="border-b border-gray-700 last:border-b-0"
              >
                <td className="py-3 px-4 capitalize text-white">{industry}</td>
                <td className="py-3 px-4 text-gray-300">{rate}%</td>
                <td className="py-3 px-4 font-medium text-white">
                  {data.overall}%
                </td>
                <td className="py-3 px-4">
                  {data.overall > rate ? (
                    <span className="text-green-400 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" /> Above Average
                    </span>
                  ) : (
                    <span className="text-orange-400 flex items-center">
                      <TrendingDown className="w-4 h-4 mr-1" /> Below Average
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
