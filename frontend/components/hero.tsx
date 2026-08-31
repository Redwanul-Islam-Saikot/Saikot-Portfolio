"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaWhatsapp } from "react-icons/fa6";

export default function HeroSection() {
  const [data, setData] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const apiUrl = cleanBaseUrl + "/api/hero";

    fetch(apiUrl)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data && resData.data.length > 0) {
          const activeHero = resData.data.find((item: any) => item.isActive !== false);
          setData(activeHero || resData.data[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch hero data:", err);
      });
  }, []);

  const handleDownloadCv = async (cvUrl: string) => {
    if (!cvUrl || downloading) return;

    try {
      setDownloading(true);
      const response = await fetch(cvUrl);
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Resume.pdf";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.location.href = cvUrl;
    } finally {
      setDownloading(false);
    }
  };

  if (!data) return null;

  // Link thakle valo, na thakle default '#' dhorbe jeno Icon shob somoy dekhay
  const instagramUrl = data.instagramUrl || "#";
  const linkedinUrl = data.linkedinUrl || "#";
  const facebookUrl = data.facebookUrl || "#";
  const whatsappUrl = data.whatsappUrl || "#";

  const getTarget = (url: string) => (!url || url === "#" ? "_self" : "_blank");

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 py-12 text-white sm:px-8 md:px-12 lg:px-16 lg:py-20">
      {/* Dynamic Keyframes for Floating Animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(1deg);
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>

      {/* Background Soft Glow */}
      <div className="pointer-events-none absolute left-[-10%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#FF6400]/10 blur-[150px]" />

      {/* Full Width Layout Container */}
      <div className="relative z-10 flex w-full flex-col-reverse items-center justify-between gap-10 lg:flex-row lg:gap-4">
        
        {/* Left Content */}
        <div className="w-full flex-1 space-y-7 text-left lg:w-1/2">
          <div className="space-y-1">
            {data.greeting && (
              <p className="text-xl font-normal text-gray-400 sm:text-2xl">{data.greeting}</p>
            )}
            {data.name && (
              <h2 className="text-3xl font-bold tracking-tight text-gray-200 sm:text-4xl lg:text-5xl">
                {data.name}
              </h2>
            )}
            {data.title && (
              <h1 className="pt-2 text-4xl font-extrabold text-[#FF6400] sm:text-6xl lg:text-7xl">
                {data.title}
              </h1>
            )}
          </div>

          {/* Social Icons - Shobgulo Icon Always Show Korbe */}
          <div className="flex items-center gap-4 pt-1">
            <a
              href={instagramUrl}
              target={getTarget(instagramUrl)}
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700/80 bg-[#141414] text-gray-300 transition duration-300 hover:border-[#FF6400] hover:text-[#FF6400]"
            >
              <FaInstagram className="text-lg" />
            </a>

            <a
              href={linkedinUrl}
              target={getTarget(linkedinUrl)}
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700/80 bg-[#141414] text-gray-300 transition duration-300 hover:border-[#FF6400] hover:text-[#FF6400]"
            >
              <FaLinkedinIn className="text-base" />
            </a>

            <a
              href={facebookUrl}
              target={getTarget(facebookUrl)}
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700/80 bg-[#141414] text-gray-300 transition duration-300 hover:border-[#FF6400] hover:text-[#FF6400]"
            >
              <FaFacebookF className="text-base" />
            </a>

            <a
              href={whatsappUrl}
              target={getTarget(whatsappUrl)}
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700/80 bg-[#141414] text-gray-300 transition duration-300 hover:border-[#FF6400] hover:text-[#FF6400]"
            >
              <FaWhatsapp className="text-lg" />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-5 pt-2">
            <a
              href="#contact"
              className="rounded-xl bg-[#FF6400] px-9 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-[#e05800] hover:shadow-lg hover:shadow-[#FF6400]/20"
            >
              Hire Me
            </a>
            {data.cvUrl && (
              <button
                type="button"
                onClick={() => handleDownloadCv(data.cvUrl)}
                disabled={downloading}
                className="rounded-xl border border-neutral-700/90 bg-transparent px-9 py-3.5 text-base font-semibold text-gray-200 transition-all duration-300 hover:border-gray-500 hover:bg-neutral-800/50 disabled:opacity-50"
              >
                {downloading ? "Downloading..." : "Download CV"}
              </button>
            )}
          </div>

          {/* Counter Stats Box */}
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-6 rounded-2xl border border-neutral-800/80 bg-[#121212]/90 p-6 text-left shadow-xl backdrop-blur-md">
            <div>
              <h3 className="text-2xl font-extrabold text-[#FF6400] sm:text-3xl">
                {data.experienceYears || "0"}
              </h3>
              <p className="mt-1 text-xs font-medium text-gray-400 sm:text-sm">Experiences</p>
            </div>
            <div className="border-l border-neutral-800/80 pl-6">
              <h3 className="text-2xl font-extrabold text-[#FF6400] sm:text-3xl">
                {data.projectsDone || "0"}
              </h3>
              <p className="mt-1 text-xs font-medium text-gray-400 sm:text-sm">Project done</p>
            </div>
            <div className="border-l border-neutral-800/80 pl-6">
              <h3 className="text-2xl font-extrabold text-[#FF6400] sm:text-3xl">
                {data.happyClients || "0"}
              </h3>
              <p className="mt-1 text-xs font-medium text-gray-400 sm:text-sm">Happy Clients</p>
            </div>
          </div>
        </div>

        {/* Right Circular Profile Image with Floating Effect */}
        <div className="flex w-full items-center justify-center lg:w-1/2 lg:justify-start lg:-ml-12">
          <div className="animate-float relative h-[340px] w-[340px] rounded-full bg-[#151515] transition-all duration-500 hover:scale-105 sm:h-[460px] sm:w-[460px] lg:h-[580px] lg:w-[580px] xl:h-[640px] xl:w-[640px]">
            <img
              src={data.imageUrl || "/placeholder.jpg"}
              alt={data.name || "Hero Image"}
              className="absolute inset-0 h-full w-full rounded-full object-cover shadow-2xl shadow-[#FF6400]/10"
            />
          </div>
        </div>

      </div>
    </section>
  );
}