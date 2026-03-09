import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const theme = await prisma.themeSettings.findUnique({
      where: { id: "singleton" },
    });

    if (!theme) {
      // Return default theme if none exists
      return NextResponse.json({
        id: "singleton",
        primaryColor: "#4695c4",
        secondaryColor: "#b48e57",
        backgroundColor: "#ffffff",
        textColor: "#403d39",
        headingColor: "#252422",
        headingFont: "Frank Ruhl Libre",
        bodyFont: "Muli",
      });
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error fetching theme:", error);
    return NextResponse.json(
      { error: "Failed to fetch theme" },
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

    // Only admins can update theme
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update theme settings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      headingColor,
      headingFont,
      bodyFont,
    } = body;

    const theme = await prisma.themeSettings.upsert({
      where: { id: "singleton" },
      update: {
        primaryColor,
        secondaryColor,
        backgroundColor,
        textColor,
        headingColor,
        headingFont,
        bodyFont,
      },
      create: {
        id: "singleton",
        primaryColor,
        secondaryColor,
        backgroundColor,
        textColor,
        headingColor,
        headingFont,
        bodyFont,
      },
    });

    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error updating theme:", error);
    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    );
  }
}
