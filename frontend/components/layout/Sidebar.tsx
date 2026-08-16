"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Database,
  FileCheck2,
  LayoutDashboard,
  Package,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Data Input",
    href: "/ingest",
    icon: Upload,
  },
  {
    label: "AI Enrichment",
    href: "/enrichment",
    icon: Sparkles,
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
  },
  {
    label: "Review Center",
    href: "/review",
    icon: FileCheck2,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[250px] flex-col border-r border-gray-200 bg-white">
      {/* Brand */}

      <div className="flex h-[72px] items-center border-b border-gray-100 px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Database size={18} strokeWidth={2.3} />
          </div>

          <div>
            <div className="text-[15px] font-semibold tracking-tight text-gray-950">
              ProductIQ
            </div>

            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-400">
              Data Intelligence
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}

      <nav className="flex-1 px-3 py-5">
        <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
          Workspace
        </div>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all",
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                ].join(" ")}
              >
                <Icon
                  size={17}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={
                    active
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                />

                <span>{item.label}</span>

                {item.label === "AI Enrichment" && (
                  <span className="ml-auto rounded-md bg-indigo-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-600">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}

      <div className="border-t border-gray-100 p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings size={17} strokeWidth={1.8} />
          Settings
        </Link>

        <div className="mt-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white">
            AI
          </div>

          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-gray-800">
              Data Workspace
            </div>
            <div className="truncate text-[10px] text-gray-400">
              Development
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}