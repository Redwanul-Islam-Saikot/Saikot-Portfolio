"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Password Validation
    if (password === "Abhiman@2020") {
      // Set authentication cookie for dashboard access
      document.cookie = "admin_token=authenticated; path=/; max-age=86400";
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setErrorMessage("Incorrect password! Please try again with the correct password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 font-sans text-gray-900">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-wider text-[#FF6400]">
            Saikot Portfolio
          </h1>
          <p className="mt-2 text-sm text-gray-500">Admin Control Panel</p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@saikot.com"
              required
              className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#FF6400] focus:bg-white focus:ring-2 focus:ring-[#FF6400]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#FF6400] focus:bg-white focus:ring-2 focus:ring-[#FF6400]/20"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#FF6400] py-3 text-base font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-[#e05800]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}