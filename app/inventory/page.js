// app/inventory/page.js (Updated and Final)
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

// Import our new components
import InventoryHeader from "@/app/components/inventory/InventoryHeader";
import InventoryFilters from "@/app/components/inventory/InventoryFilters";
import InventoryTable from "@/app/components/inventory/InventoryTable";
import TraceabilityModal from "@/app/components/inventory/TraceabilityModal";
import AddMaterialModal from "@/app/components/inventory/AddMaterialModal";

export default function InventoryPage() {
  const { isAdmin } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    types: [],
    forms: [],
    sources: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: "", type: "", status: "" });
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showTraceabilityModal, setShowTraceabilityModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch("/api/materials");
        if (!response.ok) throw new Error("Data could not be fetched.");
        const data = await response.json();
        setMaterials(data.inventory);
        setDropdownData({
          types: data.types,
          forms: data.forms,
          sources: data.sources,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventoryData();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const filteredMaterials = materials.filter((material) => {
    const searchLower = filters.search.toLowerCase();
    return (
      (filters.type === "" || material.type === filters.type) &&
      (filters.status === "" || material.status === filters.status) &&
      (searchLower === "" ||
        material.id.toLowerCase().includes(searchLower) ||
        material.type.toLowerCase().includes(searchLower) ||
        material.traceability.supplier.name
          .toLowerCase()
          .includes(searchLower) || // Search by supplier
        material.grade.toLowerCase().includes(searchLower)) // Search by grade
    );
  });

  const handleAddMaterial = async (materialData) => {
    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materialData),
      });
      if (!response.ok) throw new Error("Failed to add material.");
      const addedMaterial = await response.json();
      setMaterials([...materials, addedMaterial]);
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding material:", err);
      alert("Error adding material. Please check the console.");
    }
  };

  const exportData = () => {
    const csvContent = [
      [
        "ID",
        "Type",
        "Form",
        "Grade",
        "Source Category",
        "Supplier",
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
        m.traceability.supplier.name,
        m.quantity,
        m.unit,
        m.status,
        m.lastUpdated,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading Inventory...
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
        <InventoryHeader
          isAdmin={isAdmin}
          onAdd={() => setShowAddModal(true)}
          onExport={exportData}
        />
        <InventoryFilters
          searchTerm={filters.search}
          filterType={filters.type}
          filterStatus={filters.status}
          onFilterChange={handleFilterChange}
          materialTypes={dropdownData.types}
          resultCount={filteredMaterials.length}
          totalCount={materials.length}
        />
        <InventoryTable
          materials={filteredMaterials}
          onViewTraceability={(material) => {
            setSelectedMaterial(material);
            setShowTraceabilityModal(true);
          }}
        />

        {showTraceabilityModal && selectedMaterial && (
          <TraceabilityModal
            material={selectedMaterial}
            onClose={() => setShowTraceabilityModal(false)}
          />
        )}

        <AddMaterialModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddMaterial={handleAddMaterial}
          dropdownData={dropdownData}
        />
      </div>
    </div>
  );
}
