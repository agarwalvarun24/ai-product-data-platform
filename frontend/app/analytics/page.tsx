"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

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

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsData>({
    total_products: 0,
    ai_enriched: 0,
    needs_review: 0,
    enrichment_coverage: 0,
    average_ai_confidence: 0,
    pipeline: {
      imported: 0,
      ai_enriched: 0,
      needs_review: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/analytics/summary`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              `Failed to load analytics (${response.status})`
          );
        }

        setStats(data);
      } catch (error) {
        console.error(
          "Failed to load analytics:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load analytics."
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

  if (error) {
    return (
      <main className="min-h-screen bg-[#f8f9fc] p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-red-50 p-6 text-red-600">
            Failed to load analytics: {error}
          </div>
        </div>
      </main>
    );
  }

  const enrichedPercentage =
    stats.total_products > 0
      ? Math.min(
          (stats.ai_enriched / stats.total_products) *
            100,
          100
        )
      : 0;

  const reviewPercentage =
    stats.total_products > 0
      ? Math.min(
          (stats.needs_review /
            stats.total_products) *
            100,
          100
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

        {/* MAIN STAT CARDS */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Products
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-900">
              {stats.total_products}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Imported into workspace
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              AI Enriched
            </p>

            <p className="mt-3 text-4xl font-bold text-indigo-600">
              {stats.ai_enriched}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Products processed by AI
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Needs Review
            </p>

            <p className="mt-3 text-4xl font-bold text-amber-500">
              {stats.needs_review}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Require human verification
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Enrichment Coverage
            </p>

            <p className="mt-3 text-4xl font-bold text-emerald-600">
              {stats.enrichment_coverage}%
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Products enriched
            </p>
          </div>

        </div>

        {/* QUALITY SECTION */}

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
                  {stats.average_ai_confidence}%
                </span>
              </div>

              <div>
                <p className="text-lg font-semibold text-slate-900">
                  Average AI Confidence
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Higher confidence means the generated
                  product information is more likely to
                  require no manual correction.
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

            <div className="mt-8 space-y-6">

              {/* IMPORTED */}

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">
                    Imported
                  </span>

                  <span className="font-semibold">
                    {stats.pipeline.imported}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-slate-400"
                    style={{
                      width:
                        stats.total_products > 0
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* AI ENRICHED */}

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">
                    AI Enriched
                  </span>

                  <span className="font-semibold">
                    {stats.pipeline.ai_enriched}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-indigo-500"
                    style={{
                      width: `${enrichedPercentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* NEEDS REVIEW */}

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">
                    Needs Review
                  </span>

                  <span className="font-semibold">
                    {stats.pipeline.needs_review}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-amber-400"
                    style={{
                      width: `${reviewPercentage}%`,
                    }}
                  />
                </div>
              </div>

            </div>
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
            Product data is automatically enriched by AI,
            scored for confidence, and routed to human
            review when confidence is low. This creates a
            continuous quality-control workflow instead of
            simply generating product descriptions.
          </p>

        </div>

      </div>
    </main>
  );
}