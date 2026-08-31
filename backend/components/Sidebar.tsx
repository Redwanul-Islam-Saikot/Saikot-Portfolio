"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Briefcase,
  UserCheck,
  FolderGit2,
  GraduationCap,
  Mail,
  PanelBottom,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Hero", href: "/admin/hero", icon: Wrench },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "About Me", href: "/admin/about", icon: UserCheck },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Messages", href: "/admin/contact", icon: Mail },
  { name: "Footer", href: "/admin/footer", icon: PanelBottom },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0;";
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white p-5 text-gray-700">
      {/* Brand Header */}
      <div className="mb-8 border-b border-gray-100 pb-5">
        <Link href="/admin/dashboard" className="text-xl font-bold tracking-wider text-[#FF6400]">
          SAIKOT R.
        </Link>
        <span className="mt-1 block text-xs font-medium text-gray-500">Portfolio Admin</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-[#FF6400] text-white shadow-md shadow-orange-500/20"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
      >
        <LogOut className="h-5 w-5" /> Logout
      </button>
    </aside>
  );
}