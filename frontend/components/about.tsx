"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiDownload } from "react-icons/fi";

export default function AboutSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    fetch(cleanBaseUrl + "/api/about")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          const active = resData.data.find((item: any) => item.isActive !== false);
          setData(active || null);
        }
      })
      .catch((err) => console.error("Error fetching about:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadCv = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      window.open(url, "_blank");
    }
  };

  if (loading || !data) return null;

  const aboutDescription = data.description || data.bioText || "";

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 pt-12 pb-6 text-white sm:pl-8 sm:pr-4 md:pl-12 md:pr-6 lg:pl-16 lg:pr-6 lg:pt-16 lg:pb-8">
      {/* Background Soft Glow */}
      <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#FF6400]/10 blur-[150px]" />

      {/* Hero Layout Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-between space-y-10">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            About Me
          </h2>
          {data.subtitle && (
            <p className="mx-auto max-w-xl text-sm font-normal text-gray-400 sm:text-base">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* About Main Content */}
        <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:gap-6">
          
          {/* Left Arch/Profile Image Area (Full Cover with Border) */}
          <div className="flex w-full items-center justify-center lg:w-1/2 lg:justify-start">
            <div className="relative h-[340px] w-[340px] overflow-hidden rounded-t-[170px] rounded-b-3xl border-2 border-[#FF6400]/40 bg-[#151515] shadow-xl sm:h-[460px] sm:w-[460px] sm:rounded-t-[230px] lg:h-[480px] lg:w-[480px] lg:rounded-t-[240px] xl:h-[520px] xl:w-[520px]">
              {data.imageUrl && (
                <img
                  src={data.imageUrl}
                  alt="About Me"
                  className="h-full w-full object-cover object-center"
                />
              )}
            </div>
          </div>

          {/* Right Text & Action Buttons Content */}
          <div className="w-full flex-1 space-y-6 text-left lg:w-1/2 lg:pr-2">
            <p className="whitespace-pre-line text-base font-light leading-relaxed text-gray-300 sm:text-lg">
              {aboutDescription}
            </p>

            {/* Action Buttons Section */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Hire Me Link with /contact route */}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-[#FF6400] px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-[#e05800] hover:shadow-lg hover:shadow-[#FF6400]/20"
              >
                Hire Me
              </Link>

              {/* Download CV Button */}
              {data.cvUrl && (
                <button
                  type="button"
                  onClick={() => handleDownloadCv(data.cvUrl)}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-neutral-700 bg-transparent px-8 py-3.5 text-base font-semibold text-gray-200 transition-all duration-300 hover:border-gray-500 hover:bg-neutral-800/50"
                >
                  <FiDownload className="text-xl" />
                  <span>Download CV</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Skills & Percentages Dynamic Progress Rings */}
        {data.skills && data.skills.length > 0 && (
          <div className="grid grid-cols-2 gap-8 pt-6 sm:grid-cols-3 md:grid-cols-5">
            {data.skills.map((skill: any, idx: number) => {
              const skillLogo = skill.logoUrl || skill.iconUrl;
              const radius = 50;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (skill.percentage / 100) * circumference;

              return (
                <div key={idx} className="flex flex-col items-center space-y-3">
                  <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        className="stroke-neutral-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        className="stroke-[#FF6400] transition-all duration-1000 ease-out"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>

                    {/* Skill Logo or Percentage Inside Circle */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      {skillLogo ? (
                        <img src={skillLogo} alt={skill.name} className="h-10 w-10 object-contain" />
                      ) : (
                        <span className="text-base font-bold text-white">{skill.percentage}%</span>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="block text-base font-bold text-[#FF6400]">{skill.percentage}%</span>
                    <span className="text-sm font-semibold text-gray-300">{skill.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}