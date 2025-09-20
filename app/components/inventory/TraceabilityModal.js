// components/TraceabilityModal.js (New File)
"use client";

import { MapPin, Award, Truck, X } from "lucide-react";
import { formatDate } from "@/lib/utils"; // Make sure the path is correct
import { Shield } from "lucide-react";

// A small helper component for each section
const InfoSection = ({ icon, title, colorClass, children }) => (
  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
    <div className="flex items-center mb-3">
      {icon}
      <h3 className={`text-lg font-semibold ml-2 ${colorClass}`}>{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {children}
    </div>
  </div>
);

// A helper for key-value pairs
const InfoPair = ({ label, value, children }) => (
    <div>
        <p className="text-gray-400">{label}</p>
        {value && <p className="text-white font-medium">{value}</p>}
        {children}
    </div>
);


export default function TraceabilityModal({ material, onClose }) {
  if (!material) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-white">
              Traceability: {material.id}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {material.type} ({material.grade}) - {material.form}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <InfoSection icon={<MapPin className="w-5 h-5 text-green-400" />} title="Origin Information" colorClass="text-green-400">
            <InfoPair label="Source Location" value={material.traceability.origin.mine}>
                <p className="text-xs text-gray-500">{material.traceability.origin.coordinates}</p>
            </InfoPair>
            <InfoPair label="Certifications">
                <div className="flex flex-wrap gap-2 mt-1">
                    {material.traceability.origin.certifications.map((cert, index) => (
                        <span key={index} className="bg-gray-700 text-green-300 text-xs px-2 py-1 rounded">
                            {cert}
                        </span>
                    ))}
                </div>
            </InfoPair>
          </InfoSection>

          <InfoSection icon={<Award className="w-5 h-5 text-blue-400" />} title="Supplier Information" colorClass="text-blue-400">
            <InfoPair label="Company" value={material.traceability.supplier.name} />
            <InfoPair label="Contact" value={material.traceability.supplier.contact} />
            <InfoPair label="Rating">
                <div className="flex items-center text-white font-medium">
                    {material.traceability.supplier.rating}
                    <span className="text-yellow-400 ml-1">★</span>
                </div>
            </InfoPair>
          </InfoSection>

          <InfoSection icon={<Shield className="w-5 h-5 text-yellow-400" />} title="Batch Tracking & Quality" colorClass="text-yellow-400">
             <InfoPair label="Batch Number" value={material.traceability.batchTracking.batchNumber} />
             <InfoPair label="Production Date" value={formatDate(material.traceability.batchTracking.productionDate)} />
             <div className="md:col-span-2">
                <p className="text-gray-400 text-sm">Quality Tests</p>
                <div className="mt-2 space-y-2">
                    {material.traceability.batchTracking.qualityTests.map((test, index) => (
                        <div key={index} className="bg-gray-700/50 rounded p-2 border border-gray-600">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-white">{test.test}</span>
                                <span className="text-sm px-2 py-1 rounded bg-green-900/50 text-green-300">✓ Pass</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                                Result: <span className="font-medium text-white">{test.result}</span> (Standard: {test.standard})
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </InfoSection>

          <InfoSection icon={<Truck className="w-5 h-5 text-purple-400" />} title="Transportation" colorClass="text-purple-400">
            <InfoPair label="Route" value={material.traceability.transportation.route} />
            <InfoPair label="Carbon Footprint" value={material.traceability.transportation.carbonFootprint} />
            <InfoPair label="Transport Mode" value={material.traceability.transportation.transportMode} />
          </InfoSection>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}