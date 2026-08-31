import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/lib/models/Service";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newService = await Service.create(body);
    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}