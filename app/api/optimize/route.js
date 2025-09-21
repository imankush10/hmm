// app/api/optimize/route.js

import { NextResponse } from "next/server";

// The URL where your Dockerized ML API is running.
// Make sure to replace this if your port is different.
const ML_API_URL = process.env.ML_MODEL_URI+"/bom-optimize"; // Assuming '/bom-optimize' is the correct endpoint

export async function POST(request) {
  try {
    // 1. Get the data from the frontend request
    const { bom, inventory, preferences = {} } = await request.json();

    // 2. Validate input (this part is good, let's keep it)
    if (!bom) {
      return NextResponse.json(
        { error: "Bill of Materials (BOM) data is required" },
        { status: 400 }
      );
    }

    // 3. Construct the payload for the ML API
    //    The structure you already have matches what the ML API needs.
    const payload = {
      bom,
      inventory,
      preferences,
    };

    // 4. Call the external ML API
    console.log("Sending payload to ML API:", JSON.stringify(payload, null, 2));

    const mlResponse = await fetch(ML_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 5. Handle the response from the ML API
    if (!mlResponse.ok) {
      // If the ML API returns an error, pass it along
      const errorData = await mlResponse.json();
      throw new Error(
        `ML API failed with status ${mlResponse.status}: ${
          errorData.error || "Unknown error"
        }`
      );
    }

    const mlResponseData = await mlResponse.json();

    // 6. VERY IMPORTANT: The real API nests its result inside an "optimization_score" key.
    //    We will extract this object and send it to the frontend, so the frontend
    //    doesn't need major changes.
    return NextResponse.json(mlResponseData.optimization_score);
    
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}