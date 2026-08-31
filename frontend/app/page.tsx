import HeroSection from "@/components/hero";
import Services from "@/components/services";
import About from "@/components/about";
import Projects from "@/components/projects";
import Education from "@/components/education";
import Contact from "@/components/contact";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Dynamic Hero Section Component */}
      <HeroSection />
      <Services />
      <About />
      <Projects />
      <Education />
      <Contact />
    </main>
  );
}