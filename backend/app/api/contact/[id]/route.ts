import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactSection from "@/lib/models/Contact";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15+ compatibility

    const { searchParams } = new URL(req.url);
    const configId = searchParams.get("configId");

    const config = configId
      ? await ContactSection.findById(configId)
      : await ContactSection.findOne({ isActive: true });

    if (!config) {
      return NextResponse.json(
        { success: false, error: "Contact section not found" },
        { status: 404 }
      );
    }

    // _id দিয়ে ফিল্টার আউট করা
    config.messages = config.messages.filter(
      (msg: any) => msg._id?.toString() !== id
    );

    await config.save();

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}