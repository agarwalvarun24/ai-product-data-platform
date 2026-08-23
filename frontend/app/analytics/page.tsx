"use client";

import { useEffect, useState } from "react";
import {
  getAnalyticsSummary,
  AnalyticsSummary,
} from "@/lib/api";

export default function AnalyticsPage() {
  const [stats, setStats] =
    useState<AnalyticsSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getAnalyticsSummary();
        setStats(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load analytics.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f9fc] p-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-slate-500">
            Loading analytics...
          </p>
        </div>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="min-h-screen bg-[#f8f9fc] p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-red-50 p-5 text-red-600">
            {error || "Analytics unavailable."}
          </div>
        </div>
      </main>
    );
  }

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

  return (
    <main className="min-h-screen bg-[#f8f9fc] p-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.25em] text-indigo-600">
            DATA INTELLIGENCE
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Analytics
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor product enrichment quality and
            AI performance.
          </p>
        </div>

        {/* STAT CARDS */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Products"
            value={stats.total_products}
            description="Imported into workspace"
          />

          <StatCard
            label="AI Enriched"
            value={stats.ai_enriched}
            description="Products processed by AI"
            valueClass="text-indigo-600"
          />

          <StatCard
            label="Needs Review"
            value={stats.needs_review}
            description="Require human verification"
            valueClass="text-amber-500"
          />

          <StatCard
            label="Enrichment Coverage"
            value={`${coverage}%`}
            description="Products enriched"
            valueClass="text-emerald-600"
          />

        </div>

        {/* QUALITY */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          <div className="rounded-xl bg-white p-7 shadow-sm">

            <h2 className="text-xl font-semibold text-slate-900">
              AI Quality Score
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Average confidence of enriched products
            </p>

            <div className="mt-8 flex items-center gap-6">

              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-indigo-50">

                <span className="text-3xl font-bold text-indigo-600">
                  {Math.round(
                    stats.average_ai_confidence,
                  )}
                  %
                </span>

              </div>

              <div>

                <p className="text-lg font-semibold text-slate-900">
                  Average AI Confidence
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Higher confidence means generated
                  product information is more likely
                  to require no manual correction.
                </p>

              </div>

            </div>
          </div>

          {/* PIPELINE */}

          <div className="rounded-xl bg-white p-7 shadow-sm">

            <h2 className="text-xl font-semibold text-slate-900">
              Enrichment Pipeline
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current product processing status
            </p>

            <PipelineRow
              label="Imported"
              value={stats.pipeline.imported}
              percentage={
                stats.total_products > 0
                  ? 100
                  : 0
              }
            />

            <PipelineRow
              label="AI Enriched"
              value={stats.pipeline.ai_enriched}
              percentage={coverage}
            />

            <PipelineRow
              label="Needs Review"
              value={stats.pipeline.needs_review}
              percentage={reviewPercentage}
            />

          </div>

        </div>

        {/* DIFFERENTIATOR */}

        <div className="mt-6 rounded-xl bg-slate-900 p-7 text-white">

          <p className="text-sm font-semibold tracking-[0.2em] text-indigo-300">
            PRODUCT INTELLIGENCE
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            AI + Human Quality Loop
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Product data is automatically enriched by
            AI, scored for confidence, and routed to
            human review when confidence is low.
            This combines automation with human
            quality control instead of simply
            generating product descriptions.
          </p>

        </div>

      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
  valueClass = "text-slate-900",
}: {
  label: string;
  value: string | number;
  description: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p
        className={`mt-3 text-4xl font-bold ${valueClass}`}
      >
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>

    </div>
  );
}

function PipelineRow({
  label,
  value,
  percentage,
}: {
  label: string;
  value: number;
  percentage: number;
}) {
  return (
    <div className="mt-7">

      <div className="mb-2 flex justify-between text-sm">

        <span className="text-slate-600">
          {label}
        </span>

        <span className="font-semibold">
          {value}
        </span>

      </div>

      <div className="h-3 rounded-full bg-slate-100">

        <div
          className="h-3 rounded-full bg-indigo-500"
          style={{
            width: `${Math.min(
              percentage,
              100,
            )}%`,
          }}
        />

      </div>

    </div>
  );
}