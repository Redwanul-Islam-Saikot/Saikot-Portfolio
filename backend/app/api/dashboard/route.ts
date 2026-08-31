import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Service from "@/lib/models/Service";
import Education from "@/lib/models/Education";
import Contact from "@/lib/models/Contact";
import Hero from "@/lib/models/Hero";
import About from "@/lib/models/About";
import Footer from "@/lib/models/Footer";

export async function GET() {
  try {
    await connectDB();

    const activeAbout = await About.findOne({ isActive: true }).lean();
    const skillsCount = Array.isArray(activeAbout?.skills) ? activeAbout.skills.length : 0;

    // ৭ দিন আগের তারিখ হিসেব করা
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalHero,
      totalServices,
      totalAbout,
      totalProjects,
      totalEducation,
      totalMessages,
      totalFooter,
      recentContacts,
    ] = await Promise.all([
      Hero.countDocuments(),
      Service.countDocuments(),
      About.countDocuments(),
      Project.countDocuments(),
      Education.countDocuments(),
      Contact.countDocuments(),
      Footer.countDocuments(),
      // গত ৭ দিনের মেসেজ ফিল্টার করা হলো
      Contact.find({
        createdAt: { $gte: sevenDaysAgo },
      })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        hero: totalHero,
        services: totalServices,
        about: totalAbout,
        projects: totalProjects,
        skills: skillsCount,
        education: totalEducation,
        messages: totalMessages,
        footer: totalFooter,
      },
      recentContacts: JSON.parse(JSON.stringify(recentContacts)),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}