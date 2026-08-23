"use client";

import {
  ArrowUpRight,
  Database,
  FileWarning,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { getAnalyticsSummary } from "@/lib/api";

interface AnalyticsData {
  total_products: number;
  ai_enriched: number;
  needs_review: number;
  enrichment_coverage: number;
  average_ai_confidence: number;
  pipeline: {
    imported: number;
    ai_enriched: number;
    needs_review: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getAnalyticsSummary();

        setStats(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main>
        <PageHeader
          eyebrow="Overview"
          title="Product intelligence"
          description="Monitor product data quality, AI enrichment, and review activity from one workspace."
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          Loading dashboard...
        </div>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main>
        <PageHeader
          eyebrow="Overview"
          title="Product intelligence"
          description="Monitor product data quality, AI enrichment, and review activity from one workspace."
        />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error || "Dashboard data unavailable."}
        </div>
      </main>
    );
  }

  const quality = Math.round(
    stats.average_ai_confidence,
  );

  const coverage = Math.round(
    stats.enrichment_coverage,
  );

  const reviewPercentage =
    stats.total_products > 0
      ? Math.round(
          (stats.needs_review /
            stats.total_products) *
            100,
        )
      : 0;

  const metrics = [
    {
      label: "Products processed",
      value: stats.total_products.toLocaleString(),
      change: "Live",
      icon: Database,
    },
    {
      label: "Data quality",
      value: `${quality}%`,
      change: "AI confidence",
      icon: TrendingUp,
    },
    {
      label: "AI enriched",
      value: stats.ai_enriched.toLocaleString(),
      change: `${coverage}% coverage`,
      icon: Sparkles,
    },
    {
      label: "Needs review",
      value: stats.needs_review.toLocaleString(),
      change:
        stats.needs_review > 0
          ? "Review required"
          : "Queue clear",
      icon: FileWarning,
    },
  ];

  /*
   * We do not have historical quality scores in the database.
   * Therefore the chart uses real current indicators instead
   * of inventing historical numbers.
   */
  const qualityBars = [
    {
      label: "Imported",
      value: 100,
      count: stats.total_products,
    },
    {
      label: "AI enriched",
      value: coverage,
      count: stats.ai_enriched,
    },
    {
      label: "AI confidence",
      value: quality,
      count: null,
    },
  ];

  return (
    <main>
      <PageHeader
        eyebrow="Overview"
        title="Product intelligence"
        description="Monitor product data quality, AI enrichment, and review activity from one workspace."
      />

      {/* METRICS */}

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
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />
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

      {/* MAIN DASHBOARD AREA */}

      <div className="mt-5 grid grid-cols-[1.7fr_1fr] gap-5">

        {/* DATA QUALITY IMPROVEMENT */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Data quality improvement
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Live view of the product enrichment pipeline
              </p>
            </div>

            <span className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-500">
              Live data
            </span>

          </div>

          {/* VISUAL QUALITY CHART */}

          <div className="relative mt-8 h-[260px] overflow-hidden rounded-xl bg-gray-50/70 p-6">

            <div className="absolute inset-0 opacity-60">
              <div className="h-full w-full bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>

            <div className="relative flex h-full items-end gap-8">

              {qualityBars.map(
                (bar) => (
                  <div
                    key={bar.label}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >

                    <div className="mb-2 text-center">

                      <span className="text-sm font-semibold text-gray-800">
                        {bar.value}%
                      </span>

                      {bar.count !== null && (
                        <span className="ml-1 text-[10px] text-gray-400">
                          ({bar.count.toLocaleString()})
                        </span>
                      )}

                    </div>

                    <div
                      className="w-full rounded-t-lg bg-indigo-500/80 transition-all duration-300 group-hover:bg-indigo-600"
                      style={{
                        height: `${Math.max(
                          bar.value,
                          3,
                        )}%`,
                      }}
                    />

                    <div className="mt-3 text-center text-[11px] text-gray-500">
                      {bar.label}
                    </div>

                  </div>
                ),
              )}

            </div>

          </div>

          {/* QUALITY SUMMARY */}

          <div className="mt-5 grid grid-cols-3 gap-3">

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                AI quality
              </p>

              <p className="mt-1 text-lg font-semibold text-indigo-600">
                {quality}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Coverage
              </p>

              <p className="mt-1 text-lg font-semibold text-emerald-600">
                {coverage}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Review queue
              </p>

              <p className="mt-1 text-lg font-semibold text-amber-500">
                {stats.needs_review}
              </p>
            </div>

          </div>

        </div>

        {/* RECENT ACTIVITY */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6">

          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Recent activity
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Current platform events
            </p>
          </div>

          <div className="mt-6 space-y-5">

            <Activity
              title="Dataset imported"
              detail={`${stats.total_products.toLocaleString()} products available`}
            />

            <Activity
              title="AI enrichment"
              detail={`${stats.ai_enriched.toLocaleString()} products processed`}
            />

            <Activity
              title="Review queue"
              detail={
                stats.needs_review > 0
                  ? `${stats.needs_review} products require review`
                  : "No products currently require review"
              }
            />

            <Activity
              title="AI quality analysis"
              detail={`Average confidence: ${quality}%`}
            />

          </div>

          {/* PIPELINE SUMMARY */}

          <div className="mt-8 rounded-xl bg-slate-900 p-5 text-white">

            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
              Product Intelligence
            </p>

            <p className="mt-2 text-sm font-semibold">
              AI + Human Quality Loop
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-300">
              AI enriches product information,
              confidence scores measure reliability,
              and low-confidence results can be
              sent to human review.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

function Activity({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="flex gap-3">

      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />

      <div className="min-w-0 flex-1">

        <div className="text-xs font-medium text-gray-800">
          {title}
        </div>

        <div className="mt-1 truncate text-[11px] text-gray-400">
          {detail}
        </div>

      </div>

    </div>
  );
}