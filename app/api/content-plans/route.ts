import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.contentPlan.findMany({
      orderBy: { scheduledFor: "asc" },
      include: {
        assignedTo: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching content plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch content plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, platform, scheduledFor, status, notes, assignedToId } = body;

    const plan = await prisma.contentPlan.create({
      data: {
        title,
        type,
        platform,
        scheduledFor: new Date(scheduledFor),
        status: status || "IDEA",
        notes,
        assignedToId: assignedToId || session.user.id,
      },
      include: {
        assignedTo: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating content plan:", error);
    return NextResponse.json(
      { error: "Failed to create content plan" },
      { status: 500 }
    );
  }
}
