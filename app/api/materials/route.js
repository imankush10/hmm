import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const DB_NAME = "sustainabilityDB";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const inventoryFromDb = await db
      .collection("materialsInventory")
      .find({})
      .toArray();
    const types = await db.collection("materialTypes").find({}).toArray();
    const forms = await db.collection("materialForms").find({}).toArray();
    const sources = await db.collection("materialSources").find({}).toArray();

    // ✅ The Fix is here: We now intelligently classify the source for the ML model
    const inventoryForML = inventoryFromDb.map((material) => ({
      id: material.id,
      type: material.type,
      quantity: material.quantity,
      unit: material.unit,
      // If the source string includes 'rec' (case-insensitive), map it to 'Recycled'.
      // Otherwise, map it to 'Primary'. This makes the data clean for the AI.
      source: (material.source || "").toLowerCase().includes("rec")
        ? "Recycled"
        : "Primary",
    }));

    return NextResponse.json({
      inventory: inventoryFromDb,
      inventoryForML: inventoryForML,
      types: types.map((t) => t.name),
      forms: forms.map((f) => f.name),
      sources: sources.map((s) => s.name),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch inventory data" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("materialsInventory");

    const newMaterialData = await request.json();

    const lastMaterial = await collection.findOne({}, { sort: { id: -1 } });
    const lastIdNum = lastMaterial
      ? parseInt(lastMaterial.id.split("-")[1])
      : 0;
    const newId = `MAT-${String(lastIdNum + 1).padStart(3, "0")}`;
    const currentDate = new Date().toISOString().split("T")[0];

    // ✅ Map the new nested structure from the form to the database schema
    const newMaterialDocument = {
      id: newId,
      type: newMaterialData.type,
      form: newMaterialData.form,
      grade: newMaterialData.grade,
      source: newMaterialData.source, // 'Primary' or 'Recycled'
      quantity: parseFloat(newMaterialData.quantity),
      unit: newMaterialData.unit,
      status: "Available",
      lastUpdated: currentDate,
      traceability: {
        origin: {
          mine: newMaterialData.traceability.origin.mine,
          coordinates: newMaterialData.traceability.origin.coordinates || "N/A",
          certifications: (
            newMaterialData.traceability.origin.certifications || ""
          )
            .split(",")
            .map((cert) => cert.trim())
            .filter((cert) => cert),
        },
        supplier: {
          name: newMaterialData.traceability.supplier.name,
          contact: newMaterialData.traceability.supplier.contact || "N/A",
          rating: 4.0, // Default rating for new suppliers
        },
        batchTracking: {
          batchNumber: `${newId}-${Date.now()}`,
          productionDate: currentDate,
          qualityTests: [], // Starts with no tests
        },
        transportation: {
          route: newMaterialData.traceability.transportation.route || "N/A",
          carbonFootprint:
            newMaterialData.traceability.transportation.carbonFootprint ||
            "N/A",
          transportMode:
            newMaterialData.traceability.transportation.transportMode || "N/A",
        },
      },
    };

    await collection.insertOne(newMaterialDocument);

    return NextResponse.json(newMaterialDocument, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to add new material" },
      { status: 500 }
    );
  }
}

// Ensure the route is always dynamic
export const dynamic = "force-dynamic";
