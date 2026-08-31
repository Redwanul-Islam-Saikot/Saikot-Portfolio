import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Education from "@/lib/models/Education";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js App Router এ params await করতে হয়
    const body = await req.json();

    const updated = await Education.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js App Router এ params await করতে হয়

    const deleted = await Education.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}