// components/bom/BomForm.js (New File)
"use client";

import { Save, Plus, Trash2, X } from "lucide-react";

export default function BomForm({
  formData,
  onInputChange,
  onComponentChange,
  onPropertyChange,
  onAddComponent,
  onRemoveComponent,
  onAddProperty,
  onRemoveProperty,
  onSubmit,
  onCancel,
  editingBom,
  dropdownData,
}) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {editingBom ? "Edit BOM" : "Create New BOM"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.productName}
              onChange={(e) => onInputChange("productName", e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Criticality Level *
            </label>
            <select
              value={formData.criticalityLevel}
              onChange={(e) =>
                onInputChange("criticalityLevel", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
            >
              {dropdownData.criticalityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estimated Cost
            </label>
            <input
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => onInputChange("estimatedCost", e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => onInputChange("currency", e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Components Section */}
        <div>
          <div className="flex justify-between items-center mb-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">Components</h3>
            <button
              type="button"
              onClick={onAddComponent}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Component
            </button>
          </div>
          <div className="space-y-6">
            {formData.components.map((component, compIndex) => (
              <div
                key={compIndex}
                className="border border-gray-700 rounded-lg p-4 bg-gray-900/50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-white">
                    Component {compIndex + 1}
                  </h4>
                  {formData.components.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveComponent(compIndex)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    required
                    value={component.name}
                    onChange={(e) =>
                      onComponentChange(compIndex, "name", e.target.value)
                    }
                    placeholder="Component Name *"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                  <select
                    required
                    value={component.materialType}
                    onChange={(e) =>
                      onComponentChange(
                        compIndex,
                        "materialType",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  >
                    <option value="">Select Material *</option>
                    {dropdownData.materialTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={component.materialGrade}
                    onChange={(e) =>
                      onComponentChange(
                        compIndex,
                        "materialGrade",
                        e.target.value
                      )
                    }
                    placeholder="Material Grade"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      required
                      value={component.requiredQuantity}
                      onChange={(e) =>
                        onComponentChange(
                          compIndex,
                          "requiredQuantity",
                          e.target.value
                        )
                      }
                      placeholder="Quantity *"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                    />
                    <select
                      value={component.unit}
                      onChange={(e) =>
                        onComponentChange(compIndex, "unit", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                    >
                      {dropdownData.units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Required Properties
                    </label>
                    <button
                      type="button"
                      onClick={() => onAddProperty(compIndex)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      + Add Property
                    </button>
                  </div>
                  <div className="space-y-2">
                    {component.requiredProperties.map((property, propIndex) => (
                      <div key={propIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={property}
                          onChange={(e) =>
                            onPropertyChange(
                              compIndex,
                              propIndex,
                              e.target.value
                            )
                          }
                          placeholder="e.g., Tensile strength > 250 MPa"
                          className="flex-1 px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700"
                        />
                        {component.requiredProperties.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              onRemoveProperty(compIndex, propIndex)
                            }
                            className="text-red-400 hover:text-red-300 px-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 pt-6 border-t border-gray-700">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />{" "}
            {editingBom ? "Update BOM" : "Save BOM"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
