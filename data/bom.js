export const bomTemplates = [
  {
    id: "BOM-001",
    productName: "Car Door Frame",
    description: "Lightweight aluminum door frame for electric vehicles",
    criticalityLevel: "High",
    createdDate: "2025-09-15",
    components: [
      {
        componentId: "COMP-001",
        name: "Main Frame Structure",
        materialType: "Aluminum",
        materialGrade: "AA 6016",
        requiredQuantity: 15,
        unit: "kg",
        requiredProperties: [
          "Tensile strength > 250 MPa",
          "Corrosion resistance: Grade A",
          "Formability: Excellent",
        ],
      },
      {
        componentId: "COMP-002",
        name: "Reinforcement Brackets",
        materialType: "Steel",
        materialGrade: "AISI 304",
        requiredQuantity: 3,
        unit: "kg",
        requiredProperties: [
          "Yield strength > 270 MPa",
          "Weldability: Good",
          "Fatigue resistance: High",
        ],
      },
    ],
    estimatedCost: 2500,
    currency: "INR",
  },
  {
    id: "BOM-002",
    productName: "Battery Housing",
    description: "Protective housing for lithium-ion battery pack",
    criticalityLevel: "High",
    createdDate: "2025-09-18",
    components: [
      {
        componentId: "COMP-003",
        name: "Housing Shell",
        materialType: "Aluminum",
        materialGrade: "AA 6061",
        requiredQuantity: 25,
        unit: "kg",
        requiredProperties: [
          "Thermal conductivity > 150 W/mK",
          "Electrical insulation: Required",
          "Fire resistance: Class A",
        ],
      },
      {
        componentId: "COMP-004",
        name: "Insulation Layer",
        materialType: "Plastic",
        materialGrade: "HDPE",
        requiredQuantity: 8,
        unit: "kg",
        requiredProperties: [
          "Dielectric strength > 20 kV/mm",
          "Temperature resistance: -40°C to 85°C",
          "Chemical resistance: Excellent",
        ],
      },
    ],
    estimatedCost: 4200,
    currency: "INR",
  },
  {
    id: "BOM-003",
    productName: "Aerospace Wing Component",
    description: "High-performance wing section for commercial aircraft",
    criticalityLevel: "High",
    createdDate: "2025-09-10",
    components: [
      {
        componentId: "COMP-005",
        name: "Wing Skin",
        materialType: "Carbon Fiber",
        materialGrade: "T700",
        requiredQuantity: 50,
        unit: "kg",
        requiredProperties: [
          "Tensile strength > 4800 MPa",
          "Weight to strength ratio: Optimal",
          "Fatigue life > 10^6 cycles",
        ],
      },
      {
        componentId: "COMP-006",
        name: "Internal Structure",
        materialType: "Aluminum",
        materialGrade: "AA 7075",
        requiredQuantity: 75,
        unit: "kg",
        requiredProperties: [
          "Yield strength > 500 MPa",
          "Stress corrosion resistance: Good",
          "Machinability: Excellent",
        ],
      },
    ],
    estimatedCost: 125000,
    currency: "INR",
  },
];

export const criticalityLevels = ["Low", "Medium", "High", "Critical"];

export const componentCategories = [
  "Structural",
  "Mechanical",
  "Electrical",
  "Thermal",
  "Protective",
  "Aesthetic",
];

export const units = [
  "kg",
  "tons",
  "pieces",
  "meters",
  "liters",
  "cubic meters",
];
