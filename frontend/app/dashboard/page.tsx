import {
  ArrowUpRight,
  Database,
  FileWarning,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";

const metrics = [
  {
    label: "Products processed",
    value: "12,482",
    change: "+18.4%",
    icon: Database,
  },
  {
    label: "Data quality",
    value: "94.2%",
    change: "+12.8%",
    icon: TrendingUp,
  },
  {
    label: "AI enriched",
    value: "8,921",
    change: "+24.6%",
    icon: Sparkles,
  },
  {
    label: "Needs review",
    value: "1,248",
    change: "-8.2%",
    icon: FileWarning,
  },
];

export default function DashboardPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Overview"
        title="Product intelligence"
        description="Monitor product data quality, AI enrichment, and review activity from one workspace."
      />

      {/* Metrics */}

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                  <Icon size={17} strokeWidth={1.8} />
                </div>

                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  {metric.change}
                  <ArrowUpRight size={12} />
                </span>
              </div>

              <div className="mt-5">
                <div className="text-[27px] font-semibold tracking-[-0.03em] text-gray-950">
                  {metric.value}
                </div>

                <div className="mt-1 text-xs text-gray-400">
                  {metric.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main analytics area */}

      <div className="mt-5 grid grid-cols-[1.7fr_1fr] gap-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Data quality improvement
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Average product quality over the last 30 days
              </p>
            </div>

            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-gray-50">
              Last 30 days
            </button>
          </div>

          <div className="relative mt-8 h-[260px] overflow-hidden rounded-xl bg-gray-50/70 p-5">
            <div className="absolute inset-0 opacity-60">
              <div className="h-full w-full bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>

            <div className="relative flex h-full items-end gap-3">
              {[42, 48, 51, 57, 55, 64, 68, 71, 73, 78, 82, 86, 88, 91].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group flex flex-1 items-end"
                  >
                    <div
                      className="w-full rounded-t-lg bg-indigo-500/80 transition-all duration-300 group-hover:bg-indigo-600"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Activity */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Recent activity
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Latest platform events
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {[
              ["AI enrichment completed", "2,482 products", "2 min ago"],
              ["New dataset imported", "manufacturer_catalog.xlsx", "18 min ago"],
              ["Review queue updated", "142 items", "31 min ago"],
              ["Website extraction completed", "acme-industrial.com", "1 hr ago"],
            ].map(([title, detail, time]) => (
              <div key={title} className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-gray-800">
                    {title}
                  </div>

                  <div className="mt-1 truncate text-[11px] text-gray-400">
                    {detail}
                  </div>
                </div>

                <div className="shrink-0 text-[10px] text-gray-400">
                  {time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}