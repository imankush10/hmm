"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileJson, FileSpreadsheet, FileText, Download } from "lucide-react";
import { Button } from "./Button";

export function ExportModal({ isOpen, onClose, onExport, projectName }) {
  const exportOptions = [
    {
      type: "json",
      title: "JSON Format",
      description: "Machine-readable data structure for developers and APIs",
      icon: <FileJson className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      type: "csv",
      title: "CSV Format",
      description: "Spreadsheet-friendly format for Excel and Google Sheets",
      icon: <FileSpreadsheet className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      type: "text",
      title: "Text Report",
      description: "Human-readable summary report for printing and sharing",
      icon: <FileText className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const handleExport = (format) => {
    onExport(format);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Export Analysis
                </h2>
                <p className="text-gray-400">
                  Choose your preferred export format for "{projectName}"
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="p-6 space-y-4">
            {exportOptions.map((option, index) => (
              <motion.div
                key={option.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-r ${option.color} bg-opacity-20`}
                      >
                        <div className="text-white">{option.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {option.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleExport(option.type)}
                      className={`${option.buttonColor} text-white px-6 py-2 flex items-center gap-2 transition-all duration-200 hover:scale-105`}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800 bg-gray-800/50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Files will be downloaded automatically to your device
              </p>
              <Button variant="secondary" onClick={onClose} className="px-6">
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
