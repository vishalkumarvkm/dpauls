import { NextResponse } from "next/server";
import { createBitrixLead } from "@/lib/bitrix";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      name,
      lastName,
      phone,
      email,
      travelType,
      destination,
      UF_CRM_TRAVEL_TYPE,
      UF_CRM_DESTINATION,
      ufCrmTravelType,
      ufCrmDestination,
    } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required",
        },
        { status: 400 }
      );
    }

    const finalTravelType = travelType || UF_CRM_TRAVEL_TYPE || ufCrmTravelType;
    const finalDestination = destination || UF_CRM_DESTINATION || ufCrmDestination;

    const result = await createBitrixLead({
      title,
      name,
      lastName,
      phone,
      email,
      travelType: finalTravelType,
      destination: finalDestination,
    });

    return NextResponse.json({
      success: true,
      leadId: result.result,
    });
  } catch (error) {
    console.error("Bitrix lead creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create lead",
      },
      { status: 500 }
    );
  }
}
