// app/api/reports/route.js

import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const DB_NAME = "sustainabilityDB";

// GET handler to fetch all report-related data
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // These collections contain single documents, so we use findOne
    const environmentalReports = await db.collection("environmentalReports").findOne({});
    const reportMetadata = await db.collection("reportMetadata").findOne({});
    
    // This collection contains an array of documents
    const improvementRecommendations = await db.collection("improvementRecommendations").find({}).toArray();

    // Remove the internal MongoDB _id field before sending the response
    if (environmentalReports) delete environmentalReports._id;
    if (reportMetadata) delete reportMetadata._id;
    improvementRecommendations.forEach(rec => delete rec._id);

    return NextResponse.json({
      environmentalReports,
      reportMetadata,
      improvementRecommendations,
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch report data" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";