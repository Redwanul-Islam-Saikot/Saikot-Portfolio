import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Footer from "@/lib/models/Footer";

// Fetch Footer Data
export async function GET() {
  try {
    await connectDB();
    const data = await Footer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Create New Footer Config
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newFooter = await Footer.create(body);
    return NextResponse.json({ success: true, data: newFooter }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}