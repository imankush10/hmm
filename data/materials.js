export const materialsInventory = [
  {
    id: "MAT-001",
    type: "Aluminum",
    form: "Ingot",
    grade: "AA 6016",
    source: "Bauxite Mine - Odisha",
    quantity: 200,
    unit: "tons",
    status: "Available",
    lastUpdated: "2025-09-18",
    traceability: {
      origin: {
        mine: "Bauxite Mine - Odisha",
        coordinates: "20.9517°N, 85.0985°E",
        certifications: ["ISO 14001", "FSC Certified"],
      },
      supplier: {
        name: "Vedanta Limited",
        contact: "supply@vedanta.com",
        rating: 4.5,
      },
      batchTracking: {
        batchNumber: "VED-2025-001",
        productionDate: "2025-09-10",
        qualityTests: [
          { test: "Purity", result: "99.7%", standard: ">99.5%" },
          { test: "Tensile Strength", result: "270 MPa", standard: ">250 MPa" },
        ],
      },
      transportation: {
        route: "Odisha → Mumbai Port → Delhi Factory",
        carbonFootprint: "2.3 kg CO2/ton",
        transportMode: "Rail + Road",
      },
    },
  },
  {
    id: "MAT-002",
    type: "Copper",
    form: "Scrap",
    grade: "Recycled",
    source: "Delhi Scrap Yard",
    quantity: 50,
    unit: "tons",
    status: "Available",
    lastUpdated: "2025-09-19",
    traceability: {
      origin: {
        mine: "Recycled Urban Waste",
        coordinates: "28.7041°N, 77.1025°E",
        certifications: ["R2 Responsible Recycling", "ISO 14001"],
      },
      supplier: {
        name: "Green Metal Recyclers",
        contact: "info@greenmetals.in",
        rating: 4.2,
      },
      batchTracking: {
        batchNumber: "GMR-2025-042",
        productionDate: "2025-09-15",
        qualityTests: [
          { test: "Purity", result: "98.5%", standard: ">98%" },
          { test: "Contamination", result: "0.3%", standard: "<0.5%" },
        ],
      },
      transportation: {
        route: "Delhi Scrap Yard → Processing Plant → Storage",
        carbonFootprint: "0.8 kg CO2/ton",
        transportMode: "Road",
      },
    },
  },
  {
    id: "MAT-003",
    type: "Steel",
    form: "Sheet",
    grade: "AISI 304",
    source: "Tata Steel - Jamshedpur",
    quantity: 150,
    unit: "tons",
    status: "Available",
    lastUpdated: "2025-09-17",
    traceability: {
      origin: {
        mine: "Iron Ore Mine - Jharkhand",
        coordinates: "22.8046°N, 86.2029°E",
        certifications: ["ISO 9001", "ISO 14001", "OHSAS 18001"],
      },
      supplier: {
        name: "Tata Steel Limited",
        contact: "procurement@tatasteel.com",
        rating: 4.8,
      },
      batchTracking: {
        batchNumber: "TS-304-2025-089",
        productionDate: "2025-09-12",
        qualityTests: [
          { test: "Yield Strength", result: "280 MPa", standard: ">270 MPa" },
          {
            test: "Corrosion Resistance",
            result: "Excellent",
            standard: "Good+",
          },
        ],
      },
      transportation: {
        route: "Jamshedpur → Highway → Distribution Center",
        carbonFootprint: "1.8 kg CO2/ton",
        transportMode: "Road",
      },
    },
  },
  {
    id: "MAT-004",
    type: "Plastic",
    form: "Pellets",
    grade: "HDPE",
    source: "Reliance Industries - Hazira",
    quantity: 75,
    unit: "tons",
    status: "Low Stock",
    lastUpdated: "2025-09-20",
    traceability: {
      origin: {
        mine: "Petrochemical Plant - Gujarat",
        coordinates: "21.1702°N, 72.6369°E",
        certifications: ["ISO 9001", "REACH Compliant"],
      },
      supplier: {
        name: "Reliance Industries",
        contact: "chemicals@ril.com",
        rating: 4.6,
      },
      batchTracking: {
        batchNumber: "RIL-HDPE-2025-156",
        productionDate: "2025-09-14",
        qualityTests: [
          {
            test: "Density",
            result: "0.952 g/cm³",
            standard: "0.941-0.965 g/cm³",
          },
          {
            test: "Melt Index",
            result: "0.35 g/10min",
            standard: "0.2-0.5 g/10min",
          },
        ],
      },
      transportation: {
        route: "Hazira → Mumbai → Delhi",
        carbonFootprint: "1.2 kg CO2/ton",
        transportMode: "Road",
      },
    },
  },
  {
    id: "MAT-005",
    type: "Carbon Fiber",
    form: "Fabric",
    grade: "T700",
    source: "Toray Industries - Japan",
    quantity: 5,
    unit: "tons",
    status: "Available",
    lastUpdated: "2025-09-16",
    traceability: {
      origin: {
        mine: "Manufacturing Plant - Japan",
        coordinates: "35.6762°N, 139.6503°E",
        certifications: ["ISO 9001", "AS9100", "NADCAP"],
      },
      supplier: {
        name: "Toray Industries Inc.",
        contact: "export@toray.jp",
        rating: 4.9,
      },
      batchTracking: {
        batchNumber: "TOR-T700-2025-023",
        productionDate: "2025-08-28",
        qualityTests: [
          {
            test: "Tensile Strength",
            result: "4900 MPa",
            standard: ">4800 MPa",
          },
          { test: "Modulus", result: "230 GPa", standard: ">220 GPa" },
        ],
      },
      transportation: {
        route: "Tokyo Port → Mumbai Port → Delhi",
        carbonFootprint: "8.5 kg CO2/ton",
        transportMode: "Sea + Road",
      },
    },
  },
];

export const materialTypes = [
  "Aluminum",
  "Copper",
  "Steel",
  "Plastic",
  "Carbon Fiber",
  "Titanium",
  "Magnesium",
  "Composite",
];

export const materialForms = [
  "Ingot",
  "Sheet",
  "Rod",
  "Tube",
  "Pellets",
  "Powder",
  "Fabric",
  "Scrap",
];

export const materialSources = [
  "Primary Mining",
  "Recycled",
  "Bio-based",
  "Synthetic",
  "Recovered",
];
