"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export function FullPageLoader({ progress = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Metal LCA</h1>
          <p className="text-gray-400">Analysis Platform</p>
        </motion.div>

        {/* Loading Animation */}
        <div className="mb-6">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
        </div>

        {/* Progress Bar */}
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-500 to-blue-500"
          />
        </div>

        {/* Progress Text */}
        <motion.div
          key={progress}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          className="text-white text-lg font-medium"
        >
          Loading Animation... {Math.round(progress)}%
        </motion.div>

        <p className="text-gray-500 text-sm mt-2">Preparing your experience</p>
      </div>
    </motion.div>
  );
}
