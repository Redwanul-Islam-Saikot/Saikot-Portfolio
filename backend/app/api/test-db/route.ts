import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "Database connected successfully!" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to database", details: (error as Error).message },
      { status: 500 }
    );
  }
}