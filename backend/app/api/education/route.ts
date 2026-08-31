import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; // আপনার প্রজেক্টের DB connection import করুন
import Education from "@/lib/models/Education";

export async function GET() {
  try {
    await connectDB();
    const data = await Education.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newData = await Education.create(body);
    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}