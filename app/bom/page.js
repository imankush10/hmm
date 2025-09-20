// app/bom/page.js (Updated and Final)
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Plus, Shield, Lock } from "lucide-react";

// Import our new components
import BomCard from "@/app/components/bom/BomCard";
import BomForm from "@/app/components/bom/BomForm";
import BomViewModal from "@/app/components/bom/BomViewModal";

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
  const [boms, setBoms] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    criticalityLevels: [],
    units: [],
    materialTypes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBom, setEditingBom] = useState(null);
  const [viewingBom, setViewingBom] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/boms");
        if (!response.ok) throw new Error("Failed to fetch data.");
        const data = await response.json();
        setBoms(data.boms);
        setDropdownData({
          criticalityLevels: data.criticalityLevels,
          units: data.units,
          materialTypes: data.materialTypes,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Form handlers ---
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

  const resetAndCloseForm = () => {
    setFormData(initialFormData);
    setShowForm(false);
    setEditingBom(null);
  };

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
    const apiEndpoint = "/api/boms";
    const method = editingBom ? "PUT" : "POST";
    const body = editingBom
      ? JSON.stringify({ ...bomData, _id: editingBom._id })
      : JSON.stringify(bomData);

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!response.ok)
        throw new Error(`Failed to ${editingBom ? "update" : "create"} BOM.`);
      const result = await response.json();

      if (editingBom) {
        setBoms(boms.map((bom) => (bom._id === result._id ? result : bom)));
      } else {
        setBoms([...boms, result]);
      }
      resetAndCloseForm();
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
        ...comp,
        requiredProperties:
          comp.requiredProperties && comp.requiredProperties.length > 0
            ? comp.requiredProperties
            : [""],
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

  const exportBom = (bom) => {
    const blob = new Blob(
      [
        JSON.stringify(
          { ...bom, exportDate: new Date().toISOString() },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${bom.productName.replace(/\s+/g, "-")}-BOM.json`;
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
  };

  // --- Render Logic ---
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading BOMs...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
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
            {isAdmin && !showForm && (
              <button
                onClick={() => {
                  setEditingBom(null);
                  setFormData(initialFormData);
                  setShowForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create New BOM
              </button>
            )}
          </div>
        </div>

        {showForm ? (
          <BomForm
            formData={formData}
            onInputChange={handleInputChange}
            onComponentChange={handleComponentChange}
            onPropertyChange={handlePropertyChange}
            onAddComponent={addComponent}
            onRemoveComponent={removeComponent}
            onAddProperty={addProperty}
            onRemoveProperty={removeProperty}
            onSubmit={handleSubmit}
            onCancel={resetAndCloseForm}
            editingBom={editingBom}
            dropdownData={dropdownData}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boms.map((bom) => (
              <BomCard
                key={bom._id}
                bom={bom}
                onEdit={handleEdit}
                onView={setViewingBom}
                onDelete={handleDelete}
                onExport={exportBom}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}

        {viewingBom && (
          <BomViewModal
            bom={viewingBom}
            onClose={() => setViewingBom(null)}
            onExport={exportBom}
          />
        )}
      </div>
    </div>
  );
}
