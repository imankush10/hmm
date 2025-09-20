// app/api/boms/route.js

import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb"; // Needed to update/delete by MongoDB's _id

const DB_NAME = "sustainabilityDB";
const COLLECTION_NAME = "bomTemplates";

// GET: Fetch all BOMs and related dropdown data
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Fetch the full BOM documents from the database
    const bomsFromDb = await db.collection(COLLECTION_NAME).find({}).toArray();
    
    // Fetch related data for forms/dropdowns
    const criticalityLevels = await db.collection("criticalityLevels").find({}).toArray();
    const units = await db.collection("units").find({}).toArray();
    const materialTypes = await db.collection("materialTypes").find({}).toArray();

    // ✅ Create the lean, ML-specific version of the BOMs
    const bomsForML = bomsFromDb.map(bom => ({
      id: bom.id,
      productName: bom.productName,
      components: bom.components.map(c => ({
        name: c.name,
        materialType: c.materialType,
        materialGrade: c.materialGrade,
        requiredQuantity: c.requiredQuantity,
        unit: c.unit,
      }))
    }));

    return NextResponse.json({
      boms: bomsFromDb, // Send the FULL data for the UI
      bomsForML: bomsForML, // Send the LEAN data for the Optimization page
      criticalityLevels: criticalityLevels.map(item => item.name),
      units: units.map(item => item.name),
      materialTypes: materialTypes.map(item => item.name),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch BOM data" }, { status: 500 });
  }
}


// POST: Create a new BOM
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const newBomData = await request.json();

    const lastBom = await db.collection(COLLECTION_NAME).findOne({}, { sort: { id: -1 } });
    const lastIdNum = lastBom ? parseInt(lastBom.id.split("-")[1]) : 0;
    
    const newBom = {
      ...newBomData,
      id: `BOM-${String(lastIdNum + 1).padStart(3, "0")}`,
      createdDate: new Date().toISOString().split("T")[0],
      components: newBomData.components.map((comp, index) => ({
        ...comp,
        componentId: `COMP-${Date.now()}-${index}`,
      })),
    };
    
    await db.collection(COLLECTION_NAME).insertOne(newBom);
    return NextResponse.json(newBom, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create BOM" }, { status: 500 });
  }
}

// PUT: Update an existing BOM
export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const bomToUpdate = await request.json();

    // Separate the MongoDB _id from the rest of the data
    const { _id, ...dataWithoutId } = bomToUpdate;

    const updatedBom = {
      ...dataWithoutId,
      updatedDate: new Date().toISOString().split("T")[0],
    };

    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedBom }
    );
    
    // Return the document with the _id for client-side state management
    return NextResponse.json({ ...updatedBom, _id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update BOM" }, { status: 500 });
  }
}

// DELETE: Delete a BOM
export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // Get id from query parameter like /api/boms?id=...

    if (!id) {
        return NextResponse.json({ error: "BOM ID is required" }, { status: 400 });
    }

    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return NextResponse.json({ error: "BOM not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "BOM deleted successfully" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete BOM" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
