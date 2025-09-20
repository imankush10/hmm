export const dashboardKpis = {
  inventoryLevels: {
    total: 480,
    available: 375,
    lowStock: 75,
    outOfStock: 30,
    unit: "tons",
  },
  recycledContent: {
    percentage: 67,
    target: 75,
    improvement: "+12% from last month",
  },
  co2Savings: {
    amount: 2340,
    unit: "kg CO2e",
    comparedToPrimary: "15% reduction",
    monthlyTrend: "+5.2%",
  },
  energyConsumption: {
    total: 2000,
    renewable: 1400,
    unit: "kWh",
    renewablePercentage: 70,
  },
  waterUsage: {
    total: 500,
    recycled: 320,
    unit: "m³",
    recycledPercentage: 64,
  },
  circularityRate: {
    current: 72,
    target: 85,
    improvement: "+8% from last quarter",
  },
};

export const sankeyData = {
  nodes: [
    { id: "primary", name: "Primary Materials", category: "source" },
    { id: "recycled", name: "Recycled Materials", category: "source" },
    { id: "processing", name: "Processing Plant", category: "process" },
    { id: "manufacturing", name: "Manufacturing", category: "process" },
    { id: "products", name: "Finished Products", category: "output" },
    { id: "waste", name: "Waste Stream", category: "output" },
    { id: "recovery", name: "Material Recovery", category: "circular" },
  ],
  links: [
    {
      source: "primary",
      target: "processing",
      value: 200,
      material: "Aluminum",
    },
    {
      source: "recycled",
      target: "processing",
      value: 150,
      material: "Aluminum",
    },
    {
      source: "processing",
      target: "manufacturing",
      value: 320,
      material: "Processed Materials",
    },
    {
      source: "manufacturing",
      target: "products",
      value: 280,
      material: "Products",
    },
    {
      source: "manufacturing",
      target: "waste",
      value: 40,
      material: "Manufacturing Waste",
    },
    {
      source: "waste",
      target: "recovery",
      value: 30,
      material: "Recoverable Materials",
    },
    {
      source: "recovery",
      target: "recycled",
      value: 25,
      material: "Recycled Content",
    },
  ],
};

export const scenarioComparisons = {
  "Primary vs Recycled Mix": {
    scenarios: [
      {
        name: "Current Mix (67% Recycled)",
        co2Footprint: 1200,
        cost: 450000,
        energyUse: 2000,
        waterUse: 500,
      },
      {
        name: "Increased Recycled (85% Recycled)",
        co2Footprint: 950,
        cost: 380000,
        energyUse: 1600,
        waterUse: 380,
      },
      {
        name: "Primary Only (0% Recycled)",
        co2Footprint: 2100,
        cost: 720000,
        energyUse: 3200,
        waterUse: 850,
      },
    ],
  },
  "Transportation Routes": {
    scenarios: [
      {
        name: "Current Route (Mixed Transport)",
        co2Footprint: 340,
        cost: 85000,
        deliveryTime: 7,
        reliability: 92,
      },
      {
        name: "Rail-Optimized Route",
        co2Footprint: 220,
        cost: 95000,
        deliveryTime: 10,
        reliability: 96,
      },
      {
        name: "Air-Express Route",
        co2Footprint: 1200,
        cost: 280000,
        deliveryTime: 2,
        reliability: 98,
      },
    ],
  },
};

export const materialFlowData = [
  {
    month: "Jan",
    primary: 180,
    recycled: 120,
    waste: 35,
    recovered: 25,
  },
  {
    month: "Feb",
    primary: 165,
    recycled: 135,
    waste: 32,
    recovered: 28,
  },
  {
    month: "Mar",
    primary: 145,
    recycled: 155,
    waste: 28,
    recovered: 32,
  },
  {
    month: "Apr",
    primary: 130,
    recycled: 170,
    waste: 25,
    recovered: 35,
  },
  {
    month: "May",
    primary: 120,
    recycled: 180,
    waste: 22,
    recovered: 38,
  },
  {
    month: "Jun",
    primary: 110,
    recycled: 190,
    waste: 20,
    recovered: 40,
  },
];
