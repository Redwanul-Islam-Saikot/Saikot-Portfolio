import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactSection from "@/lib/models/Contact";

// সেকশন আপডেট করা
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedConfig = await ContactSection.findByIdAndUpdate(id, body, {
      new: true,
    });

    return NextResponse.json({ success: true, data: updatedConfig });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// সেকশন ডিলিট করা
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    await ContactSection.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Contact section deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}