"use client";

import { Bell, Search, Command } from "lucide-react";

export default function Topbar() {
  return (
    <header className="fixed left-[250px] right-0 top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white/90 px-8 backdrop-blur-xl">
      {/* Search */}

      <button className="flex h-10 w-[340px] items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-left transition hover:border-gray-300 hover:bg-white">
        <Search size={16} className="text-gray-400" />

        <span className="flex-1 text-xs text-gray-400">
          Search products, manufacturers...
        </span>

        <span className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[10px] text-gray-400 shadow-sm">
          <Command size={10} />
          K
        </span>
      </button>

      {/* Right */}

      <div className="flex items-center gap-3">
        <div className="mr-2 flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-emerald-700">
            System operational
          </span>
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
          <Bell size={17} strokeWidth={1.8} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>

        <div className="h-7 w-px bg-gray-200" />

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white">
          YA
        </div>
      </div>
    </header>
  );
}