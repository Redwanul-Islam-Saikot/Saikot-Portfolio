import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Footer from "@/lib/models/Footer";

// Update Footer Config
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedFooter = await Footer.findByIdAndUpdate(id, body, {
      new: true,
    });

    return NextResponse.json({ success: true, data: updatedFooter });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Delete Footer Config
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    await Footer.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Footer deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}