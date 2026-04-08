import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // The GAS_WEBAPP_URL should be added to Vercel/Environment variables
    const webAppUrl = process.env.GAS_WEBAPP_URL;

    if (!webAppUrl) {
      return NextResponse.json(
        { ok: false, error: "GAS_WEBAPP_URL not configured in environment variables." },
        { status: 500 }
      );
    }

    const response = await fetch(webAppUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
