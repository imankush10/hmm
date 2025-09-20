// app/api/materials/route.js

import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const DB_NAME = "sustainabilityDB";

// GET handler to fetch all materials data
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const inventory = await db.collection("materialsInventory").find({}).toArray();
    const types = await db.collection("materialTypes").find({}).toArray();
    const forms = await db.collection("materialForms").find({}).toArray();
    const sources = await db.collection("materialSources").find({}).toArray();

    return NextResponse.json({
      inventory,
      types: types.map(t => t.name), // Extract just the name string
      forms: forms.map(f => f.name),
      sources: sources.map(s => s.name),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch inventory data" }, { status: 500 });
  }
}

// POST handler to add a new material
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("materialsInventory");
    
    // Get the new material data from the request body
    const newMaterialData = await request.json();

    // Get the latest material to determine the next ID
    const lastMaterial = await collection.findOne({}, { sort: { id: -1 } });
    const lastIdNum = lastMaterial ? parseInt(lastMaterial.id.split("-")[1]) : 0;
    const newId = `MAT-${String(lastIdNum + 1).padStart(3, "0")}`;
    const currentDate = new Date().toISOString().split("T")[0];

    // Construct the full material object to be inserted
    const newMaterialDocument = {
      id: newId,
      type: newMaterialData.type,
      form: newMaterialData.form,
      grade: newMaterialData.grade,
      source: newMaterialData.source,
      quantity: parseFloat(newMaterialData.quantity),
      unit: newMaterialData.unit,
      status: "Available",
      lastUpdated: currentDate,
      traceability: {
        origin: {
          mine: newMaterialData.origin,
          coordinates: newMaterialData.coordinates,
          certifications: newMaterialData.certifications
            .split(",")
            .map((cert) => cert.trim())
            .filter((cert) => cert),
        },
        supplier: {
          name: newMaterialData.supplierName,
          contact: newMaterialData.supplierContact,
          rating: 4.0, // Default rating for new suppliers
        },
        batchTracking: {
          batchNumber: `${newId}-${Date.now()}`,
          productionDate: currentDate,
          qualityTests: [], // Starts with no tests
        },
        transportation: {
          route: "New Route - To Be Determined",
          carbonFootprint: newMaterialData.carbonFootprint,
          transportMode: newMaterialData.transportMode,
        },
      },
    };

    const result = await collection.insertOne(newMaterialDocument);

    // Return the newly created document
    return NextResponse.json(newMaterialDocument, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add new material" }, { status: 500 });
  }
}

// Ensure the route is always dynamic
export const dynamic = "force-dynamic";