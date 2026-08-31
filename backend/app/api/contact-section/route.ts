import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactSection from "@/lib/models/Contact";

// অ্যাডমিন কনফিগারেশন ও মেসেজ ফেচ করা
export async function GET() {
  try {
    await connectDB();
    const data = await ContactSection.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// নতুন অ্যাডমিন কনফিগারেশন তৈরি করা
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newConfig = await ContactSection.create(body);
    return NextResponse.json({ success: true, data: newConfig }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}