// app/api/dashboard/route.js

import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("sustainabilityDB"); // Use the DB name from the populator script

    // Fetch the data from the different collections
    // .findOne({}) gets the single document from a collection
    // .find({}).toArray() gets all documents from a collection
    const kpis = await db.collection("dashboardKpis").findOne({});
    const scenarios = await db.collection("scenarioComparisons").findOne({});
    const flowData = await db.collection("materialFlowData").find({}).sort({month: 1}).toArray(); // Sorting might be useful

    // Remove the internal _id fields from the response
    if (kpis) delete kpis._id;
    if (scenarios) delete scenarios._id;
    flowData.forEach(d => delete d._id);


    // Combine them into a single object to send to the client
    const dashboardData = {
      kpis,
      scenarios,
      flowData,
    };

    return NextResponse.json(dashboardData);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// This forces the route to be dynamic and re-fetch on every request.
// Useful for ensuring you always get the latest data.
export const dynamic = "force-dynamic";