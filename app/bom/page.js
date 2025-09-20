"use client";

import { useState, useEffect } from "react";
import {
  cn,
  formatCurrency,
  formatDate,
  getCriticalityColor,
} from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import {
  Plus,
  Trash2,
  Save,
  Download,
  Edit,
  Eye,
  Shield,
  Lock,
} from "lucide-react";

const initialFormData = {
  productName: "",
  description: "",
  criticalityLevel: "Medium",
  components: [
    {
      name: "",
      materialType: "",
      materialGrade: "",
      requiredQuantity: "",
      unit: "kg",
      requiredProperties: [""],
    },
  ],
  estimatedCost: "",
  currency: "INR",
};

export default function BOMPage() {
  const { isAdmin } = useAuth();

  // State for data, loading, and errors
  const [boms, setBoms] = useState([]);
  const [criticalityLevels, setCriticalityLevels] = useState([]);
  const [units, setUnits] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI controls
  const [showForm, setShowForm] = useState(false);
  const [editingBom, setEditingBom] = useState(null);
  const [viewingBom, setViewingBom] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // Fetch initial data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/boms");
        if (!response.ok) throw new Error("Failed to fetch data.");
        const data = await response.json();
        setBoms(data.boms);
        setCriticalityLevels(data.criticalityLevels);
        setUnits(data.units);
        setMaterialTypes(data.materialTypes);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Form handlers (no changes needed in these) ---
  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));
  const handleComponentChange = (index, field, value) =>
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  const handlePropertyChange = (compIndex, propIndex, value) =>
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((c, i) =>
        i === compIndex
          ? {
              ...c,
              requiredProperties: c.requiredProperties.map((p, j) =>
                j === propIndex ? value : p
              ),
            }
          : c
      ),
    }));
  const addComponent = () =>
    setFormData((prev) => ({
      ...prev,
      components: [...prev.components, initialFormData.components[0]],
    }));
  const removeComponent = (index) =>
    setFormData((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }));
  const addProperty = (compIndex) =>
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((c, i) =>
        i === compIndex
          ? { ...c, requiredProperties: [...c.requiredProperties, ""] }
          : c
      ),
    }));
  const removeProperty = (compIndex, propIndex) =>
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((c, i) =>
        i === compIndex
          ? {
              ...c,
              requiredProperties: c.requiredProperties.filter(
                (_, j) => j !== propIndex
              ),
            }
          : c
      ),
    }));
  const resetForm = () => setFormData(initialFormData);

  // --- CRUD Operations ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bomData = {
      ...formData,
      components: formData.components.map((comp) => ({
        ...comp,
        requiredProperties: comp.requiredProperties.filter(
          (prop) => prop.trim() !== ""
        ),
      })),
    };

    try {
      if (editingBom) {
        // UPDATE
        const response = await fetch("/api/boms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...bomData, _id: editingBom._id }),
        });
        if (!response.ok) throw new Error("Failed to update BOM.");
        const updatedBom = await response.json();
        setBoms(
          boms.map((bom) => (bom._id === updatedBom._id ? updatedBom : bom))
        );
      } else {
        // CREATE
        const response = await fetch("/api/boms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bomData),
        });
        if (!response.ok) throw new Error("Failed to create BOM.");
        const newBom = await response.json();
        setBoms([...boms, newBom]);
      }
      resetForm();
      setShowForm(false);
      setEditingBom(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleEdit = (bom) => {
    setEditingBom(bom);
    setFormData({
      productName: bom.productName,
      description: bom.description,
      criticalityLevel: bom.criticalityLevel,
      components: bom.components.map((comp) => ({
        name: comp.name,
        materialType: comp.materialType,
        materialGrade: comp.materialGrade,
        requiredQuantity: comp.requiredQuantity,
        unit: comp.unit,
        requiredProperties:
          comp.requiredProperties.length > 0 ? comp.requiredProperties : [""],
      })),
      estimatedCost: bom.estimatedCost,
      currency: bom.currency,
    });
    setShowForm(true);
  };

  const handleDelete = async (bomId) => {
    if (confirm("Are you sure you want to delete this BOM?")) {
      try {
        const response = await fetch(`/api/boms?id=${bomId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete BOM.");
        setBoms(boms.filter((bom) => bom._id !== bomId));
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
  };

  // --- Other UI Functions ---

  const exportBom = (bom) => {
    // This client-side function remains unchanged
    const bomData = { ...bom, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(bomData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${bom.productName.replace(/\s+/g, "-")}-BOM.json`;
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading BOMs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bill of Materials (BOM)
              </h1>
              <p className="text-gray-400 mt-2">
                Manage product requirements and material specifications
              </p>
            </div>
            {isAdmin ? (
              <button
                onClick={() => {
                  resetForm();
                  setEditingBom(null);
                  setShowForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create New BOM
              </button>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-5 h-5" />
                <Lock className="w-4 h-4" />
                <span className="text-sm">Admin access required</span>
              </div>
            )}
          </div>
        </div>

        {/* BOM List */}
        {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boms.map((bom) => (
              <div
                key={bom._id}
                className="bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {bom.productName}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{bom._id}</p>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-semibold rounded-full",
                      getCriticalityColor(bom.criticalityLevel)
                    )}
                  >
                    {bom.criticalityLevel}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {bom.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Components:</span>
                    <span className="font-medium text-white">
                      {bom.components.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Est. Cost:</span>
                    <span className="font-medium text-white">
                      {formatCurrency(bom.estimatedCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Created:</span>
                    <span className="font-medium text-white">
                      {formatDate(bom.createdDate)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewingBom(bom)}
                    className="flex-1 bg-gray-100 text-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => handleEdit(bom)}
                        className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => exportBom(bom)}
                        className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bom._id)}
                        className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center gap-1 text-gray-500 text-xs">
                      <Lock className="w-3 h-3" /> Admin Only
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOM Form */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingBom ? "Edit BOM" : "Create New BOM"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingBom(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-400 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) =>
                      handleInputChange("productName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Criticality Level *
                  </label>
                  <select
                    value={formData.criticalityLevel}
                    onChange={(e) =>
                      handleInputChange("criticalityLevel", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
                  >
                    {criticalityLevels.map((level) => (
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
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
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
                    onChange={(e) =>
                      handleInputChange("estimatedCost", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              {/* Components */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Components
                  </h3>
                  <button
                    type="button"
                    onClick={addComponent}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Component
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.components.map((component, compIndex) => (
                    <div
                      key={compIndex}
                      className="border border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-white">
                          Component {compIndex + 1}
                        </h4>
                        {formData.components.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeComponent(compIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Component Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={component.name}
                            onChange={(e) =>
                              handleComponentChange(
                                compIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Material Type *
                          </label>
                          <select
                            required
                            value={component.materialType}
                            onChange={(e) =>
                              handleComponentChange(
                                compIndex,
                                "materialType",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Material</option>
                            {materialTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Material Grade
                          </label>
                          <input
                            type="text"
                            value={component.materialGrade}
                            onChange={(e) =>
                              handleComponentChange(
                                compIndex,
                                "materialGrade",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Quantity *
                            </label>
                            <input
                              type="number"
                              required
                              value={component.requiredQuantity}
                              onChange={(e) =>
                                handleComponentChange(
                                  compIndex,
                                  "requiredQuantity",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Unit
                            </label>
                            <select
                              value={component.unit}
                              onChange={(e) =>
                                handleComponentChange(
                                  compIndex,
                                  "unit",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {units.map((unit) => (
                                <option key={unit} value={unit}>
                                  {unit}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Required Properties */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Required Properties
                          </label>
                          <button
                            type="button"
                            onClick={() => addProperty(compIndex)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            + Add Property
                          </button>
                        </div>
                        <div className="space-y-2">
                          {component.requiredProperties.map(
                            (property, propIndex) => (
                              <div key={propIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={property}
                                  onChange={(e) =>
                                    handlePropertyChange(
                                      compIndex,
                                      propIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g., Tensile strength > 250 MPa"
                                  className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {component.requiredProperties.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeProperty(compIndex, propIndex)
                                    }
                                    className="text-red-600 hover:text-red-800 px-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingBom ? "Update BOM" : "Save BOM"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBom(null);
                    resetForm();
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View BOM Modal */}
        {viewingBom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-90vh overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    {viewingBom.productName}
                  </h2>
                  <button
                    onClick={() => setViewingBom(null)}
                    className="text-gray-400 hover:text-gray-400 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-gray-400">{viewingBom._id}</span>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-semibold rounded-full",
                      getCriticalityColor(viewingBom.criticalityLevel)
                    )}
                  >
                    {viewingBom.criticalityLevel}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Description
                    </h3>
                    <p className="text-gray-300">{viewingBom.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-white">
                        Estimated Cost:{" "}
                      </span>
                      <span className="text-gray-300">
                        {formatCurrency(viewingBom.estimatedCost)}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-white">
                        Created:{" "}
                      </span>
                      <span className="text-gray-300">
                        {formatDate(viewingBom.createdDate)}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-white">
                        Components:{" "}
                      </span>
                      <span className="text-gray-300">
                        {viewingBom.components.length}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-white mb-4">Components</h3>
                <div className="space-y-4">
                  {viewingBom.components.map((component, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 rounded-lg p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <span className="font-medium text-white">
                            {component.name}
                          </span>
                          <p className="text-sm text-gray-400">
                            {component.componentId}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-300">
                            {component.materialType}
                          </span>
                          {component.materialGrade && (
                            <p className="text-sm text-gray-400">
                              {component.materialGrade}
                            </p>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-white">
                            {component.requiredQuantity} {component.unit}
                          </span>
                        </div>
                      </div>
                      {component.requiredProperties &&
                        component.requiredProperties.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-300 mb-1">
                              Required Properties:
                            </p>
                            <ul className="text-sm text-gray-400 space-y-1">
                              {component.requiredProperties.map(
                                (property, propIndex) => (
                                  <li key={propIndex}>• {property}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-700 flex justify-end gap-4">
                <button
                  onClick={() => exportBom(viewingBom)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={() => setViewingBom(null)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
