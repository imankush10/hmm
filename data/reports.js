export const environmentalReports = {
  carbonFootprint: {
    total: 1200,
    unit: "CO2e (tons)",
    breakdown: {
      materialExtraction: 480,
      transportation: 180,
      processing: 320,
      manufacturing: 150,
      endOfLife: 70,
    },
    benchmarks: {
      industryAverage: 1580,
      bestInClass: 890,
      targetReduction: 950,
    },
    trends: [
      { period: "Q1 2025", value: 1350, target: 1300 },
      { period: "Q2 2025", value: 1280, target: 1250 },
      { period: "Q3 2025", value: 1200, target: 1200 },
      { period: "Q4 2025 (Projected)", value: 1120, target: 1150 },
    ],
  },
  waterUsage: {
    total: 500,
    unit: "m³",
    breakdown: {
      cooling: 200,
      cleaning: 150,
      processing: 100,
      other: 50,
    },
    recycled: 320,
    recyclingRate: 64,
    benchmarks: {
      industryAverage: 650,
      bestInClass: 380,
      target: 400,
    },
  },
  energyConsumption: {
    total: 2000,
    unit: "kWh",
    breakdown: {
      processing: 800,
      manufacturing: 600,
      transportation: 300,
      facilities: 200,
      other: 100,
    },
    renewable: 1400,
    renewablePercentage: 70,
    carbonIntensity: 0.6, // kg CO2/kWh
    benchmarks: {
      industryAverage: 2500,
      bestInClass: 1600,
      target: 1800,
    },
  },
  circularityMetrics: {
    overall: 72,
    unit: "%",
    components: {
      materialRecovery: 78,
      recycledContent: 67,
      durabilityIndex: 85,
      repairability: 65,
      endOfLifeRecovery: 73,
    },
    targets: {
      materialRecovery: 85,
      recycledContent: 75,
      durabilityIndex: 90,
      repairability: 80,
      endOfLifeRecovery: 85,
    },
    industryComparison: {
      aerospace: 68,
      automotive: 74,
      electronics: 62,
      construction: 71,
    },
  },
  wasteGeneration: {
    total: 45,
    unit: "tons",
    breakdown: {
      recyclable: 32,
      hazardous: 3,
      organic: 8,
      nonRecyclable: 2,
    },
    diversion: {
      recycled: 32,
      composted: 8,
      energyRecovery: 3,
      landfill: 2,
    },
    diversionRate: 96, // percentage
  },
  biodiversityImpact: {
    landUse: 12.5,
    unit: "hectares",
    restorationProjects: 3,
    speciesProtected: 15,
    carbonSequestration: 45,
    waterConservation: 120,
  },
};

export const reportMetadata = {
  generatedDate: "2025-09-20",
  reportingPeriod: "Q3 2025",
  complianceStandards: [
    "ISO 14001 Environmental Management",
    "GRI Standards",
    "TCFD Recommendations",
    "EU Taxonomy Regulation",
    "CDP Climate Change",
  ],
  certifications: [
    "ISO 14001:2015",
    "ISO 50001:2018",
    "LEED Platinum",
    "Cradle to Cradle Certified",
  ],
  reviewers: [
    {
      name: "Dr. Priya Sharma",
      role: "Environmental Compliance Officer",
      signature: "PS_2025_09_20",
    },
    {
      name: "Rajesh Kumar",
      role: "Sustainability Manager",
      signature: "RK_2025_09_20",
    },
  ],
};

export const improvementRecommendations = [
  {
    category: "Carbon Reduction",
    recommendation: "Increase renewable energy usage to 85%",
    impact: "Reduce CO2 emissions by 200 tons annually",
    timeline: "6 months",
    investment: "₹25,00,000",
    priority: "High",
  },
  {
    category: "Water Conservation",
    recommendation: "Implement closed-loop water recycling system",
    impact: "Reduce freshwater consumption by 30%",
    timeline: "8 months",
    investment: "₹45,00,000",
    priority: "Medium",
  },
  {
    category: "Circular Economy",
    recommendation: "Establish material recovery facility",
    impact: "Increase circularity rate to 85%",
    timeline: "12 months",
    investment: "₹1,20,00,000",
    priority: "High",
  },
  {
    category: "Supply Chain",
    recommendation: "Partner with local recycled material suppliers",
    impact: "Reduce transportation emissions by 40%",
    timeline: "4 months",
    investment: "₹15,00,000",
    priority: "Medium",
  },
];
