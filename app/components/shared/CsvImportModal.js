"use client";

import { useState } from "react";
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

export default function CsvImportModal({
  isOpen,
  onClose,
  onImportSuccess,
  importEndpoint,
  title = "Import CSV",
  sampleData = [],
  expectedColumns = [],
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadResult({
        success: false,
        error: "Please select a CSV file",
      });
      return;
    }
    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(importEndpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      // Ensure details is properly formatted for display
      if (result.details && Array.isArray(result.details)) {
        // Keep the array as is for proper error display
        setUploadResult(result);
      } else if (result.details && typeof result.details === "object") {
        // Convert object to string
        setUploadResult({
          ...result,
          details: JSON.stringify(result.details, null, 2),
        });
      } else {
        setUploadResult(result);
      }

      if (result.success) {
        setTimeout(() => {
          onImportSuccess?.(result);
          onClose();
        }, 2000);
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: "Upload failed. Please try again.",
        details: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleCsv = () => {
    if (sampleData.length === 0) return;

    const headers = Object.keys(sampleData[0]).join(",");
    const rows = sampleData.map((row) =>
      Object.values(row)
        .map((value) =>
          typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value
        )
        .join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, "_")}_sample.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setIsUploading(false);
    setDragActive(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Upload a CSV file with the required columns</li>
              <li>• Make sure your CSV includes headers</li>
              <li>• Download the sample CSV for reference</li>
              <li>• Duplicate IDs will be rejected</li>
            </ul>
          </div>

          {/* Expected Columns */}
          {expectedColumns.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">
                Required Columns:
              </h3>
              <div className="flex flex-wrap gap-2">
                {expectedColumns.map((col, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sample CSV Download */}
          {sampleData.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={downloadSampleCsv}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                Download Sample CSV
              </button>
            </div>
          )}

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            {selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <FileText size={20} />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Drag and drop your CSV file here
                </p>
                <p className="text-gray-500">or</p>
                <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div
              className={`border rounded-lg p-4 ${
                uploadResult.success
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-2">
                {uploadResult.success ? (
                  <CheckCircle
                    size={20}
                    className="text-green-600 mt-0.5 flex-shrink-0"
                  />
                ) : (
                  <AlertCircle
                    size={20}
                    className="text-red-600 mt-0.5 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      uploadResult.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {uploadResult.success ? "Success!" : "Error"}
                  </p>
                  <p
                    className={`text-sm ${
                      uploadResult.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {uploadResult.message || uploadResult.error}
                  </p>
                  {uploadResult.details && (
                    <div className="text-xs text-gray-600 mt-1">
                      {Array.isArray(uploadResult.details) ? (
                        <div>
                          <p className="font-medium mb-1">
                            CSV Parsing Errors:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {uploadResult.details
                              .slice(0, 5)
                              .map((error, index) => (
                                <li
                                  key={`error-${index}-${
                                    error.row || "unknown"
                                  }-${error.type || "default"}`}
                                >
                                  Row {error.row}: {error.message}
                                </li>
                              ))}
                            {uploadResult.details.length > 5 && (
                              <li key="more-errors">
                                ... and {uploadResult.details.length - 5} more
                                errors
                              </li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <p>{String(uploadResult.details)}</p>
                      )}
                    </div>
                  )}
                  {uploadResult.success && uploadResult.imported && (
                    <p className="text-sm text-green-700 mt-1">
                      Imported {uploadResult.imported} items successfully
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || uploadResult?.success}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isUploading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isUploading ? "Uploading..." : "Upload CSV"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
