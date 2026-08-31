import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import About from "@/lib/models/About";

export async function GET() {
  try {
    await connectDB();
    const data = await About.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newAbout = await About.create(body);
    return NextResponse.json({ success: true, data: newAbout }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}