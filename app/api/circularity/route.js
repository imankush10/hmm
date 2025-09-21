// app/api/circularity/route.js

import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  try {
    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const includeTrends = searchParams.get("trends") === "true";

    // Step 1: Fetch assessment data from MongoDB
    const client = await clientPromise;
    const db = client.db("sustainabilityDB");

    if (includeTrends) {
      // Fetch multiple assessments for trend analysis (limit to last 6)
      const assessments = await db
        .collection("assessments")
        .find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();

      if (!assessments || assessments.length === 0) {
        throw new Error("No assessments found for trend analysis");
      }

      // Get ML predictions for each assessment
      const trendData = [];
      for (const assessment of assessments) {
        const prediction = await getPredictionFromML(assessment);
        if (prediction) {
          trendData.push({
            period: assessment.createdAt.toISOString().split("T")[0], // Use date as period
            assessmentName: assessment.assessmentName,
            carbonFootprint: Math.round(
              prediction.CarbonFootprint_kgCO2eq_per_tonne || 0
            ),
            waterUsage: Math.round(prediction.WaterUsage_liters_per_tonne || 0),
            wasteGenerated: Math.round(
              prediction.WasteGenerated_kg_per_tonne || 0
            ),
            circularityIndex: Math.round(
              (prediction.MaterialCircularityIndex || 0) * 100
            ),
          });
        }
      }

      return NextResponse.json({ trends: trendData.reverse() }); // Reverse to show oldest first
    }

    // Original single assessment logic
    let assessment = await db.collection("assessments").findOne({
      "baseProfile.isDefault": true,
    });

    // If no default assessment, get the most recent one
    if (!assessment) {
      assessment = await db
        .collection("assessments")
        .findOne({}, { sort: { createdAt: -1 } });
    }

    if (!assessment) {
      throw new Error("No assessment data found in database");
    }

    console.log("Using assessment:", assessment.assessmentName);

    // Step 2: Get ML prediction for the assessment
    const prediction = await getPredictionFromML(assessment);

    if (!prediction) {
      throw new Error("Failed to get ML prediction");
    }

    // Transform the ML API response to our standardized format
    const transformedData = {
      carbonFootprint: {
        value: Math.round(prediction.CarbonFootprint_kgCO2eq_per_tonne || 0),
        unit: "kg CO₂e/tonne",
        trend: "-2.1%", // This could be calculated by comparing with previous values
        total: Math.round(
          (prediction.CarbonFootprint_kgCO2eq_per_tonne || 0) / 1000
        ), // Convert to tons for reports
        benchmarks: {
          industry: 4200,
          target: 3000,
          best: 2500,
        },
      },
      waterUsage: {
        value: Math.round(prediction.WaterUsage_liters_per_tonne || 0),
        unit: "L/tonne",
        trend: "-1.8%",
        total: Math.round((prediction.WaterUsage_liters_per_tonne || 0) / 1000), // Convert to m³ for reports
        benchmarks: {
          industry: 25000,
          target: 20000,
          best: 15000,
        },
      },
      wasteGenerated: {
        value: Math.round(prediction.WasteGenerated_kg_per_tonne || 0),
        unit: "kg/tonne",
        trend: "-3.2%",
        total: Math.round(prediction.WasteGenerated_kg_per_tonne || 0),
        benchmarks: {
          industry: 6500,
          target: 5000,
          best: 4000,
        },
      },
      circularityIndex: {
        value: Math.round((prediction.MaterialCircularityIndex || 0) * 100),
        unit: "%",
        trend: "+1.5%",
        total: Math.round((prediction.MaterialCircularityIndex || 0) * 100),
        benchmarks: {
          industry: 25,
          target: 45,
          best: 60,
        },
      },
      // Additional metrics that might be useful for reports
      energyConsumption: {
        value: Math.round(
          prediction.CarbonFootprint_kgCO2eq_per_tonne * 2.3 || 0
        ), // Estimated based on carbon footprint
        unit: "kWh/tonne",
        trend: "-2.5%",
        total: Math.round(
          prediction.CarbonFootprint_kgCO2eq_per_tonne * 2.3 || 0
        ),
        benchmarks: {
          industry: 8500,
          target: 7000,
          best: 5500,
        },
      },
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching circularity data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch circularity data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = "force-dynamic";

// Helper function to get ML prediction for a single assessment
async function getPredictionFromML(assessment) {
  try {
    const { parameters } = assessment;

    // Transform the assessment data into the array format expected by ML model
    const mlInputData = [
      parameters.OreGrade_percent,
      parameters.MiningMethod,
      parameters.WasteRockRatio,
      parameters.ExtractionReagents_kg_per_tonne,
      parameters.LandUse_m2_per_tonne,
      parameters.OnsiteFuelConsumption_liters_per_tonne,
      parameters.WaterConsumption_liters_per_tonne_upstream,
      parameters.ProductionTechnology,
      parameters.ElectricityGridCarbonIntensity_gCO2eq_per_kWh,
      parameters.AncillaryMaterials_kg_per_tonne,
      parameters.DirectProcessEmissions_kgCO2eq_per_tonne,
      parameters.SlagValorizationRate_percent,
      parameters.ThermalEnergySource,
      parameters.ProductLifespan_years,
      parameters.MaterialEfficiency_manufacturing_percent,
      parameters.InUseEnergySaving_kWh_per_tonne,
      parameters.CorrosionResistance_index_1_10,
      parameters.RecycledContent_percent,
      parameters.EndOfLifeCollectionRate_percent,
      parameters.RecyclingYield_percent,
      parameters.DowncyclingRate_percent,
      parameters.TransportationDistance_km,
    ];

    // Prepare the data in the format expected by ML model
    const mlPayload = {
      data: [mlInputData],
    };

    // Send to ML API
    const response = await fetch(process.env.ML_MODEL_URI + "/circularity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mlPayload),
    });

    if (!response.ok) {
      throw new Error(`ML API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Validate and return prediction
    if (
      data.predictions &&
      Array.isArray(data.predictions) &&
      data.predictions.length > 0
    ) {
      return data.predictions[0];
    }

    return null;
  } catch (error) {
    console.error("Error getting ML prediction:", error);
    return null;
  }
}
