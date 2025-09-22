import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import Papa from "papaparse";

const DB_NAME = "sustainabilityDB";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    const csvContent = new TextDecoder().decode(buffer);

    // Parse CSV
    const parseResult = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      quotes: true,
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ",",
      dynamicTyping: false,
      skipFirstNLines: 0,
      transform: (value, field) => {
        // Trim whitespace from all values
        return typeof value === "string" ? value.trim() : value;
      },
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "CSV parsing errors",
          details: parseResult.errors.map((err) => ({
            row: err.row || "unknown",
            message: err.message || "Unknown error",
            type: err.type || "error",
          })),
        },
        { status: 400 }
      );
    }

    const csvData = parseResult.data;

    // Validate required columns
    const requiredColumns = [
      "id",
      "type",
      "form",
      "grade",
      "source",
      "quantity",
      "unit",
      "status",
    ];
    const csvColumns = Object.keys(csvData[0] || {});
    const missingColumns = requiredColumns.filter(
      (col) =>
        !csvColumns.some((csvCol) => csvCol.toLowerCase() === col.toLowerCase())
    );

    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required columns: ${missingColumns.join(", ")}`,
          expectedColumns: requiredColumns,
          foundColumns: csvColumns,
        },
        { status: 400 }
      );
    }

    // Transform CSV data to match our schema
    const materialsToImport = csvData.map((row, index) => {
      try {
        // Normalize column names (case-insensitive mapping)
        const normalizedRow = {};
        Object.keys(row).forEach((key) => {
          const normalizedKey = key.toLowerCase().trim();
          normalizedRow[normalizedKey] = row[key];
        });

        const material = {
          id: normalizedRow.id?.trim() || `MAT-${Date.now()}-${index}`,
          type: normalizedRow.type,
          form: normalizedRow.form,
          grade: normalizedRow.grade,
          source: normalizedRow.source,
          quantity: parseFloat(normalizedRow.quantity) || 0,
          unit: normalizedRow.unit,
          status: normalizedRow.status || "Available",
          lastUpdated: new Date().toISOString().split("T")[0],
          traceability: {
            origin: {
              mine: normalizedRow.mine || normalizedRow.source,
              coordinates: normalizedRow.coordinates || "",
              certifications: normalizedRow.certifications
                ? normalizedRow.certifications
                    .split(";")
                    .map((cert) => cert.trim())
                : [],
            },
            supplier: {
              name:
                normalizedRow.supplier_name ||
                normalizedRow.supplier ||
                "Unknown",
              contact:
                normalizedRow.supplier_contact || normalizedRow.contact || "",
              rating:
                parseFloat(
                  normalizedRow.supplier_rating || normalizedRow.rating
                ) || 4.0,
            },
            batchTracking: {
              batchNumber:
                normalizedRow.batch_number ||
                normalizedRow.batch ||
                `BATCH-${Date.now()}-${index}`,
              productionDate:
                normalizedRow.production_date ||
                normalizedRow.prod_date ||
                new Date().toISOString().split("T")[0],
              qualityTests: [],
            },
            transportation: {
              route: normalizedRow.route || normalizedRow.transport_route || "",
              carbonFootprint:
                normalizedRow.carbon_footprint ||
                normalizedRow.footprint ||
                "0 kg CO2/ton",
              transportMode:
                normalizedRow.transport_mode || normalizedRow.mode || "Road",
            },
          },
        };

        // Validate required fields
        if (
          !material.id ||
          !material.type ||
          !material.form ||
          !material.source
        ) {
          throw new Error(
            `Row ${
              index + 1
            }: Missing required fields (id, type, form, or source)`
          );
        }

        return material;
      } catch (error) {
        throw new Error(`Row ${index + 1}: ${error.message}`);
      }
    });

    // Check for duplicate IDs within the CSV itself
    const csvIds = materialsToImport.map((m) => m.id);
    const duplicateCsvIds = csvIds.filter(
      (id, index) => csvIds.indexOf(id) !== index
    );

    if (duplicateCsvIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Duplicate IDs found within CSV: ${[
            ...new Set(duplicateCsvIds),
          ].join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Connect to database and insert materials
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("materialsInventory");

    // Check for existing IDs and handle updates/inserts
    const existingMaterials = await collection
      .find(
        { id: { $in: materialsToImport.map((m) => m.id) } },
        { projection: { id: 1 } }
      )
      .toArray();

    const existingIds = existingMaterials.map((doc) => doc.id);
    const materialsToUpdate = materialsToImport.filter((m) =>
      existingIds.includes(m.id)
    );
    const materialsToInsert = materialsToImport.filter(
      (m) => !existingIds.includes(m.id)
    );

    let updateCount = 0;
    let insertCount = 0;

    // Update existing materials
    if (materialsToUpdate.length > 0) {
      const updateOperations = materialsToUpdate.map((material) => ({
        updateOne: {
          filter: { id: material.id },
          update: { $set: material },
          upsert: false,
        },
      }));

      const updateResult = await collection.bulkWrite(updateOperations);
      updateCount = updateResult.modifiedCount;
    }

    // Insert new materials
    if (materialsToInsert.length > 0) {
      const insertResult = await collection.insertMany(materialsToInsert);
      insertCount = insertResult.insertedCount;
    }

    // Update related collections for dropdown data
    const types = [...new Set(materialsToImport.map((m) => m.type))];
    const forms = [...new Set(materialsToImport.map((m) => m.form))];
    const sources = [...new Set(materialsToImport.map((m) => m.source))];

    // Upsert types, forms, and sources
    await Promise.all([
      ...types.map((type) =>
        db
          .collection("materialTypes")
          .updateOne(
            { value: type },
            { $set: { value: type, label: type } },
            { upsert: true }
          )
      ),
      ...forms.map((form) =>
        db
          .collection("materialForms")
          .updateOne(
            { value: form },
            { $set: { value: form, label: form } },
            { upsert: true }
          )
      ),
      ...sources.map((source) =>
        db
          .collection("materialSources")
          .updateOne(
            { value: source },
            { $set: { value: source, label: source } },
            { upsert: true }
          )
      ),
    ]);

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${materialsToImport.length} materials: ${insertCount} new, ${updateCount} updated`,
      imported: insertCount,
      updated: updateCount,
      total: materialsToImport.length,
      materials: materialsToImport.map((m) => ({
        id: m.id,
        type: m.type,
        quantity: m.quantity,
        action: existingIds.includes(m.id) ? "updated" : "inserted",
      })),
    });
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import CSV",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
