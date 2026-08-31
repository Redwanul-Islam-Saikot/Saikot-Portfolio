"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: {
      hero: number;
      services: number;
      about: number;
      projects: number;
      skills: number;
      education: number;
      messages: number;
      footer: number;
    };
    recentContacts: any[];
  }>({
    stats: {
      hero: 0,
      services: 0,
      about: 0,
      projects: 0,
      skills: 0,
      education: 0,
      messages: 0,
      footer: 0,
    },
    recentContacts: [],
  });

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const resData = await res.json();
      if (resData.success) {
        setData({
          stats: resData.stats,
          recentContacts: resData.recentContacts || [],
        });
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Hero", value: data.stats.hero, icon: "🛠️" },
    { label: "Services", value: data.stats.services, icon: "⚙️" },
    { label: "About Me", value: data.stats.about, icon: "⚙️" },
    { label: "Projects", value: data.stats.projects, icon: "🎨" },
    { label: "Skills", value: data.stats.skills, icon: "⚡" },
    { label: "Education", value: data.stats.education, icon: "⚡" },
    { label: "Messages", value: data.stats.messages, icon: "📩" },
    { label: "Footer", value: data.stats.footer, icon: "📩" },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back, Saikot</p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchDashboardData();
          }}
          className="rounded-xl bg-[#151515] px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 flex items-center gap-2"
        >
          Refresh Data 🔄
        </button>
      </div>

      {/* Live Section Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
              <h2 className="mt-2 text-3xl font-bold text-[#FF6400]">
                {loading ? "..." : stat.value}
              </h2>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        ))}
      </div>

      {/* Recent Contact Inquiries */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Messages (Last 7 Days)</h2>
          <span className="rounded-full bg-[#FF6400]/10 px-3 py-1 text-xs font-semibold text-[#FF6400]">
            {data.recentContacts.length} New Messages
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Subject / Message</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    Loading messages...
                  </td>
                </tr>
              ) : data.recentContacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No messages received in the last 7 days.
                  </td>
                </tr>
              ) : (
                data.recentContacts.map((contact: any) => {
                  // Fallback for Name
                  const name =
                    contact.name ||
                    contact.fullName ||
                    contact.userName ||
                    contact.author ||
                    "Anonymous";

                  // Fallback for Email
                  const email =
                    contact.email ||
                    contact.mail ||
                    contact.emailAddress ||
                    contact.userEmail ||
                    "N/A";

                  // Fallback for Subject / Message / Details
                  const message =
                    contact.message ||
                    contact.subject ||
                    contact.details ||
                    contact.desc ||
                    contact.description ||
                    contact.title ||
                    "N/A";

                  const date = contact.createdAt || contact.date || contact.updatedAt;

                  return (
                    <tr key={contact._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">{email}</td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-gray-800">
                        {message}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {date
                          ? new Date(date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}