import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import Papa from "papaparse";

const DB_NAME = "sustainabilityDB";
const COLLECTION_NAME = "bomTemplates";

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

    // Validate required columns for BOM
    const requiredColumns = [
      "id",
      "productName",
      "description",
      "criticalityLevel",
      "componentName",
      "materialType",
      "materialGrade",
      "requiredQuantity",
      "unit",
    ];
    const csvColumns = Object.keys(csvData[0] || {});
    const missingColumns = requiredColumns.filter(
      (col) =>
        !csvColumns.some(
          (csvCol) =>
            csvCol.toLowerCase().replace(/[_\s]/g, "") ===
            col.toLowerCase().replace(/[_\s]/g, "")
        )
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

    // Group CSV data by BOM ID to handle multiple components per BOM
    const bomGroups = {};

    csvData.forEach((row, index) => {
      try {
        // Normalize column names
        const normalizedRow = {};
        Object.keys(row).forEach((key) => {
          const normalizedKey = key.toLowerCase().replace(/[_\s]/g, "");
          normalizedRow[normalizedKey] = row[key];
        });

        const bomId = normalizedRow.id;

        if (!bomGroups[bomId]) {
          bomGroups[bomId] = {
            id: bomId,
            productName: normalizedRow.productname,
            description: normalizedRow.description,
            criticalityLevel: normalizedRow.criticalitylevel || "Medium",
            createdDate:
              normalizedRow.createddate ||
              new Date().toISOString().split("T")[0],
            estimatedCost:
              parseFloat(normalizedRow.estimatedcost || normalizedRow.cost) ||
              0,
            currency: normalizedRow.currency || "INR",
            components: [],
          };
        }

        // Add component to the BOM
        const component = {
          componentId:
            normalizedRow.componentid || `COMP-${Date.now()}-${index}`,
          name: normalizedRow.componentname,
          materialType: normalizedRow.materialtype,
          materialGrade: normalizedRow.materialgrade,
          requiredQuantity: parseFloat(normalizedRow.requiredquantity) || 0,
          unit: normalizedRow.unit || "kg",
          requiredProperties: normalizedRow.requiredproperties
            ? normalizedRow.requiredproperties
                .split(";")
                .map((prop) => prop.trim())
            : [],
        };

        // Validate component required fields
        if (
          !component.name ||
          !component.materialType ||
          !component.materialGrade
        ) {
          throw new Error(
            `Row ${
              index + 1
            }: Missing required component fields (name, materialType, or materialGrade)`
          );
        }

        bomGroups[bomId].components.push(component);
      } catch (error) {
        throw new Error(`Row ${index + 1}: ${error.message}`);
      }
    });

    // Convert groups to array and validate BOMs
    const bomsToImport = Object.values(bomGroups).map((bom) => {
      if (!bom.productName || !bom.description || bom.components.length === 0) {
        throw new Error(
          `BOM ${bom.id}: Missing required fields or no components`
        );
      }
      return bom;
    });

    // Connect to database and insert BOMs
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Check for existing IDs and handle updates/inserts
    const existingBoms = await collection
      .find(
        { id: { $in: bomsToImport.map((b) => b.id) } },
        { projection: { id: 1 } }
      )
      .toArray();

    const existingIds = existingBoms.map((doc) => doc.id);
    const bomsToUpdate = bomsToImport.filter((b) => existingIds.includes(b.id));
    const bomsToInsert = bomsToImport.filter(
      (b) => !existingIds.includes(b.id)
    );

    let updateCount = 0;
    let insertCount = 0;

    // Update existing BOMs
    if (bomsToUpdate.length > 0) {
      const updateOperations = bomsToUpdate.map((bom) => ({
        updateOne: {
          filter: { id: bom.id },
          update: { $set: bom },
          upsert: false,
        },
      }));

      const updateResult = await collection.bulkWrite(updateOperations);
      updateCount = updateResult.modifiedCount;
    }

    // Insert new BOMs
    if (bomsToInsert.length > 0) {
      const insertResult = await collection.insertMany(bomsToInsert);
      insertCount = insertResult.insertedCount;
    }

    // Update related collections for dropdown data
    const criticalityLevels = [
      ...new Set(bomsToImport.map((b) => b.criticalityLevel)),
    ];
    const units = [
      ...new Set(bomsToImport.flatMap((b) => b.components.map((c) => c.unit))),
    ];
    const materialTypes = [
      ...new Set(
        bomsToImport.flatMap((b) => b.components.map((c) => c.materialType))
      ),
    ];

    // Upsert dropdown data
    await Promise.all([
      ...criticalityLevels.map((level) =>
        db
          .collection("criticalityLevels")
          .updateOne(
            { value: level },
            { $set: { value: level, label: level } },
            { upsert: true }
          )
      ),
      ...units.map((unit) =>
        db
          .collection("units")
          .updateOne(
            { value: unit },
            { $set: { value: unit, label: unit } },
            { upsert: true }
          )
      ),
      ...materialTypes.map((type) =>
        db
          .collection("materialTypes")
          .updateOne(
            { value: type },
            { $set: { value: type, label: type } },
            { upsert: true }
          )
      ),
    ]);

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${bomsToImport.length} BOMs: ${insertCount} new, ${updateCount} updated`,
      imported: insertCount,
      updated: updateCount,
      total: bomsToImport.length,
      boms: bomsToImport.map((b) => ({
        id: b.id,
        productName: b.productName,
        components: b.components.length,
        action: existingIds.includes(b.id) ? "updated" : "inserted",
      })),
    });
  } catch (error) {
    console.error("BOM CSV import error:", error);
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
