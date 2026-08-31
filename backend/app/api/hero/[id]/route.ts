import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Hero } from "@/lib/models/Hero";

// GET Single Hero
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const hero = await Hero.findById(id);
    if (!hero) {
      return NextResponse.json(
        { success: false, message: "Hero content not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: hero });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE Hero Content
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedHero = await Hero.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedHero) {
      return NextResponse.json(
        { success: false, message: "Hero content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedHero });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE Hero Content
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedHero = await Hero.findByIdAndDelete(id);

    if (!deletedHero) {
      return NextResponse.json(
        { success: false, message: "Hero content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}