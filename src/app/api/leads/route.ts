import { NextResponse } from "next/server";
import { createBitrixLead } from "@/lib/bitrix";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      lastName,
      phone,
      email,
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

    const result = await createBitrixLead({
      name,
      lastName,
      phone,
      email,
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
