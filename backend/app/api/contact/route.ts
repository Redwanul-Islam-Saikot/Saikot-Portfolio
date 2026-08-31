import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactSection from "@/lib/models/Contact";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, service, timeline, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    // অ্যাক্টিভ সেকশন ডাটা খুঁজে বের করে মেসেজ অ্যাড করা
    let activeConfig = await ContactSection.findOne({ isActive: true });
    
    // যদি কোনো কনফিগ না থাকে, ডিফল্ট একটি তৈরি করে নেবে
    if (!activeConfig) {
      activeConfig = await ContactSection.create({
        title: "Contact me",
        subtitle: "Cultivating Connections: Reach Out And Connect With Me",
        servicesOptions: ["Web Design", "App Design", "Branding"],
        isActive: true,
        messages: [],
      });
    }

    activeConfig.messages.push({
      name,
      email,
      phone,
      service,
      timeline,
      message,
    });

    await activeConfig.save();

    return NextResponse.json({
      success: true,
      message: "Saved to database successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}