import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; // আপনার MongoDB সংযোগ ফাংশন
import { Hero } from "@/lib/models/Hero";

export async function GET() {
  try {
    await connectDB();
    const heroes = await Hero.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: heroes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newHero = await Hero.create(body);
    return NextResponse.json({ success: true, data: newHero }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}