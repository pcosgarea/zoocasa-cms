import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.popupSettings.findUnique({
      where: { id: "singleton" },
    });

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        id: "singleton",
        enabled: true,
        title: "Stay Updated with Zoocasa!",
        description: "Get the latest real estate insights and market updates delivered to your inbox.",
        ctaText: "Subscribe Now",
        frequency: "ONCE_PER_SESSION",
        delaySeconds: 5,
        showAfterScroll: null,
        backgroundColor: "#ffffff",
        textColor: "#000000",
        buttonColor: "#4695c4",
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching popup settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch popup settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can update popup settings
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update popup settings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      enabled,
      title,
      description,
      ctaText,
      frequency,
      delaySeconds,
      showAfterScroll,
      backgroundColor,
      textColor,
      buttonColor,
    } = body;

    const settings = await prisma.popupSettings.upsert({
      where: { id: "singleton" },
      update: {
        enabled,
        title,
        description,
        ctaText,
        frequency,
        delaySeconds,
        showAfterScroll,
        backgroundColor,
        textColor,
        buttonColor,
      },
      create: {
        id: "singleton",
        enabled,
        title,
        description,
        ctaText,
        frequency,
        delaySeconds,
        showAfterScroll,
        backgroundColor,
        textColor,
        buttonColor,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating popup settings:", error);
    return NextResponse.json(
      { error: "Failed to update popup settings" },
      { status: 500 }
    );
  }
}
