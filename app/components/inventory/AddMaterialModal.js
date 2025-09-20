// components/AddMaterialModal.js (New File)
"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";

// The new, nested initial state for the form
const getInitialState = () => ({
  type: "",
  form: "",
  grade: "",
  source: "", // This will be 'Primary' or 'Recycled'
  quantity: "",
  unit: "tons",
  traceability: {
    origin: {
      mine: "", // This is the specific location name
      coordinates: "",
      certifications: "", // Stays as a comma-separated string for the input
    },
    supplier: {
      name: "",
      contact: "",
    },
    transportation: {
      route: "",
      carbonFootprint: "",
      transportMode: "",
    },
  },
});

export default function AddMaterialModal({
  isOpen,
  onClose,
  onAddMaterial,
  dropdownData,
}) {
  const [newMaterial, setNewMaterial] = useState(getInitialState());

  if (!isOpen) return null;

  // This function now handles nested state updates using dot notation
  const handleInputChange = (path, value) => {
    setNewMaterial((prev) => {
      const keys = path.split(".");
      const newState = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid mutation
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMaterial(newMaterial);
    setNewMaterial(getInitialState()); // Reset form after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-white">Add New Material</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- Basic Information --- */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Material Type *
                  </label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  >
                    <option value="">Select type...</option>
                    {dropdownData.types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Form */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Form *
                  </label>
                  <select
                    value={newMaterial.form}
                    onChange={(e) => handleInputChange("form", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  >
                    <option value="">Select form...</option>
                    {dropdownData.forms.map((form) => (
                      <option key={form} value={form}>
                        {form}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Grade *
                  </label>
                  <input
                    type="text"
                    value={newMaterial.grade}
                    onChange={(e) => handleInputChange("grade", e.target.value)}
                    required
                    placeholder="e.g., AA 6016"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                </div>
                {/* Source Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Source Category *
                  </label>
                  <select
                    value={newMaterial.source}
                    onChange={(e) =>
                      handleInputChange("source", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  >
                    <option value="">Select category...</option>
                    {dropdownData.sources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Quantity & Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={newMaterial.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Unit *
                  </label>
                  <select
                    value={newMaterial.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  >
                    <option value="tons">Tons</option>
                    <option value="kg">Kilograms</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --- Supplier Information --- */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                Supplier Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    value={newMaterial.traceability.supplier.name}
                    onChange={(e) =>
                      handleInputChange(
                        "traceability.supplier.name",
                        e.target.value
                      )
                    }
                    required
                    placeholder="e.g., Tata Steel Ltd."
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Supplier Contact
                  </label>
                  <input
                    type="email"
                    value={newMaterial.traceability.supplier.contact}
                    onChange={(e) =>
                      handleInputChange(
                        "traceability.supplier.contact",
                        e.target.value
                      )
                    }
                    placeholder="contact@supplier.co.in"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* --- Origin Information --- */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                Origin & Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Source Location *
                  </label>
                  <input
                    type="text"
                    value={newMaterial.traceability.origin.mine}
                    onChange={(e) =>
                      handleInputChange(
                        "traceability.origin.mine",
                        e.target.value
                      )
                    }
                    required
                    placeholder="e.g., Bhilai Steel Plant, SAIL"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Coordinates
                  </label>
                  <input
                    type="text"
                    value={newMaterial.traceability.origin.coordinates}
                    onChange={(e) =>
                      handleInputChange(
                        "traceability.origin.coordinates",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 21.1818° N, 81.3533° E"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Certifications
                  </label>
                  <input
                    type="text"
                    value={newMaterial.traceability.origin.certifications}
                    onChange={(e) =>
                      handleInputChange(
                        "traceability.origin.certifications",
                        e.target.value
                      )
                    }
                    placeholder="Comma-separated, e.g., ISO 9001, BIS IS 2062"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* --- Transportation --- */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                Transportation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Route
                  </label>
                  <input
                    type="text"
                    value={newMaterial.traceability.transportation.route}
                    onChange={(e) =>
                      handleInputChange(
                        "traceability.transportation.route",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Bhilai -> Nagpur"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Transport Mode
                  </label>
                  <input
                    type="text"
                    value={
                      newMaterial.traceability.transportation.transportMode
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "traceability.transportation.transportMode",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Rail"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Carbon Footprint
                  </label>
                  <input
                    type="text"
                    value={
                      newMaterial.traceability.transportation.carbonFootprint
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "traceability.transportation.carbonFootprint",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 0.5 kg CO2/km"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Add Material</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
