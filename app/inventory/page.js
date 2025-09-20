"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { cn, formatNumber, formatDate, getStatusColor } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import {
  Search,
  Filter,
  Eye,
  Download,
  MapPin,
  Plus,
  Shield,
  Truck,
  Award,
  X,
  Save,
} from "lucide-react";

export default function InventoryPage() {
  const { isAdmin } = useAuth();

  // State for data, loading, and errors
  const [materials, setMaterials] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [materialForms, setMaterialForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Existing state for UI controls
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showTraceabilityModal, setShowTraceabilityModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Material Form State (no changes here)
  const [newMaterial, setNewMaterial] = useState({
    type: "",
    form: "",
    grade: "",
    source: "",
    quantity: "",
    unit: "tons",
    supplierName: "",
    supplierContact: "",
    certifications: "",
    carbonFootprint: "",
    transportMode: "",
    origin: "",
    coordinates: "",
  });

  // Fetch initial data when the component mounts
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch("/api/materials");
        if (!response.ok) {
          throw new Error("Data could not be fetched.");
        }
        const data = await response.json();
        setMaterials(data.inventory);
        setMaterialTypes(data.types);
        setMaterialForms(data.forms);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, []); // Empty dependency array means this runs once on mount

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || material.type === filterType;
    const matchesStatus = !filterStatus || material.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleTraceabilityView = (material) => {
    setSelectedMaterial(material);
    setShowTraceabilityModal(true);
  };

  // MODIFIED: handleAddMaterial now posts to the API
  const handleAddMaterial = async () => {
    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMaterial),
      });

      if (!response.ok) {
        throw new Error("Failed to add material.");
      }

      const addedMaterial = await response.json();

      // Add the new material returned from the API to the local state
      setMaterials([...materials, addedMaterial]);

      // Reset form and close modal
      setNewMaterial({
        type: "",
        form: "",
        grade: "",
        source: "",
        quantity: "",
        unit: "tons",
        supplierName: "",
        supplierContact: "",
        certifications: "",
        carbonFootprint: "",
        transportMode: "",
        origin: "",
        coordinates: "",
      });
      setShowAddModal(false);
    } catch (err) {
      // You can implement more robust error handling here, like a toast notification
      console.error("Error adding material:", err);
      alert("Error adding material. Please check the console.");
    }
  };

  const handleInputChange = (field, value) => {
    setNewMaterial((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // exportData and other UI functions remain the same
  const exportData = () => {
    const csvContent = [
      [
        "ID",
        "Type",
        "Form",
        "Grade",
        "Source",
        "Quantity",
        "Unit",
        "Status",
        "Last Updated",
      ],
      ...filteredMaterials.map((m) => [
        m.id,
        m.type,
        m.form,
        m.grade,
        m.source,
        m.quantity,
        m.unit,
        m.status,
        m.lastUpdated,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory-export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading Inventory...
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
                Material Inventory
              </h1>
              <p className="text-gray-400 mt-2">
                Track and manage your material resources with full traceability
              </p>
            </div>
            <div className="flex gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Material
                  <Shield className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={exportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
            >
              <option value="">All Types</option>
              {materialTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <div className="flex items-center justify-center text-sm text-gray-400 bg-gray-900 rounded-lg px-4 py-2">
              <Filter className="w-4 h-4 mr-2" />
              {filteredMaterials.length} of {materials.length} materials
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-white">
                        {material.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {material.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {material.grade}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-white">
                        {material.form}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-white max-w-48 truncate"
                        title={material.source}
                      >
                        {material.source}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {formatNumber(material.quantity)} {material.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                          getStatusColor(material.status)
                        )}
                      >
                        {material.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {formatDate(material.lastUpdated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTraceabilityView(material)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                        title="View Traceability"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traceability Modal */}
        {showTraceabilityModal && selectedMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-90vh overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    Material Traceability - {selectedMaterial.id}
                  </h2>
                  <button
                    onClick={() => setShowTraceabilityModal(false)}
                    className="text-gray-400 hover:text-gray-400 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-400 mt-2">
                  {selectedMaterial.type} ({selectedMaterial.grade}) -{" "}
                  {selectedMaterial.form}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Origin Information */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <MapPin className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-green-800">
                      Origin Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Source Location
                      </p>
                      <p className="text-white">
                        {selectedMaterial.traceability.origin.mine}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedMaterial.traceability.origin.coordinates}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Certifications
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedMaterial.traceability.origin.certifications.map(
                          (cert, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                            >
                              {cert}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supplier Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Award className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-blue-800">
                      Supplier Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Company
                      </p>
                      <p className="text-white">
                        {selectedMaterial.traceability.supplier.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Contact
                      </p>
                      <p className="text-white">
                        {selectedMaterial.traceability.supplier.contact}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Rating
                      </p>
                      <div className="flex items-center">
                        <span className="text-white font-medium">
                          {selectedMaterial.traceability.supplier.rating}
                        </span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Batch Tracking */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                    Batch Tracking
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Batch Number
                      </p>
                      <p className="text-white font-mono">
                        {
                          selectedMaterial.traceability.batchTracking
                            .batchNumber
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Production Date
                      </p>
                      <p className="text-white">
                        {formatDate(
                          selectedMaterial.traceability.batchTracking
                            .productionDate
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-2">
                      Quality Tests
                    </p>
                    <div className="space-y-2">
                      {selectedMaterial.traceability.batchTracking.qualityTests.map(
                        (test, index) => (
                          <div
                            key={index}
                            className="bg-gray-800 rounded p-3 border border-yellow-200"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-white">
                                {test.test}
                              </span>
                              <span
                                className={cn(
                                  "text-sm px-2 py-1 rounded",
                                  "bg-green-100 text-green-800"
                                )}
                              >
                                ✓ Pass
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              Result:{" "}
                              <span className="font-medium text-white">
                                {test.result}
                              </span>{" "}
                              (Standard: {test.standard})
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Transportation */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Truck className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-purple-800">
                      Transportation
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-300">Route</p>
                      <p className="text-white">
                        {selectedMaterial.traceability.transportation.route}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Carbon Footprint
                      </p>
                      <p className="text-white">
                        {
                          selectedMaterial.traceability.transportation
                            .carbonFootprint
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Transport Mode
                      </p>
                      <p className="text-white">
                        {
                          selectedMaterial.traceability.transportation
                            .transportMode
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowTraceabilityModal(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Material Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  Add New Material
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddMaterial();
                  }}
                  className="space-y-6"
                >
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Material Type *
                        </label>
                        <select
                          value={newMaterial.type}
                          onChange={(e) =>
                            handleInputChange("type", e.target.value)
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        >
                          <option value="">Select type...</option>
                          {materialTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Form *
                        </label>
                        <select
                          value={newMaterial.form}
                          onChange={(e) =>
                            handleInputChange("form", e.target.value)
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        >
                          <option value="">Select form...</option>
                          {materialForms.map((form) => (
                            <option key={form} value={form}>
                              {form}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Grade *
                        </label>
                        <input
                          type="text"
                          value={newMaterial.grade}
                          onChange={(e) =>
                            handleInputChange("grade", e.target.value)
                          }
                          required
                          placeholder="e.g., AA 6016"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Source *
                        </label>
                        <input
                          type="text"
                          value={newMaterial.source}
                          onChange={(e) =>
                            handleInputChange("source", e.target.value)
                          }
                          required
                          placeholder="e.g., Bauxite Mine - Odisha"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Unit *
                        </label>
                        <select
                          value={newMaterial.unit}
                          onChange={(e) =>
                            handleInputChange("unit", e.target.value)
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        >
                          <option value="tons">Tons</option>
                          <option value="kg">Kilograms</option>
                          <option value="m²">Square Meters</option>
                          <option value="m³">Cubic Meters</option>
                          <option value="pieces">Pieces</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Supplier Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Supplier Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Supplier Name *
                        </label>
                        <input
                          type="text"
                          value={newMaterial.supplierName}
                          onChange={(e) =>
                            handleInputChange("supplierName", e.target.value)
                          }
                          required
                          placeholder="e.g., Vedanta Limited"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Supplier Contact
                        </label>
                        <input
                          type="email"
                          value={newMaterial.supplierContact}
                          onChange={(e) =>
                            handleInputChange("supplierContact", e.target.value)
                          }
                          placeholder="supplier@company.com"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Traceability Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Traceability Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Origin/Mine
                        </label>
                        <input
                          type="text"
                          value={newMaterial.origin}
                          onChange={(e) =>
                            handleInputChange("origin", e.target.value)
                          }
                          placeholder="e.g., Bauxite Mine - Odisha"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Coordinates
                        </label>
                        <input
                          type="text"
                          value={newMaterial.coordinates}
                          onChange={(e) =>
                            handleInputChange("coordinates", e.target.value)
                          }
                          placeholder="e.g., 20.9517°N, 85.0985°E"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Certifications
                        </label>
                        <input
                          type="text"
                          value={newMaterial.certifications}
                          onChange={(e) =>
                            handleInputChange("certifications", e.target.value)
                          }
                          placeholder="e.g., ISO 14001, FSC Certified (comma separated)"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Transport Mode
                        </label>
                        <input
                          type="text"
                          value={newMaterial.transportMode}
                          onChange={(e) =>
                            handleInputChange("transportMode", e.target.value)
                          }
                          placeholder="e.g., Rail + Road"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Carbon Footprint
                        </label>
                        <input
                          type="text"
                          value={newMaterial.carbonFootprint}
                          onChange={(e) =>
                            handleInputChange("carbonFootprint", e.target.value)
                          }
                          placeholder="e.g., 2.3 kg CO2/ton"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Add Material
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
