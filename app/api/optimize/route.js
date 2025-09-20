import { NextResponse } from "next/server";

// Dummy ML optimization responses
const generateOptimizationRecommendations = (bomData, inventoryData) => {
  // Simulate processing time
  const processingDelay = Math.random() * 1000 + 500;

  // Generate dummy recommendations based on input
  const materialAllocation =
    bomData.components?.map((component, index) => {
      const recycledPercentage = Math.floor(Math.random() * 40) + 60; // 60-100%
      const primaryPercentage = 100 - recycledPercentage;

      return {
        product: bomData.productName || `Product ${index + 1}`,
        component: component.name || `Component ${index + 1}`,
        material: component.materialType || "Unknown Material",
        grade: component.materialGrade || "Standard",
        allocations: [
          {
            source: "Recycled",
            percentage: recycledPercentage,
            quantity: Math.ceil(
              ((component.requiredQuantity || 10) * recycledPercentage) / 100
            ),
            unit: component.unit || "kg",
            cost_per_unit: Math.floor(Math.random() * 50) + 100,
            availability: "Available",
            lead_time: Math.floor(Math.random() * 7) + 3,
          },
          {
            source: "Primary",
            percentage: primaryPercentage,
            quantity: Math.ceil(
              ((component.requiredQuantity || 10) * primaryPercentage) / 100
            ),
            unit: component.unit || "kg",
            cost_per_unit: Math.floor(Math.random() * 100) + 150,
            availability: "Available",
            lead_time: Math.floor(Math.random() * 14) + 7,
          },
        ],
        sustainability_score: Math.floor(Math.random() * 30) + 70,
        confidence: Math.floor(Math.random() * 20) + 80,
      };
    }) || [];

  const logistics = {
    optimal_routes: [
      {
        route_id: `ROUTE-${Date.now()}-001`,
        description:
          "Bauxite Mine → Odisha Processing Plant → Delhi Manufacturing",
        materials: ["Aluminum", "Steel"],
        total_distance: Math.floor(Math.random() * 500) + 800,
        estimated_cost: Math.floor(Math.random() * 50000) + 75000,
        estimated_co2: Math.floor(Math.random() * 200) + 300,
        transport_modes: ["Rail", "Road"],
        estimated_delivery: Math.floor(Math.random() * 5) + 7,
      },
      {
        route_id: `ROUTE-${Date.now()}-002`,
        description: "Local Recycling Center → Processing → Manufacturing",
        materials: ["Copper", "Plastic"],
        total_distance: Math.floor(Math.random() * 200) + 150,
        estimated_cost: Math.floor(Math.random() * 25000) + 35000,
        estimated_co2: Math.floor(Math.random() * 100) + 80,
        transport_modes: ["Road"],
        estimated_delivery: Math.floor(Math.random() * 3) + 3,
      },
    ],
    consolidation_opportunities: [
      {
        opportunity: "Batch shipment consolidation",
        potential_savings: Math.floor(Math.random() * 15) + 10,
        co2_reduction: Math.floor(Math.random() * 20) + 15,
        implementation_effort: "Medium",
      },
      {
        opportunity: "Local supplier prioritization",
        potential_savings: Math.floor(Math.random() * 25) + 20,
        co2_reduction: Math.floor(Math.random() * 30) + 25,
        implementation_effort: "Low",
      },
    ],
    estimated_total_co2_saving: `${Math.floor(Math.random() * 10) + 12}%`,
    estimated_cost_saving: `${Math.floor(Math.random() * 8) + 7}%`,
  };

  const environmentalImpact = {
    carbon_footprint_reduction: Math.floor(Math.random() * 20) + 15,
    water_usage_reduction: Math.floor(Math.random() * 15) + 10,
    energy_savings: Math.floor(Math.random() * 25) + 18,
    waste_reduction: Math.floor(Math.random() * 30) + 22,
    circularity_improvement: Math.floor(Math.random() * 12) + 8,
  };

  const riskAssessment = {
    supply_chain_risks: [
      {
        risk: "Material shortage",
        probability: "Low",
        impact: "Medium",
        mitigation: "Diversify supplier base",
      },
      {
        risk: "Transportation delays",
        probability: "Medium",
        impact: "Low",
        mitigation: "Build buffer inventory",
      },
      {
        risk: "Quality variations",
        probability: "Low",
        impact: "High",
        mitigation: "Enhanced quality testing",
      },
    ],
    overall_risk_score: Math.floor(Math.random() * 30) + 20, // Low risk
  };

  return {
    optimization_id: `OPT-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    processing_time_ms: processingDelay,
    recommendations: materialAllocation,
    logistics: logistics,
    environmental_impact: environmentalImpact,
    risk_assessment: riskAssessment,
    confidence_score: Math.floor(Math.random() * 15) + 85,
    model_version: "1.2.3-dummy",
    data_sources: [
      "Material Inventory Database",
      "Historical Usage Patterns",
      "Market Price Feeds",
      "Transportation Networks",
      "Environmental Impact Database",
    ],
  };
};

export async function POST(request) {
  try {
    const { bom, inventory, preferences = {} } = await request.json();

    // Validate input
    if (!bom) {
      return NextResponse.json(
        { error: "Bill of Materials (BOM) data is required" },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1500 + 500)
    );

    // Generate optimization recommendations
    const optimizationResult = generateOptimizationRecommendations(
      bom,
      inventory
    );

    // Add request metadata
    const response = {
      ...optimizationResult,
      request_metadata: {
        bom_id: bom.id || "unknown",
        bom_name: bom.productName || "Unknown Product",
        components_count: bom.components?.length || 0,
        inventory_items_count: inventory?.length || 0,
        preferences: preferences,
        api_version: "1.0.0",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Optimization API Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error during optimization",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  // Return API information and example usage
  return NextResponse.json({
    name: "LCA Optimization API",
    version: "1.0.0",
    description: "AI-powered material allocation and logistics optimization",
    endpoints: {
      "POST /api/optimize": "Generate optimization recommendations",
    },
    example_request: {
      bom: {
        id: "BOM-001",
        productName: "Car Door Frame",
        components: [
          {
            name: "Main Frame",
            materialType: "Aluminum",
            materialGrade: "AA 6016",
            requiredQuantity: 15,
            unit: "kg",
          },
        ],
      },
      inventory: [
        {
          id: "MAT-001",
          type: "Aluminum",
          quantity: 200,
          unit: "tons",
          source: "Recycled",
        },
      ],
      preferences: {
        prioritize_recycled: true,
        cost_weight: 0.3,
        environmental_weight: 0.7,
      },
    },
    response_fields: {
      optimization_id: "Unique optimization session ID",
      recommendations: "Material allocation recommendations",
      logistics: "Transportation and routing optimization",
      environmental_impact: "Environmental benefit analysis",
      risk_assessment: "Supply chain risk evaluation",
      confidence_score: "Overall recommendation confidence (0-100)",
    },
  });
}
